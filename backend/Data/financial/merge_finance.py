import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# 1. Load and initialize datasets
# Loading financial history and investment preference data
loan_df = pd.read_csv('Loan_approval_data_2025.csv')
finance_df = pd.read_csv('Finance_data.csv')

# 2. Extract key financial features from Loan Dataset
# Selecting features that directly impact long-term financial stability
loan_features = loan_df[[
    'age', 'occupation_status', 'years_employed', 'annual_income', 
    'credit_score', 'savings_assets', 'current_debt', 
    'defaults_on_file', 'debt_to_income_ratio'
]]

# 3. Aggregate Investment Habits from Finance Dataset
# Grouping by age to generalize investment behavior across different demographics
finance_features = finance_df.groupby('age').agg({
    'Investment_Avenues': lambda x: x.mode()[0], # Most frequent investment status
    'Mutual_Funds': 'mean',                      # Average preference for Mutual Funds
    'Equity_Market': 'mean',                     # Average preference for Equity
    'Fixed_Deposits': 'mean',                    # Average preference for FDs
    'Stock_Marktet': lambda x: x.mode()[0],      # Common stock market participation
    'Duration': lambda x: x.mode()[0]            # Typical investment horizon
}).reset_index()

# 4. Integrate Datasets
# Merging core financial records with demographic investment patterns based on age
master_finance = pd.merge(loan_features, finance_features, on='age', how='left')

# 5. Feature Engineering: Calculate Financial Stability Score
# Applying weighted logic to determine a raw stability metric
# Positive weights: Income, Credit Score, Assets
# Negative weights: Debt and severe penalties for defaults
master_finance['stability_score'] = (
    (master_finance['annual_income'] * 0.3) + 
    (master_finance['credit_score'] * 0.2) + 
    (master_finance['savings_assets'] * 0.2) - 
    (master_finance['current_debt'] * 0.2) - 
    (master_finance['defaults_on_file'] * 5000) 
)

# 6. Normalize the Score
# Scaling the stability score to a standard 0-100 range for better interpretability
scaler = MinMaxScaler(feature_range=(0, 100))
master_finance['stability_score'] = scaler.fit_transform(master_finance[['stability_score']])

# 7. Data Persistence
# Saving the processed master dataset for machine learning model training
master_finance.to_csv('Master_Finance_Data.csv', index=False)

print("Data integration complete! Master_Finance_Data.csv generated with enhanced features.")