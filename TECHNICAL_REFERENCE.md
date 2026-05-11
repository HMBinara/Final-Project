# Technical Implementation Reference
**For Quick Code Review and Continuation**

---

## Chart.jsx Component - Quick Overview

### Purpose
Tracks prediction history across multiple days and displays 3-line chart visualization.

### Key Functions

#### 1. loadPredictionHistory()
```javascript~
// Runs on component mount or when result changes
// Loads localStorage data
// Adds/updates current prediction entry
// Sorts by date
// Saves back to localStorage
```

**Logic Flow:**
1. Fetch `predictionHistory` from localStorage
2. Check if prediction for today exists
3. If yes → update that day's data
4. If no → add new entry
5. Sort array by date
6. Save back to localStorage

#### 2. Health Score Normalization
```javascript
const healthScore = 
  currentResult.health_condition === 'Normal' ? 90 :
  currentResult.health_condition === 'Insomnia' || 
  currentResult.health_condition === 'Sleep Apnea' ? 60 : 30;
```

**Mapping:**
| Health Condition | Score | Color |
|---|---|---|
| Normal | 90 | Green |
| Insomnia / Sleep Apnea | 60 | Orange |
| Bad / Other | 30 | Red |

#### 3. downloadChartData()
```javascript
// Converts chartData array to CSV format
// Creates blob and triggers download
// File name: prediction_history.csv
```

### Component Props
```javascript
Chart.propTypes = {
  isOpen: PropTypes.bool.required,        // Modal visibility
  onClose: PropTypes.func.required,       // Close handler
  currentResult: PropTypes.object         // AI prediction data
}
```

### CSS Classes Used
- `fixed inset-0` - Full screen overlay
- `backdrop-blur-sm` - Blur background
- `max-w-4xl` - Max width modal
- `max-h-[90vh]` - Max height with scroll
- Tailwind color system (blue-500, emerald-400, purple-400, etc.)

---

## Predictor.jsx Changes - Implementation Details

### 1. Import Addition (Line 8)
```javascript
import Chart from '../components/Chart';
// Also added LineChartIcon to imports:
LineChart as LineChartIcon
```

### 2. State Addition (Line 111)
```javascript
const [showChart, setShowChart] = useState(false);
```

### 3. Button Integration (Line 720-722)
```javascript
<button onClick={() => setShowChart(true)} 
  className="...">
  <LineChartIcon size={16} /> View Chart
</button>
```

### 4. Component Rendering (Line 765)
```javascript
<Chart 
  isOpen={showChart} 
  onClose={() => setShowChart(false)} 
  currentResult={result} 
/>
```

---

## localStorage Structure

### Key Name
```
predictionHistory
```

### Data Format
```javascript
[
  {
    date: "5/11/2026",              // Today's date
    longevity: 75,                  // Years (0-100+)
    health: 90,                     // Score (0-100)
    financial: 5.63,                // Resilience score
    timestamp: 1715425200000        // Unix timestamp
  },
  {
    date: "5/12/2026",
    longevity: 76,
    health: 95,
    financial: 6.12,
    timestamp: 1715511600000
  }
]
```

### Accessing in DevTools
```
1. Open DevTools (F12)
2. Go to Application tab
3. Storage → localStorage
4. Find key: "predictionHistory"
5. View/edit JSON array
```

### Clear History
```javascript
// In browser console:
localStorage.removeItem('predictionHistory');
// Page will show "No prediction history yet"
```

---

## Chart Metrics Explanation

### 1. Longevity Line (Blue)
- **Source:** AI Model output `longevity_prediction`
- **Unit:** Years
- **Range:** 0-100
- **Good:** 80+
- **Fair:** 65-79
- **Needs Work:** <65

### 2. Health Score Line (Green)
- **Source:** Normalized from `health_condition`
- **Scale:** 0-100
- **90:** Normal health
- **60:** Sleep issues detected
- **30:** Other health concerns
- **Calculated:** Maps 3 categories to numeric scale

### 3. Financial Score Line (Purple)
- **Source:** AI Model output `financial_status`
- **Unit:** Resilience Score (decimal)
- **Range:** 0-20
- **Excellent:** >15
- **Good:** 10-15
- **Needs Work:** <10

---

## User Flow for Chart Feature

```
User completes 3-step form
         ↓
Submits to Flask API
         ↓
Receives prediction result
{
  longevity_prediction: 75,
  health_condition: "Normal",
  financial_status: 5.63
}
         ↓
Shown Step 4 Report
         ↓
Clicks [View Chart] button
         ↓
setShowChart(true)
         ↓
Chart component:
  1. Loads localStorage history
  2. Adds today's prediction
  3. Re-renders chart
         ↓
User sees:
  - 3-line chart with data
  - Historical table
  - Stats cards
  - Export button
         ↓
User can:
  - Analyze trends
  - Export data (CSV)
  - Close modal
  - Generate new prediction
```

---

## Testing Scenarios

### Scenario 1: First Time User
```
1. Generate prediction
2. Click View Chart
3. Expected: Only 1 data point, message "1 prediction recorded"
4. Chart shows single point for today
```

### Scenario 2: Same Day Second Prediction
```
1. Generate prediction again (same day)
2. Click View Chart
3. Expected: Still 1 data point, data updated
4. New values replace old ones for today
```

### Scenario 3: Next Day Prediction
```
1. Wait until next day
2. Generate new prediction
3. Click View Chart
4. Expected: 2 data points, message "2 predictions recorded"
5. Chart shows line connecting 2 days
```

### Scenario 4: CSV Export
```
1. Have 3+ predictions
2. Open Chart
3. Click "Export Data"
4. Expected: prediction_history.csv downloads
5. File contains date, longevity, health, financial columns
```

---

## Potential Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Chart not showing | localStorage disabled | Enable localStorage in browser settings |
| Data not persisting | Wrong key name | Check localStorage key is exactly `predictionHistory` |
| Three lines not visible | CSS class issue | Inspect chart colors in DevTools |
| CSV not downloading | CORS issue | Check file download permissions |
| Modal not opening | State not updating | Verify `setShowChart` is called |
| Chart flickering | Re-render on every update | Use memo if needed (not implemented) |

---

## Performance Considerations

- **localStorage Limit:** ~5-10MB (plenty for predictions)
- **Chart Points:** Safe up to 1000+ data points
- **Recharts:** Optimized for 100-500 points (comfortable range)
- **Re-renders:** Only on prediction submit or chart open

---

## Future Enhancement Ideas

1. **Filters:**
   - Date range selector
   - Show/hide lines toggle

2. **Analytics:**
   - Trend percentage change
   - Moving average
   - Prediction accuracy comparison

3. **UI Improvements:**
   - Dark mode toggle
   - Full-screen chart
   - Export to PDF with chart

4. **Data:**
   - Sync predictions to backend
   - Multi-user support
   - Predictive recommendations

---

**Reference Complete! Ready for next session.** ✅
