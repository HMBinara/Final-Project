# PDF Report Generation Setup

## Overview
The LifeBalance application now generates **professional PDF reports** with AI-powered header images instead of plain text files. Each report:
- ✅ Displays a dynamically generated header image with color-coded warning levels
- ✅ Shows structured sections: Bio-Longevity, Clinical Health, Financial Stability
- ✅ Includes personalized recommendations
- ✅ Uses Gemini API for enhanced image generation (optional)

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Gemini API Key (Optional but Recommended)
The application can work WITHOUT a Gemini API key, but with one you get enhanced header image generation.

#### Get Your Gemini API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

#### Add to `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Start the Backend
```bash
cd backend
.\venv\Scripts\activate  # Windows
python app.py
```

The backend will log:
```
✅ Gemini API Key: ✓ Configured    # if key is set
✅ Gemini API Key: ✗ Not set (optional)  # if not set
```

### 4. Start the Frontend
```bash
cd frontend
npm run dev
```

## PDF Report Features

### Warning Level System
The PDF report uses a **5-tier warning system** with color-coded headers:

| Level | Color | Severity |
|-------|-------|----------|
| **CRITICAL** | 🔴 Red (#E63946) | Immediate action needed |
| **WARNING** | 🟠 Orange (#F77F00) | High concern |
| **CAUTION** | 🟡 Yellow (#FCBF49) | Moderate concern |
| **GOOD** | 🟢 Green (#06D6A0) | Healthy metrics |
| **EXCELLENT** | 🔵 Blue (#118AB2) | Outstanding results |

### Report Sections
1. **Status Badge** - Overall health status with color coding
2. **Bio-Longevity** - Projected lifespan and lifestyle insights
3. **Clinical Health** - Sleep disorder predictions and recommendations
4. **Financial Stability** - Economic resilience score and suggestions
5. **Personalized Recommendations** - Actionable lifestyle tips
6. **Timestamp & Footer** - Generation metadata

## Testing the PDF Generation

### Step 1: Generate a Prediction
1. Navigate to http://localhost:5175
2. Complete all 3 prediction steps
3. Generate the intelligence report

### Step 2: Download PDF
1. Click "Download PDF Report" button (previously "Download Report")
2. File will save as: `LifeBalance_Report_YYYY-MM-DD.pdf`

### Step 3: Verify Features
- ✅ PDF opens successfully
- ✅ Header image displays with correct color theme
- ✅ All three sections present (Longevity, Health, Finance)
- ✅ Recommendations are personalized
- ✅ Timestamp is current

## Troubleshooting

### "PDF generation failed" Error
**Cause**: Backend not running or endpoint not available
**Solution**: 
```bash
cd backend
.\venv\Scripts\activate
python app.py
```

### Header Image Not Displaying
**Cause**: Gemini API key missing or invalid
**Solution**: 
- Add valid Gemini API key to `.env`
- Or use fallback (app will auto-generate styled header without Gemini)

### Requirements Installation Fails
**Cause**: Missing dependencies
**Solution**: 
```bash
pip install reportlab Pillow google-generativeai python-dotenv
```

## Environment Variables

Create `backend/.env`:
```env
GEMINI_API_KEY=sk-...your-key-here...
FLASK_ENV=development
FLASK_DEBUG=True
```

**Note**: Never commit `.env` to Git (already in `.gitignore`)

## API Endpoints

### New Endpoint: Generate PDF Report
**POST** `/api/generate_pdf_report`

**Request:**
```json
{
  "longevity_prediction": "75 Years",
  "health_condition": "Normal",
  "financial_status": "14.50"
}
```

**Response:**
```
Binary PDF file (application/pdf)
```

## Architecture

```
frontend/
  └── Predictor.jsx → calls /api/generate_pdf_report

backend/
  ├── app.py → PDF endpoint handler
  ├── pdf_generator.py → PDF creation + Gemini integration
  └── .env → API keys & config
```

## Files Modified/Created

**Created:**
- `backend/.env` - Environment configuration
- `backend/pdf_generator.py` - PDF generation service (290+ lines)

**Modified:**
- `backend/app.py` - Added `/api/generate_pdf_report` endpoint
- `backend/requirements.txt` - Added dependencies
- `frontend/src/pages/Predictor.jsx` - Updated downloadReport() function

## Next Steps

1. ✅ Install dependencies
2. ✅ Add Gemini API key to `.env`
3. ✅ Restart backend
4. ✅ Test PDF generation
5. ✅ Deploy (remember to set `GEMINI_API_KEY` in production)

---

**For questions or issues, check logs:**
```bash
# Backend logs
python app.py   # Shows all API errors

# Browser console
F12 → Console   # Shows frontend errors
```
