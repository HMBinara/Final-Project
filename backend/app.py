from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app) 

# --- 1. LOAD ALL MODELS & ENCODERS ---
try:
    # Health Model (Sleep Disorder)
    sleep_model = joblib.load('models/sleep_disorder_model.pkl')
    health_encoder = joblib.load('models/encoders.pkl')

    # Personal Model (Dropout Risk)
    dropout_model = pickle.load(open('models/dropout_model.pkl', 'rb'))
    gender_le = pickle.load(open('models/label_encoder.pkl', 'rb'))

    # Financial Model (Stability Score)
    financial_model = pickle.load(open('models/finance_model.pkl', 'rb'))
    fin_columns = pickle.load(open('models/finance_columns.pkl', 'rb'))
    
    print("All ML models and encoders loaded successfully!")
except Exception as e:
    print(f"Loading Error: {e}")

@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    try:
        data = request.json  
        
        # --- A. DROPOUT RISK PREDICTION (PERSONAL) ---
        dropout_features = [
            float(data['social_media_hours']),
            float(data['netflix_hours']),
            float(data['exercise_frequency']),
            float(data['sleep_hours']),
            float(data['screen_time']),
            int(data['age']),
            int(data['gender']), # 0=Female, 1=Male
            int(data['mental_health_rating']),
            int(data['stress_level'])
        ]
        dropout_input_df = pd.DataFrame([dropout_features], columns=[
            'social_media_hours', 'netflix_hours', 'exercise_frequency', 
            'sleep_hours', 'screen_time', 'age', 'gender', 
            'mental_health_rating', 'stress_level'
        ])
        dropout_prob = dropout_model.predict_proba(dropout_input_df)[0][1] * 100

        # --- B. HEALTH PREDICTION (SLEEP DISORDER - 12 FEATURES) ---
        # Note: Category inputs (Occupation, BMI, BP) should be numbers from Frontend
        health_features = [
            int(data['gender']),
            int(data['age']),
            int(data['occupation']),
            float(data['sleep_duration']),
            int(data['quality_of_sleep']),
            int(data['physical_activity_level']),
            int(data['stress_level_health']), # stress_level (Health model)
            int(data['bmi_category']),
            int(data['heart_rate']),
            int(data['daily_steps']),
            int(data['systolic_bp']),
            int(data['diastolic_bp'])
        ]
        
        # Predict class
        sleep_pred_idx = sleep_model.predict([health_features])[0]
        sleep_status = health_encoder.inverse_transform([sleep_pred_idx])[0]

        # --- C. FINANCIAL STABILITY PREDICTION ---
        fin_features = [
            float(data['years_employed']),
            int(data['annual_income']),
            int(data['credit_score']),
            int(data['savings_assets']),
            int(data['current_debt']),
            float(data['Equity_Market']),
            float(data['Fixed_Deposits']),
            1 if data['occupation_status'] == 'Self-Employed' else 0,
            1 if data['investment_avenues'] == 'Yes' else 0,
            1 if data['stock_market'] == 'Yes' else 0
        ]
        fin_input_df = pd.DataFrame([fin_features], columns=fin_columns)
        fin_pred = financial_model.predict(fin_input_df)[0]
        
        fin_status = f"Stability Score: {fin_pred:.2f}"

        # --- CONSOLIDATED JSON RESPONSE ---
        return jsonify({
            'status': 'success',
            'results': {
                'dropout_risk': f"{dropout_prob:.1f}%",
                'health_condition': sleep_status,
                'financial_status': fin_status
            }
        })

    except Exception as e:
        print(f"API Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)