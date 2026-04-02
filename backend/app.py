from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import joblib
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# --- 1. CONFIGURATION & PATHS ---
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"

# --- 2. LOAD ALL MODELS ---
growth_model = None
sleep_model = None
financial_model = None
fin_columns = None
health_encoder = {0: "None", 1: "Insomnia", 2: "Sleep Apnea"}  # Default mapping

def load_model(path: Path):
    try:
        # scikit-learn 1.6.1 artifacts walata joblib godak hodai
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)

try:
    growth_model = load_model(MODELS_DIR / "growth_model.pkl")
    sleep_model = load_model(MODELS_DIR / "sleep_disorder_model.pkl")
    financial_model = load_model(MODELS_DIR / "finance_model.pkl")
    fin_columns = load_model(MODELS_DIR / "finance_columns.pkl")

    try:
        health_encoder_file = load_model(MODELS_DIR / "health_encoder.pkl")
        if health_encoder_file:
            health_encoder = health_encoder_file
    except Exception:
        print("⚠️ Health encoder file missing, using default mapping.")

    print("✅ All ML models loaded successfully!")
except Exception as e:
    print(f"❌ Loading Error: {e}")
    print("💡 Tip: Run 'pip install scikit-learn==1.6.1 joblib' to fix version issues.")

@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    try:
        if not all([growth_model, sleep_model, financial_model, fin_columns]):
            return jsonify({'status': 'error', 'message': 'Models are not loaded.'}), 500

        data = request.json

        # --- A. GROWTH / LONGEVITY PREDICTION ---
        # Feature names must match exactly what was seen during fit
        growth_cols = [
            'gender', 'occupation_type', 'avg_work_hours_per_day', 
            'avg_rest_hours_per_day', 'avg_sleep_hours_per_day', 'avg_exercise_hours_per_day'
        ]
        growth_input = pd.DataFrame([[
            int(data.get('gender', 0)),
            int(data.get('occupation_type', 0)),
            float(data.get('avg_work_hours', 8)),
            float(data.get('avg_rest_hours', 2)),
            float(data.get('avg_sleep_hours', 7)),
            float(data.get('avg_exercise_hours', 1))
        ]], columns=growth_cols)
        predicted_longevity = growth_model.predict(growth_input)[0]

        # --- B. SLEEP DISORDER PREDICTION ---
        # CRITICAL: These must be Capitalized with Spaces to match your model training
        health_cols = [
            'Gender', 'Age', 'Occupation', 'Sleep Duration', 'Quality of Sleep',
            'Physical Activity Level', 'Stress Level', 'BMI Category',
            'Heart Rate', 'Daily Steps', 'Systolic Blood Pressure', 'Diastolic Blood Pressure'
        ]
        health_input = pd.DataFrame([[
            int(data.get('gender', 0)),
            int(data.get('age', 25)),
            int(data.get('occupation', 0)),
            float(data.get('sleep_duration', 7)),
            int(data.get('quality_of_sleep', 5)),
            int(data.get('physical_activity_level', 30)),
            int(data.get('stress_level_health', 5)),
            int(data.get('bmi_category', 1)),
            int(data.get('heart_rate', 72)),
            int(data.get('daily_steps', 5000)),
            int(data.get('systolic_bp', 120)),
            int(data.get('diastolic_bp', 80))
        ]], columns=health_cols)

        sleep_pred_idx = int(sleep_model.predict(health_input)[0])
        
        if isinstance(health_encoder, dict):
            sleep_status = health_encoder.get(sleep_pred_idx, "Normal")
        else:
            sleep_status = health_encoder.inverse_transform([sleep_pred_idx])[0]

        # --- C. FINANCIAL STABILITY PREDICTION ---
        # Uses the loaded fin_columns to ensure 100% match
        fin_features = [
            float(data.get('years_employed', 0)),
            int(data.get('annual_income', 0)),
            int(data.get('credit_score', 600)),
            int(data.get('savings_assets', 0)),
            int(data.get('current_debt', 0)),
            float(data.get('Equity_Market', 0)),
            float(data.get('Fixed_Deposits', 0)),
            1 if data.get('occupation_status') == 'Self-Employed' else 0,
            1 if data.get('investment_avenues') == 'Yes' else 0,
            1 if data.get('stock_market') == 'Yes' else 0
        ]
        fin_input_df = pd.DataFrame([fin_features], columns=fin_columns)
        fin_pred = financial_model.predict(fin_input_df)[0]

        return jsonify({
            'status': 'success',
            'results': {
                'longevity_prediction': f"{int(predicted_longevity)} Years",
                'health_condition': str(sleep_status),
                'financial_status': f"{fin_pred:.2f}"
            }
        })

    except Exception as e:
        print(f"⚠️ API Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)