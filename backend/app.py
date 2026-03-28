from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend integration

# --- 1. LOAD TRAINED MODELS ---

# Load the Dropout Risk Prediction model
dropout_model = pickle.load(open('models/dropout_model.pkl', 'rb'))

# Load the Health (Sleep Disorder) model and its Label Encoders
sleep_model = pickle.load(open('models/sleep_disorder_model.pkl', 'rb'))
health_le = pickle.load(open('models/encoders.pkl', 'rb'))

# Load the Financial Stability model and its feature columns
financial_model = pickle.load(open('models/financial_model.pkl', 'rb'))
fin_cols = pickle.load(open('models/financial_columns.pkl', 'rb'))

@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    try:
        # Get JSON data sent from the React Frontend
        data = request.json  
        
        # --- Dropout Risk Prediction Logic ---
        # Features: social_media, netflix, exercise, sleep, screen, age, gender, mental, stress
        dropout_features = [
            data['social_media'], data['netflix'], data['exercise'],
            data['sleep'], data['screen'], data['age'],
            data['gender'], data['mental_health'], data['stress']
        ]
        
        # Create a DataFrame for the dropout model using correct column names
        dropout_input = pd.DataFrame([dropout_features], columns=[
            'social_media_hours', 'netflix_hours', 'exercise_frequency', 
            'sleep_hours', 'screen_time', 'age', 'gender', 
            'mental_health_rating', 'stress_level'
        ])
        
        # Calculate the probability of dropout (Class 1)
        dropout_prob = dropout_model.predict_proba(dropout_input)[0][1] * 100

        # --- Health (Sleep Disorder) Prediction Logic ---
        # Map input features to health model (Adjust these keys based on your dataset)
        health_input = [data['age'], data['sleep_duration'], data['physical_activity']]
        
        # Predict class and inverse transform label from encoder
        sleep_pred_idx = sleep_disorder_model.predict([health_input])[0]
        sleep_status = health_le.inverse_transform([sleep_pred_idx])[0]

        # --- Financial Stability Prediction Logic ---
        # Features: income, expenses, savings (Adjust based on your financial model features)
        fin_input = [data['income'], data['expenses'], data['savings']]
        fin_pred = financial_model.predict([fin_input])[0]
        
        # Map numeric prediction back to human-readable status
        fin_status = "Stable" if fin_pred == 1 else "Risky"

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
        # Error handling for invalid data or processing issues
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    # Run server on port 5000 in debug mode
    app.run(debug=True, port=5000)