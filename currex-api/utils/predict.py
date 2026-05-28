import numpy as np
from PIL import Image
import io
from tensorflow.keras.applications.resnet_v2 import preprocess_input


CLASS_LABELS = [
    'EUR_10', 'EUR_100', 'EUR_20', 'EUR_5', 'EUR_50',
    'INR_10', 'INR_100', 'INR_20', 'INR_200', 'INR_50', 'INR_500',
    'USD_1', 'USD_10', 'USD_100', 'USD_5', 'USD_50'
]

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Takes raw image bytes, resizes it,
    applies preprocessing and returns array
    """

    img = Image.open(io.BytesIO(image_bytes))

    if img.mode != 'RGB':
        img = img.convert('RGB')

    img = img.resize((224, 224))

    img_array = np.array(img, dtype=np.float32)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = preprocess_input(img_array)

    return img_array


def decode(predictions: np.ndarray, top_k: int = 3):
    """
    Takes model output probabilities,
    returns top predicted classes and confidence
    """

    topindices = np.argsort(predictions[0])[::-1][:top_k]

    results = []

    for idx in topindices:
        results.append({
            "class_label": CLASS_LABELS[idx],
            "confidence": float(predictions[0][idx]) * 100
        })

    return results