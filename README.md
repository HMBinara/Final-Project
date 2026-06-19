# LifeBalance Monitoring System

LifeBalance is a full-stack machine learning application that combines lifestyle, sleep/health, and financial inputs into a single wellbeing assessment. The project pairs a React frontend with a Flask backend that runs the trained models and generates a downloadable PDF report.

## Overview

Users complete a guided dashboard flow and submit 28 inputs across three areas:

- Lifestyle and longevity factors
- Sleep and health indicators
- Financial stability inputs

The system returns three outputs in one response:

- Estimated longevity
- Sleep disorder classification
- Financial stability score

## Key Features

- Multi-step prediction flow in the frontend
- Combined inference endpoint for all three model outputs
- PDF report generation from the final prediction summary
- Protected dashboard route for the prediction experience
- Clean chart-based result presentation in the UI

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, Framer Motion, Recharts, Tailwind CSS |
| Backend | Flask, Flask-CORS, Pandas, NumPy, scikit-learn, Joblib, ReportLab, python-dotenv |
| Models | Serialized `.pkl` artifacts loaded from `backend/models` |

## Project Structure

```text
Final-Project/
├── backend/
│   ├── app.py
│   ├── pdf_generator.py
│   ├── requirements.txt
│   ├── models/
│   └── Data/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

- Python 3.10+
- Node.js 18+
- npm

## Local Setup

### 1. Backend

From the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

The API runs at `http://127.0.0.1:5000`.

### 2. Frontend

In a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

The backend supports an optional `GEMINI_API_KEY` in a `.env` file. If the key is not provided, the PDF generator uses its fallback report header.

Example:

```env
GEMINI_API_KEY=your_key_here
```

## API Reference

### `POST /api/predict_all`

Runs the three ML models and returns the combined prediction payload.

Example response:

```json
{
  "status": "success",
  "results": {
    "longevity_prediction": "72 Years",
    "health_condition": "Normal",
    "financial_status": "13.45"
  }
}
```

### `POST /api/generate_pdf_report`

Generates and downloads a PDF report using the latest prediction results.

## Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Login page |
| `/signup` | Registration page |
| `/dashboard` | Protected prediction dashboard |

## Frontend Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

- Keep the trained model files in `backend/models` before starting the API.
- The prediction inputs must match the feature order expected by the trained models.
- The dashboard route is intentionally lightweight and intended for local or demo use.
