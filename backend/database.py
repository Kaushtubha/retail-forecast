import os
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# ── DATABASE CONNECTION ────────────────────────
# ✅ FIXED: Uses 'db' (the Docker service name) instead of 'localhost'
# It first checks the environment variable from docker-compose, then falls back to local
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:First1%40infamily@localhost:5432/retail_forecast"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ── TABLE 1: Products ──────────────────────────
class Product(Base):
    __tablename__ = "products"
    id                  = Column(Integer, primary_key=True, index=True)
    item_identifier     = Column(String)
    item_type           = Column(String)
    item_mrp            = Column(Float)
    outlet_identifier   = Column(String)
    outlet_type         = Column(String)
    created_at          = Column(DateTime, default=datetime.utcnow)

# ── TABLE 2: Predictions ───────────────────────
class Prediction(Base):
    __tablename__ = "predictions"
    id               = Column(Integer, primary_key=True, index=True)
    item_mrp         = Column(Float)
    outlet_type      = Column(Integer)
    outlet_age       = Column(Integer)
    predicted_sales  = Column(Float)
    recommendation   = Column(String)
    units_to_stock   = Column(Integer)
    priority         = Column(String)
    created_at       = Column(DateTime, default=datetime.utcnow)

# ── CREATE ALL TABLES ──────────────────────────
def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully!")