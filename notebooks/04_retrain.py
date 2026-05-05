import pandas as pd
from catboost import CatBoostRegressor
import joblib

def retrain_model():
    # Retraining using the cleaned data
    train_df = pd.read_csv('backend/data/cleaned_train.csv')
    X = train_df.drop('Item_Outlet_Sales', axis=1)
    y = train_df['Item_Outlet_Sales']
    
    new_model = CatBoostRegressor(iterations=500, silent=True)
    new_model.fit(X, y)
    
    joblib.dump(new_model, 'backend/data/model.pkl')
    print("Model retrained successfully.")

if __name__ == '__main__':
    retrain_model()
