# CURREX

> AI-powered multi-currency recognition with live INR conversion and 10-year exchange rate history.

CURREX identifies banknotes from a photo using a fine-tuned ResNet50V2 model, then displays the denomination, country of origin, live INR equivalent, and a 10-year historical exchange rate chart. Built with a FastAPI backend, React frontend, and Firebase authentication.

---

## Features

- 📸 **Currency recognition** — upload an image or use your camera to identify banknotes
- 🌍 **5 currencies, 28 denominations** — INR, USD, EUR, JPY, KRW
- 💱 **Live INR conversion** — fetched from frankfurter.app, with offline fallback
- 📈 **10-year historical rate chart** — visualize how each currency has moved against INR
- 🔐 **Firebase Auth** — email/password and Google sign-in
- 🗂 **Scan history** — every scan saved per-user in Firestore
- 🎨 **Custom dark luxury UI** — no component library, fully hand-styled

---

## Tech Stack

| Layer | Stack |
|---|---|
| ML Model | ResNet50V2 (transfer learning) · TensorFlow / Keras |
| Backend | FastAPI · Uvicorn · Python 3.11 |
| Frontend | React 19 · Vite 8 · React Router v7 · Recharts |
| Auth & DB | Firebase Authentication · Firestore |
| Exchange Rates | frankfurter.app (live + historical) |

---

## Model Performance

- **28 classes** across 5 currencies
- **93.04%** validation accuracy
- Two-phase transfer learning (frozen ResNet50V2 → fine-tuned top layers)
- Validation set built from real photographs only (not studio/dataset images) for an honest real-world accuracy estimate

| Currency | Denominations |
|---|---|
| 🇮🇳 INR | ₹10, ₹20, ₹50, ₹100, ₹200, ₹500 |
| 🇺🇸 USD | $1, $5, $10, $50, $100 |
| 🇪🇺 EUR | €5, €10, €20, €50, €100 |
| 🇯🇵 JPY | ¥1000, ¥2000, ¥5000, ¥10000 |
| 🇰🇷 KRW | ₩10–₩50000 (notes & coins) |

---

## Project Structure

```
currencydetector1/
├── currex-api/              # FastAPI backend
│   ├── main.py
│   ├── utils/
│   │   ├── predict.py        # preprocessing, class labels, inference
│   │   └── constants.py      # currency metadata, fallback rates
│   ├── model/
│   │   └── currex_final_93.keras
│   └── requirements.txt
│
└── src/                      # React frontend
    ├── pages/                 # Login, Home, Result, History, About
    ├── components/             # Navbar, PrivateRoute
    ├── context/                # AuthContext
    ├── utils/                  # constants.js
    └── styles/                 # global.css
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Firebase project (Auth + Firestore enabled)

### 1. Clone the repo
```bash
git clone https://github.com/Siddhi292005/currencydetector.git
cd currencydetector1
```

### 2. Backend setup
```bash
cd currex-api
python3.11 -m venv tfenv
source tfenv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Server runs at `http://localhost:8000` — docs available at `http://localhost:8000/docs`.

### 3. Frontend setup
```bash
cd ..
npm install
```

Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```
App runs at `http://localhost:5173`.

---

## How It Works

```
User uploads/captures image
        ↓
React sends image → FastAPI /predict
        ↓
Image preprocessed (224×224, ResNet50V2 normalization)
        ↓
Model predicts denomination + currency
        ↓
Live exchange rate fetched (frankfurter.app, cached 1hr)
        ↓
INR value + 10yr historical data returned
        ↓
Scan saved to Firestore → Result page rendered
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/rates` | Current exchange rates vs INR |
| `GET` | `/classes` | All supported class labels |
| `POST` | `/predict` | Upload an image, get a prediction |

**Example `/predict` response:**
```json
{
  "success": true,
  "currency": "USD",
  "denomination": 20,
  "face_value": "$20",
  "inr_value": 1670.0,
  "confidence": 94.2,
  "exchange_rate": 83.5,
  "country": "United States",
  "flag": "🇺🇸"
}
```

---

## Known Limitations

- GBP and AED were evaluated but dropped due to lack of usable public datasets
- KRW historical rates are not available via the live API and use a static fallback
- No fake/counterfeit note detection (intentionally out of scope for this version)
- Accuracy decreases on poorly lit, crumpled, or extreme-angle photos

---

## Roadmap

- [ ] Deploy backend (Railway/Render) and frontend (Firebase Hosting)
- [ ] Add fake currency detection module
- [ ] Expand to additional currencies as datasets become available
- [ ] Improve coin recognition with dedicated training data

---

## License

This project was built for academic purposes.