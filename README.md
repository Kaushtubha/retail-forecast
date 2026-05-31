# 🛒 JEYAS RetailIQ — Enterprise-Grade Demand Forecasting Platform

[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![CatBoost](https://img.shields.io/badge/ML-CatBoost-FFCC00?style=for-the-badge&logo=catboost&logoColor=black)](https://catboost.ai/)
[![Docker](https://img.shields.io/badge/DevOps-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Python](https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

> **AI-powered inventory optimization platform** | FastAPI + React + CatBoost + Docker + PostgreSQL

**JEYAS RetailIQ** bridges the gap between predictive modeling and actionable retail intelligence. By leveraging gradient-boosted decision trees and a microservices architecture, it provides real-time sales forecasting and automated stock recommendations.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🚀 **Live App** | [retail-forecast-q2qs.vercel.app](https://retail-forecast-q2qs.vercel.app) |
| 💾 **GitHub Repo** | [github.com/Kaushtubha/retail-forecast](https://github.com/Kaushtubha/retail-forecast) |

---

## 🏗️ What We Built

### 🤖 Machine Learning & AI
| Component | Description |
|-----------|-------------|
| **Demand Forecasting Model** | Fine-tuned CatBoost Regressor trained on Big Mart Sales dataset |
| **Inventory Recommendation Engine** | Classifies stock into Low / Medium / High / Critical tiers automatically |
| **Data Drift Detection** | KS-test statistical checks to identify shifts in data distribution |
| **Automated Retraining Pipeline** | Script to retrain and update model with new production data |

### 🖥️ Frontend Dashboard
| Component | Description |
|-----------|-------------|
| **Prediction Interface** | Input form for product & outlet features with instant forecast results |
| **Real-time Monitoring Dashboard** | Visual charts showing prediction history and stock metrics |
| **Stock Level Visualizations** | Dynamic color-coded inventory status indicators |
| **Responsive UI** | Mobile-friendly design with Tailwind CSS |

### ⚙️ Backend & Infrastructure
| Component | Description |
|-----------|-------------|
| **FastAPI REST API** | High-performance async API serving the ML model |
| **Prediction Logging** | Every prediction persisted to PostgreSQL for audit trails |
| **Model Serving** | Joblib-based serialized model management |
| **Docker Compose Stack** | Fully containerized multi-service orchestration |

### 📓 MLOps Notebooks
| Script | Description |
|--------|-------------|
| `01_eda.py` | Deep statistical analysis of the Big Mart Sales dataset |
| `04_retrain.py` | Updates `model.pkl` with new production data |
| `05_drift.py` | Statistical drift detection using KS-test |

---

## 🚀 Key Features

- ⚡ **High-Precision Forecasting** — CatBoost Regressor with multi-dimensional product & outlet features
- 🤖 **Automated Inventory Logic** — Intelligent stock tier classification (Low / Medium / High / Critical)
- 📊 **Dynamic Monitoring Dashboard** — Real-time React dashboard with prediction history
- 🛠️ **Production-Ready MLOps** — Data drift detection & automated model retraining pipelines
- 🐳 **Containerized Microservices** — Fully orchestrated via Docker Compose
- 🗄️ **Prediction Auditing** — Every inference logged to PostgreSQL for historical analysis

---

## 🧰 Tech Stack

### Backend & AI
| Technology | Purpose |
|------------|---------|
| Python / FastAPI | High-performance async API layer |
| CatBoost | Gradient boosting for sales regression |
| SQLAlchemy / PostgreSQL | Relational data persistence & prediction logging |
| Joblib / Pickle | Serialized ML model management |

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | Component-based UI architecture |
| Tailwind CSS | Utility-first modern styling |
| Axios | Async HTTP request handling |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker & Docker Compose | Multi-container orchestration |
| PostgreSQL | Scalable production database |
| Vercel | Frontend deployment |
| Git | Version control & CI/CD readiness |

---

## 📐 System Architecture

```
User Input (React)
      │
      ▼
FastAPI Backend ──► CatBoost Model ──► Prediction Output
      │                                       │
      ▼                                       ▼
PostgreSQL DB                    Inventory Recommendation
(Prediction Logs)                (Low / Medium / High / Critical)
      │
      ▼
Monitoring Dashboard (React)
```

1. **Ingestion** — Raw retail data processed via automated cleaning scripts
2. **Inference** — FastAPI serves CatBoost model for instant predictions
3. **Persistence** — Every prediction logged in PostgreSQL for historical analysis
4. **Observation** — Monitoring scripts perform KS-test statistical drift checks

---

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose installed
- Git

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Kaushtubha/retail-forecast.git

# Navigate to project
cd retail-forecast

# Launch entire stack
docker compose up --build
```

App will be available at `http://localhost:3000`

### Manual Setup

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

---

## 📈 MLOps Lifecycle

```
Raw Data ──► EDA (01_eda.py) ──► Model Training ──► model.pkl
                                                         │
New Data ──► Drift Detection (05_drift.py)               │
                    │                                    │
                    ▼                                    │
            Retraining (04_retrain.py) ──────────────────┘
```

---

## 📁 Project Structure

```
retail-forecast/
├── backend/
│   ├── main.py              # FastAPI app & routes
│   ├── model.pkl            # Serialized CatBoost model
│   ├── models/              # SQLAlchemy DB models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   └── App.jsx
│   └── package.json
├── notebooks/
│   ├── 01_eda.py            # Exploratory data analysis
│   ├── 04_retrain.py        # Model retraining script
│   └── 05_drift.py          # Data drift detection
├── docker-compose.yml
└── README.md
```

---

## 👤 Author

**Kaushtubham Shukla**
- 🎓 B.Tech CSE — VIT Bhopal University
- 💼 Full Stack Developer & AI Engineer
- 🔗 [GitHub](https://github.com/Kaushtubha)

### Other Projects
| Project | Description |
|---------|-------------|
| [Dastawez.ai](https://github.com/Kaushtubha/dastawez.ai) | AI-powered document assistant |
| [Statbot Pro](https://github.com/Kaushtubha/Statbot-Proo) | Statistics automation bot |

---

*Built with ❤️ — Bridging AI and retail intelligence for smarter inventory decisions.*
