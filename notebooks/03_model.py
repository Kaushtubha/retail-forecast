import pandas as pd
import numpy as np
import pickle
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error
from catboost import CatBoostRegressor

# ── 1. LOAD CLEANED DATA ──────────────────────
df = pd.read_csv('../data/cleaned_train.csv')
print('Data loaded. Shape:', df.shape)

# ── 2. SPLIT FEATURES AND TARGET ──────────────
X = df.drop(columns=['Item_Outlet_Sales'])
y = df['Item_Outlet_Sales']

print('Features:', X.columns.tolist())
print('Target: Item_Outlet_Sales')

# ── 3. TRAIN TEST SPLIT ───────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f'\nTrain size: {X_train.shape[0]} rows')
print(f'Test size:  {X_test.shape[0]} rows')

# ── 4. MODEL 1: Linear Regression ─────────────
print('\n' + '='*40)
print('Training Model 1: Linear Regression...')
lr = LinearRegression()
lr.fit(X_train, y_train)
lr_pred = lr.predict(X_test)
lr_rmse = root_mean_squared_error(y_test, lr_pred)
print(f'Linear Regression RMSE: {lr_rmse:.2f}')

# ── 5. MODEL 2: Random Forest ─────────────────
print('\n' + '='*40)
print('Training Model 2: Random Forest...')
rf = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)
rf_pred = rf.predict(X_test)
rf_rmse = root_mean_squared_error(y_test, rf_pred)
print(f'Random Forest RMSE: {rf_rmse:.2f}')

# ── 6. MODEL 3: CatBoost ──────────────────────
print('\n' + '='*40)
print('Training Model 3: CatBoost...')
cb = CatBoostRegressor(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    random_seed=42,
    verbose=100
)
cb.fit(X_train, y_train)
cb_pred = cb.predict(X_test)
cb_rmse = root_mean_squared_error(y_test, cb_pred)
print(f'CatBoost RMSE: {cb_rmse:.2f}')

# ── 7. COMPARE ALL MODELS ─────────────────────
print('\n' + '='*40)
print('MODEL COMPARISON:')
print(f'  Linear Regression : RMSE = {lr_rmse:.2f}')
print(f'  Random Forest     : RMSE = {rf_rmse:.2f}')
print(f'  CatBoost          : RMSE = {cb_rmse:.2f}')

results = {
    'Linear Regression': lr_rmse,
    'Random Forest': rf_rmse,
    'CatBoost': cb_rmse
}
best_model_name = min(results, key=results.get)
print(f'\n  BEST MODEL: {best_model_name} with RMSE = {results[best_model_name]:.2f}')

# ── 8. SAVE BEST MODEL ────────────────────────
best_models = {
    'Linear Regression': lr,
    'Random Forest': rf,
    'CatBoost': cb
}
best_model = best_models[best_model_name]

with open('../data/model.pkl', 'wb') as f:
    pickle.dump(best_model, f)

print(f'\nBest model saved to: data/model.pkl')
print('Step 4 COMPLETE!')