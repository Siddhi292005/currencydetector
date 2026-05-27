from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import os

from utils.predict import preprocess_image, decode
from utils.constants import (
    CURRENCY_INFO,
    EXCHANGE_RATES,
    HISTORICAL_RATES
)

app = FastAPI(
    title="currexapi",
    description="multicurrency recognition api - inr, usd, eur",
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
    "best_multicurrency.keras"
)

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

    rate = EXCHANGE_RATES.get(currency, 1.0)

    inr_value = round(denomination * rate, 2)

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
        "historical_rates": HISTORICAL_RATES.get(currency, []),
        "top_predictions": top_predictions
    }


@app.get("/rates")
def get_rates():
    return {
        "rates": EXCHANGE_RATES,
        "historical": HISTORICAL_RATES
    }


@app.get("/classes")
def get_classes():
    return {
        "classes": list(CURRENCY_INFO.keys())
    }