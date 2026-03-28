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
    sleep_model = joblib.load('models/sleep_disorder_model.pkl')
    # මෙතන encoders.pkl එක සමහරවිට dictionary එකක් වෙන්න පුළුවන්
    health_encoder = joblib.load('models/encoders.pkl')

    dropout_model = pickle.load(open('models/dropout_model.pkl', 'rb'))
    # gender_le දැනට පාවිච්චි වෙන්නේ නැති නිසා check කරලා තියාගන්න
    
    financial_model = pickle.load(open('models/finance_model.pkl', 'rb'))
    fin_columns = pickle.load(open('models/finance_columns.pkl', 'rb'))
    
    print("All ML models and encoders loaded successfully!")
except Exception as e:
    print(f"Loading Error: {e}")

@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    try:
        data = request.json  
        
        # --- A. DROPOUT RISK PREDICTION ---
        dropout_features = [
            float(data['social_media_hours']),
            float(data['netflix_hours']),
            float(data['exercise_frequency']),
            float(data['sleep_hours']),
            float(data['screen_time']),
            int(data['age']),
            int(data['gender']),
            int(data['mental_health_rating']),
            int(data['stress_level'])
        ]
        dropout_input_df = pd.DataFrame([dropout_features], columns=[
            'social_media_hours', 'netflix_hours', 'exercise_frequency', 
            'sleep_hours', 'screen_time', 'age', 'gender', 
            'mental_health_rating', 'stress_level'
        ])
        dropout_prob = dropout_model.predict_proba(dropout_input_df)[0][1] * 100

        # --- B. HEALTH PREDICTION ---
        health_features = [
            int(data['gender']),
            int(data['age']),
            int(data['occupation']),
            float(data['sleep_duration']),
            int(data['quality_of_sleep']),
            int(data['physical_activity_level']),
            int(data['stress_level_health']),
            int(data['bmi_category']),
            int(data['heart_rate']),
            int(data['daily_steps']),
            int(data['systolic_bp']),
            int(data['diastolic_bp'])
        ]
        
        sleep_pred_idx = int(sleep_model.predict([health_features])[0])

        # Machan, dictionary ekak unoth unknown wenuwata "Normal" kiyala watenna haduwa
        if isinstance(health_encoder, dict):
            sleep_status = health_encoder.get(sleep_pred_idx, "Normal") 
        else:
            # LabelEncoder ekak nam normal widiyata inverse transform wenawa
            sleep_status = health_encoder.inverse_transform([sleep_pred_idx])[0]
    
        # --- C. FINANCIAL STABILITY PREDICTION ---
        # Frontend එකේ dropdown values (Student, Salaried etc) handle කරන හැටි
        occ_status = data.get('occupation_status', 'Student')
        inv_ave = data.get('investment_avenues', 'No')
        stk_mkt = data.get('stock_market', 'No')

        fin_features = [
            float(data['years_employed']),
            int(data['annual_income']),
            int(data['credit_score']),
            int(data['savings_assets']),
            int(data['current_debt']),
            float(data['Equity_Market']),
            float(data['Fixed_Deposits']),
            1 if occ_status == 'Self-Employed' else 0,
            1 if inv_ave == 'Yes' else 0,
            1 if stk_mkt == 'Yes' else 0
        ]
        
        fin_input_df = pd.DataFrame([fin_features], columns=fin_columns)
        fin_pred = financial_model.predict(fin_input_df)[0]
        
        # --- RESPONSE ---
        return jsonify({
            'status': 'success',
            'results': {
                'dropout_risk': f"{dropout_prob:.1f}%",
                'health_condition': str(sleep_status),
                'financial_status': f"Stability Score: {fin_pred:.2f}"
            }
        })

    except Exception as e:
        print(f"API Error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)