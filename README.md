# LifeBalance Monitoring System

A full-stack machine learning application that evaluates **personal growth**, **sleep/health condition**, and **financial stability** from user inputs, then generates a consolidated intelligence report.

## Overview

LifeBalance combines a React frontend and a Flask backend with pre-trained ML models to produce three predictions in a single workflow:

1. **Longevity / growth outlook**
2. **Sleep-related health condition**
3. **Financial stability score**

The UI guides users through a multi-step form and displays a final analysis dashboard.

## Key Features

- Multi-step prediction flow (lifestyle, health, and finance)
- Single backend endpoint for combined inference (`/api/predict_all`)
- Local model loading from serialized artifacts (`.pkl`)
- Protected dashboard route (basic localStorage-based session check)
- Downloadable report from the frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, Lucide Icons |
| Backend | Flask, Flask-CORS, Pandas, NumPy, Joblib/Pickle |
| ML Artifacts | scikit-learn serialized models (`.pkl`) |

## Project Structure

```text
Final-Project/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── models/
│       ├── growth_model.pkl
│       ├── sleep_disorder_model.pkl
│       ├── finance_model.pkl
│       ├── finance_columns.pkl
│       └── encoders.pkl
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm

### 1. Run Backend (Flask API)

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

- Windows PowerShell:
  ```bash
  .\.venv\Scripts\Activate.ps1
  ```
- Windows CMD:
  ```bash
  .\.venv\Scripts\activate.bat
  ```

Install dependencies and start server:

```bash
pip install -r requirements.txt
python app.py
```

Backend default URL: **http://127.0.0.1:5000**

### 2. Run Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: **http://localhost:5173**

## API Reference

### `POST /api/predict_all`

Returns combined prediction outputs for growth, health, and finance.

#### Example Request Body

```json
{
  "gender": 1,
  "occupation_type": 3,
  "avg_work_hours": 8,
  "avg_rest_hours": 2,
  "avg_sleep_hours": 7,
  "avg_exercise_hours": 1,
  "age": 25,
  "occupation": 0,
  "sleep_duration": 7,
  "quality_of_sleep": 5,
  "physical_activity_level": 30,
  "stress_level_health": 5,
  "bmi_category": 1,
  "heart_rate": 72,
  "daily_steps": 5000,
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "years_employed": 1,
  "annual_income": 50000,
  "credit_score": 650,
  "savings_assets": 10000,
  "current_debt": 0,
  "Equity_Market": 0,
  "Fixed_Deposits": 0,
  "occupation_status": "Student",
  "investment_avenues": "No",
  "stock_market": "No"
}
```

#### Example Success Response

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

## Frontend Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Sign-in page |
| `/signup` | Sign-up page |
| `/dashboard` | Protected predictor/report page |

## Available Frontend Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Notes

- Model files must exist in `backend/models` before starting the API.
- Backend inference uses strict feature ordering and column names expected by trained models.
- Dashboard route protection is client-side (`localStorage`) and intended for basic app flow, not production-grade authentication.
