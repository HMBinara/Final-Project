from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pathlib import Path
import joblib
import pickle
import pandas as pd
import numpy as np
from dotenv import load_dotenv
from firebase_admin import credentials, firestore, initialize_app
from firebase_admin.exceptions import FirebaseError
import os
from pdf_generator import ReportGenerator

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- 1. CONFIGURATION & PATHS ---
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
SERVICE_ACCOUNT_PATH = BASE_DIR / "serviceAccountKey.json"


def initialize_firebase_admin():
    """Initialize Firebase Admin SDK from the service account file."""
    if not SERVICE_ACCOUNT_PATH.exists():
        print("⚠️ Firebase service account file not found at backend/serviceAccountKey.json")
        return None

    try:
        if not initialize_firebase_admin.initialized:
            cred = credentials.Certificate(str(SERVICE_ACCOUNT_PATH))
            initialize_app(cred)
            initialize_firebase_admin.initialized = True
        return firestore.client()
    except FirebaseError as exc:
        print(f"❌ Firebase initialization error: {exc}")
        return None
    except Exception as exc:
        print(f"❌ Unexpected Firebase initialization error: {exc}")
        return None


initialize_firebase_admin.initialized = False
firestore_db = initialize_firebase_admin()

# --- 2. LOAD ALL MODELS ---
growth_model = None
sleep_model = None
financial_model = None
fin_columns = None
health_encoder = {0: "None", 1: "Insomnia", 2: "Sleep Apnea"}  # Default mapping


def get_user_id_from_payload(payload):
    """Resolve a stable user identifier for Firestore history records dynamically."""
    # Front-end එකෙන් කෙලින්ම එන userId / email එක චෙක් කිරීම
    user_id = payload.get('userId') or payload.get('user_id')
    if user_id:
        return str(user_id).strip()

    user = payload.get('user') or {}
    if isinstance(user, dict) and user.get('email'):
        return str(user['email']).strip()
        
    if isinstance(user, dict) and user.get('userId'):
        return str(user['userId']).strip()

    return 'demo-user'


def safe_float(value, default=0.0):
    try:
        if value is None or value == '':
            return float(default)
        return float(str(value).replace(',', '').replace('Years', '').strip())
    except Exception:
        return float(default)


def parse_longevity_years(value):
    if value is None:
        return None
    if isinstance(value, str):
        try:
            return float(value.replace('Years', '').strip())
        except Exception:
            return None
    try:
        return float(value)
    except Exception:
        return None


def parse_financial_score(value):
    if value is None:
        return None
    try:
        return float(str(value).replace(',', '').strip())
    except Exception:
        return None


def normalize_prediction_scores(payload):
    """Prefer explicit prediction values from the frontend; fall back to dummy formulas."""
    explicit_longevity = parse_longevity_years(payload.get('longevityYears')) or parse_longevity_years(payload.get('longevity_prediction')) or parse_longevity_years(payload.get('bioLongevity')) or parse_longevity_years(payload.get('growthScore'))
    explicit_health = parse_financial_score(payload.get('healthScore')) or parse_financial_score(payload.get('health_score')) or parse_financial_score(payload.get('health_condition_score'))
    explicit_finance = parse_financial_score(payload.get('financialScore')) or parse_financial_score(payload.get('financeScore')) or parse_financial_score(payload.get('financial_status')) or parse_financial_score(payload.get('resilienceScore'))

    if explicit_longevity is not None and explicit_health is not None and explicit_finance is not None:
        return {
            'longevityYears': float(explicit_longevity),
            'healthScore': float(explicit_health),
            'financialScore': float(explicit_finance),
        }

    # Dummy Fallback Math (If ML output is missing in payload)
    work_hours = float(payload.get('avg_work_hours', 8) or 8)
    rest_hours = float(payload.get('avg_rest_hours', 2) or 2)
    sleep_hours = float(payload.get('avg_sleep_hours', 7) or 7)
    exercise_hours = float(payload.get('avg_exercise_hours', 1) or 1)
    age = float(payload.get('age', 25) or 25)
    quality_of_sleep = float(payload.get('quality_of_sleep', 5) or 5)
    physical_activity_level = float(payload.get('physical_activity_level', 30) or 30)
    stress_level = float(payload.get('stress_level_health', 5) or 5)
    annual_income = float(payload.get('annual_income', 50000) or 50000)
    credit_score = float(payload.get('credit_score', 650) or 650)
    savings_assets = float(payload.get('savings_assets', 10000) or 10000)
    current_debt = float(payload.get('current_debt', 0) or 0)

    longevity_years = round(52 + (sleep_hours * 4.2) + (exercise_hours * 7.5) + (rest_hours * 1.8) - (work_hours * 2.4), 2)
    health_score = round(48 + (quality_of_sleep * 4.0) + (physical_activity_level * 0.35) - (stress_level * 3.5) - max(0, (age - 30) * 0.25), 2)
    financial_score = round(30 + (annual_income / 5000.0) + (credit_score / 12.0) + (savings_assets / 8000.0) - (current_debt / 6000.0), 2)

    return {
        'longevityYears': float(max(0, min(100, longevity_years))),
        'healthScore': float(max(0, min(100, health_score))),
        'financialScore': float(max(0, min(100, financial_score))),
    }


def format_firestore_timestamp(value):
    if value is None:
        return None
    if hasattr(value, 'isoformat'):
        try:
            return value.isoformat()
        except Exception:
            return None
    if isinstance(value, dict):
        seconds = value.get('seconds')
        nanoseconds = value.get('nanoseconds', 0)
        if seconds is not None:
            try:
                timestamp = pd.to_datetime(seconds, unit='s')
                if nanoseconds:
                    timestamp = timestamp + pd.Timedelta(nanoseconds=nanoseconds)
                return timestamp.to_pydatetime().isoformat()
            except Exception:
                return None
    return None


def build_timestamp_label(iso_value):
    if not iso_value:
        return ''
    try:
        timestamp = pd.to_datetime(iso_value)
        return timestamp.strftime('%Y-%m-%d %I:%M %p') # Date and Time "10:51 PM" format
    except Exception:
        return str(iso_value)


def serialize_firestore_record(doc_snapshot):
    """Clean serialization that strips out duplicate legacy fields for Recharts."""
    data = doc_snapshot.to_dict() or {}
    created_at = data.get('createdAt')

    created_at_value = format_firestore_timestamp(created_at)
    created_at_label = build_timestamp_label(created_at_value)

    # Clean Nested Object Structure එකෙන් පමණක් Data Extract කිරීම
    scores_obj = data.get('scores', {})
    
    # Fallback to base logic if nested structure doesn't exist yet
    longevity_years = safe_float(scores_obj.get('longevityYears', data.get('longevityYears', 0)))
    health_score = safe_float(scores_obj.get('healthScore', data.get('healthScore', 0)))
    financial_score = safe_float(scores_obj.get('financialScore', data.get('financialScore', 0)))

    return {
        'id': doc_snapshot.id,
        'userId': data.get('userId', ''),
        'longevityYears': longevity_years,
        'healthScore': health_score,
        'financialScore': financial_score,
        'createdAt': created_at_value,
        'createdAtLabel': created_at_label,
    }


def firestore_sort_key(item):
    created_at = item.get('createdAt')
    if not created_at:
        return pd.Timestamp.min
    try:
        return pd.to_datetime(created_at)
    except Exception:
        return pd.Timestamp.min


def load_model(path: Path):
    try:
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)

# Load Models
try:
    growth_model = load_model(MODELS_DIR / "growth_model.pkl")
    sleep_model = load_model(MODELS_DIR / "sleep_disorder_model.pkl")
    financial_model = load_model(MODELS_DIR / "finance_model.pkl")
    fin_columns = load_model(MODELS_DIR / "finance_columns.pkl")
    try:
        health_encoder_file = load_model(MODELS_DIR / "encoders.pkl")
        if health_encoder_file:
            health_encoder = health_encoder_file
    except Exception:
        print("⚠️ Health encoder file missing, using default mapping.")
    print("✅ All ML models loaded successfully!")
except Exception as e:
    print(f"❌ Loading Error: {e}")


# ---- 🎯 FIXED FUNCTION: PREDICT & CLEAN STORE ----
@app.route('/api/predict', methods=['POST'])
def predict_and_store_history():
    try:
        if firestore_db is None:
            return jsonify({'status': 'error', 'message': 'Firebase Admin SDK not initialized.'}), 500

        payload = request.get_json(silent=True) or {}
        user_id = get_user_id_from_payload(payload)
        scores = normalize_prediction_scores(payload)

        record_ref = firestore_db.collection('user_project_data').document()
        
        # 🎯 DUPLICATES CLEANED: Only pure scores nested object + userId stored
        record_payload = {
            'userId': user_id,
            'scores': {
                'longevityYears': float(scores['longevityYears']),
                'healthScore': float(scores['healthScore']),
                'financialScore': float(scores['financialScore'])
            },
            'createdAt': firestore.SERVER_TIMESTAMP,
        }
        record_ref.set(record_payload)

        return jsonify({
            'status': 'success',
            'message': f'Prediction stored successfully for user: {user_id}',
            'data': {
                'id': record_ref.id,
                'userId': user_id,
                'longevityYears': float(scores['longevityYears']),
                'healthScore': float(scores['healthScore']),
                'financialScore': float(scores['financialScore'])
            }
        }), 201
    except Exception as e:
        print(f"⚠️ Firestore save error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


# ---- 🎯 FIXED FUNCTION: GET USER HISTORY ----
@app.route('/api/history/<user_id>', methods=['GET'])
def get_prediction_history(user_id):
    try:
        if firestore_db is None:
            return jsonify({'status': 'error', 'message': 'Firebase Admin SDK not initialized.'}), 500

        # Filter by distinct loged-in user ID
        history_query = firestore_db.collection('user_project_data').where('userId', '==', str(user_id).strip())
        documents = history_query.stream()
        
        history = [serialize_firestore_record(document) for document in documents]
        history.sort(key=firestore_sort_key, reverse=True)

        return jsonify({
            'status': 'success',
            'userId': user_id,
            'count': len(history),
            'data': history,
        })
    except Exception as e:
        print(f"⚠️ Firestore history error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400


@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    try:
        if not all([growth_model, sleep_model, financial_model, fin_columns]):
            return jsonify({'status': 'error', 'message': 'Models are not loaded.'}), 500

        data = request.json

        # --- A. GROWTH / LONGEVITY PREDICTION ---
        growth_cols = ['gender', 'occupation_type', 'avg_work_hours_per_day', 'avg_rest_hours_per_day', 'avg_sleep_hours_per_day', 'avg_exercise_hours_per_day']
        growth_input = pd.DataFrame([[
            int(data.get('gender', 0)), int(data.get('occupation_type', 0)), float(data.get('avg_work_hours', 8)),
            float(data.get('avg_rest_hours', 2)), float(data.get('avg_sleep_hours', 7)), float(data.get('avg_exercise_hours', 1))
        ]], columns=growth_cols)
        predicted_longevity = growth_model.predict(growth_input)[0]

        # --- B. SLEEP DISORDER PREDICTION ---
        health_cols = ['Gender', 'Age', 'Occupation', 'Sleep Duration', 'Quality of Sleep', 'Physical Activity Level', 'Stress Level', 'BMI Category', 'Heart Rate', 'Daily Steps', 'Systolic Blood Pressure', 'Diastolic Blood Pressure']
        health_input = pd.DataFrame([[
            int(data.get('gender', 0)), int(data.get('age', 25)), int(data.get('occupation', 0)), float(data.get('sleep_duration', 7)),
            int(data.get('quality_of_sleep', 5)), int(data.get('physical_activity_level', 30)), int(data.get('stress_level_health', 5)),
            int(data.get('bmi_category', 1)), int(data.get('heart_rate', 72)), int(data.get('daily_steps', 5000)), int(data.get('systolic_bp', 120)), int(data.get('diastolic_bp', 80))
        ]], columns=health_cols)
        sleep_pred_idx = int(sleep_model.predict(health_input)[0])
        
        if isinstance(health_encoder, dict):
            sleep_status = health_encoder.get(sleep_pred_idx, "Normal")
        else:
            sleep_status = health_encoder.inverse_transform([sleep_pred_idx])[0]

        # --- C. FINANCIAL STABILITY PREDICTION ---
        fin_features = [
            float(data.get('years_employed', 0)), int(data.get('annual_income', 0)), int(data.get('credit_score', 600)),
            int(data.get('savings_assets', 0)), int(data.get('current_debt', 0)), float(data.get('Equity_Market', 0)),
            float(data.get('Fixed_Deposits', 0)), 1 if data.get('occupation_status') == 'Self-Employed' else 0,
            1 if data.get('investment_avenues') == 'Yes' else 0, 1 if data.get('stock_market') == 'Yes' else 0
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


@app.route('/api/generate_pdf_report', methods=['POST'])
def generate_pdf_report():
    try:
        data = request.json
        longevity = data.get('longevity_prediction', '0 Years')
        health_condition = data.get('health_condition', 'Unknown')
        financial_status = data.get('financial_status', '0.00')
        
        gemini_key = os.getenv('GEMINI_API_KEY')
        report_gen = ReportGenerator(gemini_api_key=gemini_key)
        pdf_buffer = report_gen.generate_pdf(longevity, health_condition, financial_status)
        
        return send_file(
            pdf_buffer, mimetype='application/pdf', as_attachment=True,
            download_name=f'LifeBalance_Report_{pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")}.pdf'
        )
    except Exception as e:
        print(f"❌ PDF Generation Error: {str(e)}")
        return jsonify({'status': 'error', 'message': f'PDF generation failed: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)