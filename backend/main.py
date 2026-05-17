import joblib
import numpy as np
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, Prediction, init_db
from fastapi.middleware.cors import CORSMiddleware
import os

MODEL_PATH = os.getenv("MODEL_PATH", "data/model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

try:
    init_db()
    print("Database initialized!")
except Exception as e:
    print(f"Database init warning: {e}")

app = FastAPI(
    title="JEYAS RetailIQ API",
    description="Predicts sales and gives inventory recommendations",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class PredictRequest(BaseModel):
    Item_Weight: float
    Item_Fat_Content: int
    Item_Visibility: float
    Item_Type: int
    Item_MRP: float
    Outlet_Identifier: int
    Outlet_Size: int
    Outlet_Location_Type: int
    Outlet_Type: int
    Outlet_Age: int
    Visibility_Was_Zero: int
    MRP_Category: int

def get_inventory_recommendation(predicted_sales: float) -> dict:
    if predicted_sales < 500:
        return {"recommendation": "Low Stock", "units_to_stock": 10, "priority": "LOW"}
    elif predicted_sales < 2000:
        return {"recommendation": "Medium Stock", "units_to_stock": 25, "priority": "MEDIUM"}
    elif predicted_sales < 4000:
        return {"recommendation": "High Stock", "units_to_stock": 50, "priority": "HIGH"}
    else:
        return {"recommendation": "Very High Stock", "units_to_stock": 100, "priority": "CRITICAL"}

@app.get("/")
def root():
    return {
        "message": "JEYAS RetailIQ API v2.0",
        "endpoints": ["/predict", "/history", "/health", "/metrics"]
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "database": "Connected"
    }

@app.get("/metrics")
async def get_metrics(db: Session = Depends(get_db)):
    total = db.query(Prediction).count()
    return {
        "total_predictions": total,
        "model_type": "CatBoost",
        "status": "active"
    }

@app.post("/predict")
def predict(request: PredictRequest, db: Session = Depends(get_db)):
    if model is None:
        return {"error": "Model not loaded"}

    features = np.array([[
        request.Item_Weight,
        request.Item_Fat_Content,
        request.Item_Visibility,
        request.Item_Type,
        request.Item_MRP,
        request.Outlet_Identifier,
        request.Outlet_Size,
        request.Outlet_Location_Type,
        request.Outlet_Type,
        request.Outlet_Age,
        request.Visibility_Was_Zero,
        request.MRP_Category
    ]])

    predicted_sales = float(model.predict(features)[0])
    inventory = get_inventory_recommendation(predicted_sales)

    record = Prediction(
        item_mrp=request.Item_MRP,
        outlet_type=request.Outlet_Type,
        outlet_age=request.Outlet_Age,
        predicted_sales=round(predicted_sales, 2),
        recommendation=inventory["recommendation"],
        units_to_stock=inventory["units_to_stock"],
        priority=inventory["priority"]
    )

    db.add(record)
    db.commit()

    return {
        "predicted_sales": round(predicted_sales, 2),
        "currency": "INR",
        "inventory": inventory
    }

@app.get("/history")
def history(db: Session = Depends(get_db)):
    records = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(10).all()

    return {
        "total_predictions": db.query(Prediction).count(),
        "last_10": [
            {
                "id": r.id,
                "predicted_sales": r.predicted_sales,
                "recommendation": r.recommendation,
                "priority": r.priority,
                "created_at": str(r.created_at)
            }
            for r in records
        ]
    }