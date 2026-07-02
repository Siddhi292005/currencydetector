from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import os
import httpx
from datetime import datetime

from utils.predict import (
    preprocess_image, preprocess_pil,
    decode, detect_note_regions
)
from utils.constants import CURRENCY_INFO, FALLBACK_RATES, FALLBACK_HISTORICAL

# ── App setup ──────────────────────────────────────────────────────
app = FastAPI(title="CURREX API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model ─────────────────────────────────────────────────────
MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "model", "currex_final_93.keras"
)
print(f"Loading model from {MODEL_PATH}...")
model = load_model(MODEL_PATH)
print(f"Model loaded - output shape: {model.output_shape}")

# ── Rate caches ────────────────────────────────────────────────────
_rates_cache     = {}
_historical_cache = {}
CONFIDENCE_THRESHOLD = 45.0

# ── Rate functions ─────────────────────────────────────────────────
async def get_live_rates():
    """Fetch live exchange rates vs INR. Falls back to hardcoded if API fails."""
    global _rates_cache

    if _rates_cache.get('timestamp'):
        age = (datetime.now() - _rates_cache['timestamp']).seconds
        if age < 3600:
            return _rates_cache['rates']

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(
                'https://api.frankfurter.dev/v1/latest?from=INR&to=USD,EUR,JPY,KRW'
            )
            data  = res.json()
            rates = data.get('rates', {})

            converted = {
                'INR': 1.0,
                'USD': round(1 / rates['USD'], 4) if 'USD' in rates else FALLBACK_RATES['USD'],
                'EUR': round(1 / rates['EUR'], 4) if 'EUR' in rates else FALLBACK_RATES['EUR'],
                'JPY': round(1 / rates['JPY'], 4) if 'JPY' in rates else FALLBACK_RATES['JPY'],
                'KRW': round(1 / rates['KRW'], 4) if 'KRW' in rates else FALLBACK_RATES['KRW'],
            }
            print(f" Live rates fetched: {converted}")
            _rates_cache = {
                'rates':     converted,
                'timestamp': datetime.now()
            }
            return converted

    except Exception as e:
        print(f"⚠️ Rate API failed: {e} — using fallback")
        return FALLBACK_RATES


async def get_historical_rates(currency: str):
    """Fetch 10-year historical rates for a currency vs INR."""
    global _historical_cache

    if currency in _historical_cache:
        return _historical_cache[currency]

    if currency not in ['USD', 'EUR', 'JPY']:
        return FALLBACK_HISTORICAL.get(currency, [])

    try:
        history = []
        async with httpx.AsyncClient(timeout=10.0) as client:
            for year in range(2015, 2026):
                date = f"{year}-06-15"
                res  = await client.get(
                    f'https://api.frankfurter.dev/v1/{date}?from={currency}&to=INR'
                )
                if res.status_code == 200:
                    data = res.json()
                    rate = data.get('rates', {}).get('INR')
                    if rate:
                        history.append({"year": str(year), "rate": round(rate, 4)})

        if history:
            _historical_cache[currency] = history
            print(f"Historical rates fetched for {currency}: {len(history)} data points — {history}") 
            return history

    except Exception as e:
        print(f"⚠️ Historical API failed for {currency}: {e} — using fallback")

    return FALLBACK_HISTORICAL.get(currency, [])


# ── Routes ─────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status":     "running",
        "model":      "ResNet50V2 — 28 classes",
        "currencies": ["INR", "USD", "EUR", "JPY", "KRW"]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/rates")
async def get_rates():
    rates = await get_live_rates()
    return {"rates": rates, "source": "frankfurter.dev"}

@app.get("/classes")
def get_classes():
    return {"classes": list(CURRENCY_INFO.keys())}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # ── Detect note regions ────────────────────────────────────────
    note_regions, multiple_detected = detect_note_regions(image_bytes)

    # ── Classify each region ───────────────────────────────────────
    rates   = await get_live_rates()
    results = []

    for region_img in note_regions:
        arr   = preprocess_pil(region_img)
        preds = model.predict(arr, verbose=0)
        top_preds = decode(preds, top_k=3)
        top       = top_preds[0]
        runner_up = top_preds[1]["confidence"]
        margin    = top["confidence"] - runner_up
        print(f"DEBUG top3: {top_preds}")

        if top["confidence"] < CONFIDENCE_THRESHOLD:
            continue
        if top["confidence"] < 60.0 and margin < 12.0:
            continue  # weak AND ambiguous vs runner-up — reject rather than guess wrong

        class_label = top["class_label"]
        if class_label not in CURRENCY_INFO:
            continue

        info         = CURRENCY_INFO[class_label]
        currency     = info["currency"]
        denomination = info["denomination"]
        rate         = rates.get(currency, FALLBACK_RATES.get(currency, 1.0))
        inr_value    = round(denomination * rate, 2)
        historical   = await get_historical_rates(currency)

        results.append({
            "class_label":      class_label,
            "currency":         currency,
            "denomination":     denomination,
            "symbol":           info["symbol"],
            "country":          info["country"],
            "flag":             info["flag"],
            "face_value":       f"{info['symbol']}{denomination:,}",
            "inr_value":        inr_value,
            "confidence":       round(top["confidence"], 2),
            "exchange_rate":    rate,
            "historical_rates": historical,
            "top_predictions":  top_preds,
        })

    # ── No confident result ────────────────────────────────────────
    if not results:
        raise HTTPException(
            status_code=422,
            detail="Could not confidently identify any currency note. Please try a clearer photo of a single banknote."
        )

    # ── Single note ────────────────────────────────────────────────
    if len(results) == 1:
        return {
            "success":           True,
            "multiple_detected": False,
            "count":             1,
            "notes":             results,
            **results[0]
        }

    # ── Multiple notes ─────────────────────────────────────────────
    total_inr = sum(r["inr_value"] for r in results)
    primary   = results[0]

    return {
        "success":           True,
        "multiple_detected": True,
        "count":             len(results),
        "notes":             results,
        "class_label":       primary["class_label"],
        "currency":          primary["currency"],
        "denomination":      primary["denomination"],
        "symbol":            primary["symbol"],
        "country":           primary["country"],
        "flag":              primary["flag"],
        "face_value":        primary["face_value"],
        "inr_value":         total_inr,
        "confidence":        primary["confidence"],
        "exchange_rate":     primary["exchange_rate"],
        "historical_rates":  primary["historical_rates"],
        "top_predictions":   primary["top_predictions"],
    }