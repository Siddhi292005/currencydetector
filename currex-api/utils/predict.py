import numpy as np
from PIL import Image
import io
from tensorflow.keras.applications.resnet_v2 import preprocess_input
import cv2
CLASS_LABELS = [
    'EUR_10', 'EUR_100', 'EUR_20', 'EUR_5', 'EUR_50',
    'INR_10', 'INR_100', 'INR_20', 'INR_200', 'INR_50', 'INR_500',
    'JPY_1000', 'JPY_10000', 'JPY_2000', 'JPY_5000',
    'KRW_10', 'KRW_100', 'KRW_1000', 'KRW_10000',
    'KRW_50', 'KRW_500', 'KRW_5000', 'KRW_50000',
    'USD_1', 'USD_10', 'USD_100', 'USD_5', 'USD_50',
]

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def preprocess_pil(pil_img: Image.Image) -> np.ndarray:
    """Preprocess a PIL image directly (used for cropped regions)."""
    if pil_img.mode != 'RGB':
        pil_img = pil_img.convert('RGB')
    pil_img = pil_img.resize((224, 224))
    arr = np.array(pil_img, dtype=np.float32)
    arr = np.expand_dims(arr, axis=0)
    return preprocess_input(arr)

def decode(predictions: np.ndarray, top_k: int = 3):
    top_indices = np.argsort(predictions[0])[::-1][:top_k]
    results = []
    for idx in top_indices:
        results.append({
            "class_label": CLASS_LABELS[idx],
            "confidence":  float(predictions[0][idx]) * 100
        })
    return results

def detect_note_regions(image_bytes: bytes):
    """
    Uses OpenCV contour detection to find rectangular regions
    that look like banknotes. Returns a list of PIL Image crops.
    If no distinct regions found, returns the full image as one crop.
    """
    # Decode image for OpenCV (BGR)
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    h, w = img_cv.shape[:2]

    # Convert to grayscale and blur
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate edges to close gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    dilated = cv2.dilate(edges, kernel, iterations=2)

    # Find contours
    contours, _ = cv2.findContours(
        dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # Filter for large rectangular-ish contours (note-like shapes)
    min_area = (w * h) * 0.05   # at least 5% of image area
    max_area = (w * h) * 0.95   # not the entire image
    note_crops = []

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue

        # Get bounding rect and check aspect ratio
        x, y, bw, bh = cv2.boundingRect(cnt)
        aspect = bw / bh if bh > 0 else 0

        # Banknotes are rectangular — aspect ratio roughly 1.5 to 3.5
        if 1.4 <= aspect <= 3.8:
            # Add padding
            pad = 10
            x1 = max(0, x - pad)
            y1 = max(0, y - pad)
            x2 = min(w, x + bw + pad)
            y2 = min(h, y + bh + pad)

            crop = img_cv[y1:y2, x1:x2]
            crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
            note_crops.append(Image.fromarray(crop_rgb))

    # If we found between 2-5 distinct note regions, return them
    if 2 <= len(note_crops) <= 5:
        return note_crops, True   # True = multiple notes detected

    # Otherwise return the full image
    full_pil = Image.fromarray(cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB))
    return [full_pil], False      # False = single note (or couldn't split)