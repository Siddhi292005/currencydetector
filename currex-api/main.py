from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import os
import httpx
from datetime import datetime
from utils.predict import preprocess_image, decode
from utils.constants import (
    CURRENCY_INFO,
    FALLBACK_RATES,
    FALLBACK_HISTORICAL
)

app = FastAPI(
    title="currexapi",
    description="multicurrency recognition api - inr, usd, eur, jpy, krw",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model
modelpath = os.path.join(
    os.path.dirname(__file__),
    "model",
    "currex_final_93.keras"
)
_rates_cache = {}
_historical_cache = {}

async def getliverates():
    global _rates_cache
    if _rates_cache.get('timestamp'):
        age=(datetime.now() - _rates_cache['timestamp']).total_seconds()
        if age < 3600:
            return _rates_cache['rates']
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get('https://api.frankfurter.dev/v1/latest?from=INR&to=USD,EUR,JPY,KRW')
            res.raise_for_status()
            data = res.json()
            rates = data.get("rates", {})
            converted={
                'INR':1.0,
                "USD": rates.get("USD", FALLBACK_RATES["USD"]),
                "EUR": rates.get("EUR", FALLBACK_RATES["EUR"]),
                "JPY": rates.get("JPY", FALLBACK_RATES["JPY"]),
                "KRW": rates.get("KRW", FALLBACK_RATES["KRW"])
            }
            _rates_cache = {
                'timestamp': datetime.now(),
                'rates': converted
            }
            return converted
    except Exception as e:
        print(f"Error fetching live rates: {e}")
        return FALLBACK_RATES
    
async def gethistoricalrates(currency: str):
    global _historical_cache

    if currency in _historical_cache:
        return _historical_cache[currency]

    if currency not in ["USD", "EUR", "JPY", "KRW"]:
        return FALLBACK_HISTORICAL.get(currency, [])

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            history = []
            years = range(2015, 2026)

            for year in years:
                try:
                    date = f"{year}-06-15"

                    res = await client.get(
                        f"https://api.frankfurter.dev/v1/{date}?from={currency}&to=INR"
                    )

                    res.raise_for_status()

                    data = res.json()
                    print("Historical response:", data)
                    rate = data.get("rates", {}).get("INR")

                    if rate:
                        history.append({
                            "date": date,
                            "rate": round(rate, 4)
                        })

                except Exception as e:
                    print(f"Failed {currency} {year}: {e}")

            if history:
                _historical_cache[currency] = history
                print(
                    f"Historical rates fetched for {currency}: {len(history)} points"
                )
                return history

            return FALLBACK_HISTORICAL.get(currency, [])

    except Exception as e:
        print(f"Error fetching historical rates for {currency}: {e}")
        return FALLBACK_HISTORICAL.get(currency, [])
print(f"Loading model from {modelpath}...")


model = load_model(modelpath)

print(f"Model loaded - output shape: {model.output_shape}")


@app.get("/")
def root():
    return {
        "status": "running",
        "model": "ResNet50V2 — 16 classes",
        "currencies": ["INR", "USD", "EUR"]
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File must be an image (JPEG, PNG, etc.)"
        )

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded"
        )

    img_array = preprocess_image(image_bytes)

    predictions = model.predict(img_array, verbose=0)

    top_predictions = decode(predictions, top_k=3)

    top = top_predictions[0]

    class_label = top["class_label"]
    confidence = top["confidence"]

    if class_label not in CURRENCY_INFO:
        raise HTTPException(
            status_code=500,
            detail="Unknown class predicted"
        )

    info = CURRENCY_INFO[class_label]

    currency = info["currency"]
    denomination = info["denomination"]
    rates=await getliverates()
    rate = rates.get(currency, FALLBACK_RATES.get(currency, 1.0))
    inr_value = round(denomination * rate, 2)
    historical = await gethistoricalrates(currency)

    return {
        "success": True,
        "class_label": class_label,
        "currency": currency,
        "denomination": denomination,
        "symbol": info["symbol"],
        "country": info["country"],
        "flag": info["flag"],
        "face_value": f"{info['symbol']}{denomination}",
        "inr_value": inr_value,
        "confidence": round(confidence, 2),
        "exchange_rate": rate,
        "historical_rates": historical,
        "top_predictions": top_predictions
    }





@app.get("/classes")
def get_classes():
    return {
        "classes": list(CURRENCY_INFO.keys())
    }