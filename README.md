# LifeBalance Monitoring System

![LifeBalance Badge](https://img.shields.io/badge/LifeBalance-v1.0-blue)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

**LifeBalance** is a comprehensive full-stack machine learning application that provides personalized wellbeing assessments by analyzing lifestyle, sleep health, and financial stability indicators. The system combines advanced predictive models with an intuitive user interface to deliver actionable insights through interactive dashboards and professional PDF reports.

Users provide 28 data points across three assessment categories and receive three distinct predictions:
- **Longevity Estimation**: Predicted life expectancy based on lifestyle factors
- **Sleep Health Analysis**: Classification of potential sleep disorders
- **Financial Stability Score**: Assessment of financial wellbeing

## ✨ Key Features

- **🔐 Secure Authentication**: Firebase-based user authentication with signup and login
- **📊 Multi-Step Prediction Dashboard**: Intuitive guided workflow for data collection
- **🤖 Three Integrated ML Models**: 
  - Longevity prediction model
  - Sleep disorder classification model
  - Financial stability assessment model
- **📄 PDF Report Generation**: Automated professional report creation with analysis summary
- **📈 Interactive Visualization**: Chart-based result presentation using Recharts
- **🎨 Modern UI/UX**: Responsive design with Framer Motion animations and Tailwind CSS
- **🔄 Real-time API Integration**: RESTful backend with CORS support
- **💾 Data Persistence**: Firestore integration for user history and predictions

## 🛠 Tech Stack

| Component | Technology | Version |
|---|---|---|
| **Frontend Framework** | React | 19.2.4 |
| **Build Tool** | Vite | Latest |
| **Routing** | React Router DOM | 7.13.2 |
| **HTTP Client** | Axios | 1.13.6 |
| **UI Animation** | Framer Motion | 12.38.0 |
| **Charting** | Recharts | 3.8.1 |
| **Styling** | Tailwind CSS | Latest |
| **Icons** | Lucide React | 1.0.1 |
| **Authentication** | Firebase | 12.11.0 |
| **Backend Framework** | Flask | 3.0.0 |
| **CORS Handling** | Flask-CORS | 4.0.0 |
| **Data Processing** | Pandas | 2.1.0 |
| **Numerical Computation** | NumPy | 1.24.3 |
| **Machine Learning** | scikit-learn | 1.6.1 |
| **Model Serialization** | Joblib | 1.3.2 |
| **PDF Generation** | ReportLab | 4.0.4 |
| **Environment Config** | python-dotenv | 1.0.0 |
| **Image Processing** | Pillow | 10.1.0 |
| **API Requests** | Requests | 2.31.0 |
| **Database** | Firebase Firestore | Latest |

## 📁 Project Structure

```
Final-Project/
├── backend/
│   ├── app.py                              # Flask application & API endpoints
│   ├── pdf_generator.py                    # PDF report generation logic
│   ├── requirements.txt                    # Python dependencies
│   ├── serviceAccountKey.json              # Firebase credentials (git-ignored)
│   ├── models/                             # Serialized ML models (.pkl files)
│   ├── Data/
│   │   ├── Sleep_health_and_lifestyle_dataset.csv
│   │   ├── Updated Quality of Life Data.csv
│   │   └── financial/
│   │       ├── Finance_data.csv
│   │       ├── Loan_approval_data_2025.csv
│   │       ├── Master_Finance_Data.csv
│   │       ├── merge_finance.py
│   │       └── Original_data.csv
│   └── notebooks/                          # Jupyter notebooks for model training
│       ├── Final_Master_Finance.ipynb
│       ├── FinalHealthy.ipynb
│       └── Personal.ipynb
│
├── frontend/
│   ├── package.json                        # Node.js dependencies
│   ├── vite.config.js                      # Vite configuration
│   ├── eslint.config.js                    # ESLint configuration
│   ├── index.html                          # HTML entry point
│   ├── public/                             # Static assets
│   └── src/
│       ├── main.jsx                        # React entry point
│       ├── App.jsx                         # Main app component
│       ├── index.css                       # Global styles
│       ├── assets/                         # Images and static files
│       ├── components/
│       │   ├── AnalysisDashboard.jsx       # Results dashboard
│       │   ├── Chart.jsx                   # Chart component
│       │   ├── Layout.jsx                  # Protected layout wrapper
│       │   ├── PredictionTimeline.jsx      # Timeline visualization
│       │   └── Sidebar.jsx                 # Navigation sidebar
│       └── pages/
│           ├── Home.jsx                    # Landing page
│           ├── Login.jsx                   # User login page
│           ├── Signup.jsx                  # User registration page
│           └── Predictor.jsx               # Main prediction dashboard (protected)
│
└── README.md                               # This file
```

## 📋 Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18 or higher
- **npm**: 8 or higher
- **Firebase Project**: For authentication and database functionality
- **Git**: For version control

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Final-Project
```

### Step 2: Backend Setup

#### Create Python Virtual Environment

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### Install Python Dependencies

```powershell
pip install -r requirements.txt
```

#### Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Download your service account key as `serviceAccountKey.json`
3. Place it in the `backend/` directory (⚠️ Add to `.gitignore` for security)

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

#### Verify Model Files

Ensure the trained ML models are in `backend/models/`:
- `longevity_model.pkl`
- `sleep_model.pkl`
- `financial_model.pkl`

#### Start Backend Server

```powershell
python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### Step 3: Frontend Setup

In a **new terminal**, navigate to the frontend directory:

```powershell
cd frontend
npm install
```

#### Configure Firebase

Update your Firebase configuration in the frontend environment or directly in the authentication module:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### Start Development Server

```powershell
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📖 Usage Guide

### For Users

1. **Visit the Application**: Open `http://localhost:5173`
2. **Create Account**: Click "Sign Up" and register with email/password
3. **Complete Assessment**: 
   - Log in to access the dashboard
   - Fill out all 28 health and lifestyle questions
   - Provide financial stability information
4. **View Results**: 
   - See your predictions for longevity, sleep health, and financial stability
   - Interact with charts and visualizations
5. **Download Report**: Generate and download your personalized PDF report

### API Endpoints

#### 1. Predict All Models
**POST** `/api/predict_all`

Submit 28 data points to run all three models.

**Request Body:**
```json
{
  "userId": "user123",
  "user": {
    "email": "user@example.com"
  },
  "lifestyle_features": [...],
  "health_features": [...],
  "financial_features": [...]
}
```

**Response:**
```json
{
  "status": "success",
  "results": {
    "longevity_prediction": "72 Years",
    "health_condition": "Normal",
    "financial_status": "13.45"
  },
  "timestamp": "2026-06-19T10:30:00Z"
}
```

#### 2. Generate PDF Report
**POST** `/api/generate_pdf_report`

Generate a professional PDF report with the latest predictions.

**Request Body:**
```json
{
  "userId": "user123",
  "predictions": {
    "longevity": "72 Years",
    "health_condition": "Normal",
    "financial_status": "13.45"
  }
}
```

**Response:** PDF file binary stream

### Frontend Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page - introduction and overview |
| `/login` | Public | User login page |
| `/signup` | Public | User registration page |
| `/dashboard` | Protected | Main prediction dashboard and results |

## 🔧 Development Commands

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint validation
npm run lint
```

### Backend

```bash
# Run Flask development server
python app.py

# Run with debugging
python -m flask --app app run --debug
```

## 📊 Machine Learning Models

### Longevity Model
- **Type**: Regression
- **Input**: 10+ lifestyle factors
- **Output**: Predicted life expectancy (years)
- **Training Data**: Sleep health and lifestyle dataset

### Sleep Disorder Model
- **Type**: Classification
- **Input**: Sleep health indicators
- **Output**: Condition type (Normal, Insomnia, Sleep Apnea)
- **Training Data**: Clinical sleep health dataset

### Financial Stability Model
- **Type**: Regression/Classification
- **Input**: Financial indicators and loan data
- **Output**: Financial stability score
- **Training Data**: Master finance dataset with loan approval data

## 🔐 Security Considerations

- ✅ Firebase authentication for user management
- ✅ Protected `/dashboard` route (requires login)
- ✅ CORS enabled for controlled cross-origin requests
- ✅ Environment variables for sensitive credentials
- ⚠️ **Important**: Never commit `serviceAccountKey.json` to version control
- ⚠️ **Important**: Never expose API keys in frontend code

### Best Practices

1. Use `.env` files for environment variables
2. Add `.env` and `serviceAccountKey.json` to `.gitignore`
3. Regularly update dependencies for security patches
4. Validate and sanitize all user inputs on backend
5. Use HTTPS in production environments

## 🐛 Troubleshooting

### Backend Issues

| Issue | Solution |
|---|---|
| Port 5000 already in use | Change Flask port: `app.run(port=5001)` |
| Firebase initialization fails | Verify `serviceAccountKey.json` path and permissions |
| Model loading errors | Ensure `.pkl` files exist in `backend/models/` |
| CORS errors | Verify Flask-CORS configuration in `app.py` |

### Frontend Issues

| Issue | Solution |
|---|---|
| "Cannot GET /" error | Ensure Vite dev server is running on port 5173 |
| API calls fail | Check backend is running and CORS is enabled |
| Firebase auth fails | Verify Firebase configuration in auth setup |
| Blank dashboard | Open browser console for error messages |

## 📝 Environment Variables Reference

### Backend (.env)

```env
# Optional: Gemini API key for enhanced PDF generation
GEMINI_API_KEY=sk-xxx-xxx-xxx

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_APP=app.py

# Firebase Path (relative to backend directory)
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
```

### Firebase Configuration

Store Firebase config in environment or component:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'Add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request with a clear description

### Code Standards

- Use ESLint for JavaScript/React code
- Follow PEP 8 for Python code
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 📧 Support & Contact

For questions, bug reports, or feature requests:

- **Issues**: Open an issue on GitHub
- **Documentation**: Check this README and inline code comments
- **Email**: [Add your contact email]

## 🎯 Roadmap

### Phase 1 (Current) ✅
- ✅ Core ML model integration
- ✅ Firebase authentication
- ✅ PDF report generation
- ✅ React dashboard UI

### Phase 2 (Planned)
- 📋 Advanced visualization dashboard
- 📋 Export to multiple formats (CSV, Excel)
- 📋 Historical trends and comparisons
- 📋 Email report delivery
- 📋 Mobile app (React Native)

### Phase 3 (Future)
- 🔮 Real-time data synchronization
- 🔮 Collaborative health goals
- 🔮 Integration with wearable devices
- 🔮 AI-powered recommendations

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [scikit-learn Documentation](https://scikit-learn.org)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Made with https://github.com/HMBinara for better wellbeing | LifeBalance v1.0**
