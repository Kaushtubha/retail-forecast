import joblib  # Using joblib instead of pickle for better compatibility
import numpy as np
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, Prediction, init_db
from fastapi.middleware.cors import CORSMiddleware
import os

# ── 1. LOAD MODEL ─────────────────────────────
# ✅ FIXED: Path changed from '../data/model.pkl' to 'data/model.pkl'
# This matches the COPY data /app/data instruction in your Dockerfile
MODEL_PATH = os.getenv("MODEL_PATH", "data/model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    # Fallback for local development if needed
    model = None

# ── 2. INIT DATABASE ──────────────────────────
try:
    init_db()
    print("Database initialized!")
except Exception as e:
    print(f"Database init warning: {e}")

# ── 3. FASTAPI APP ────────────────────────────
app = FastAPI(
    title="JEYAS RetailIQ API",
    description="Predicts sales and gives inventory recommendations",
    version="2.0.0"
)

# ✅ FIXED CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 4. DATABASE SESSION ───────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── 5. INPUT SCHEMA ───────────────────────────
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

# ── 6. INVENTORY LOGIC ────────────────────────
def get_inventory_recommendation(predicted_sales: float) -> dict:
    if predicted_sales < 500:
        return {"recommendation": "Low Stock", "units_to_stock": 10, "priority": "LOW"}
    elif predicted_sales < 2000:
        return {"recommendation": "Medium Stock", "units_to_stock": 25, "priority": "MEDIUM"}
    elif predicted_sales < 4000:
        return {"recommendation": "High Stock", "units_to_stock": 50, "priority": "HIGH"}
    else:
        return {"recommendation": "Very High Stock", "units_to_stock": 100, "priority": "CRITICAL"}

# ── 7. ROUTES ─────────────────────────────────
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

# ADDED FOR STEP 9: MLOps Metrics
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

    # Build features
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

    # Predict
    predicted_sales = float(model.predict(features)[0])
    inventory = get_inventory_recommendation(predicted_sales)

    # Save to DB
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
