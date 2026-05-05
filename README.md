
# 🛒 JEYAS RetailIQ: Enterprise-Grade Demand Forecasting
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![CatBoost](https://img.shields.io/badge/ML-CatBoost-FFCC00?style=for-the-badge&logo=catboost&logoColor=black)](https://catboost.ai/)
[![Docker](https://img.shields.io/badge/DevOps-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

**JEYAS RetailIQ** is an advanced AI-powered inventory optimization platform that bridges the gap between predictive modeling and actionable retail intelligence. By leveraging gradient-boosted decision trees and a microservices architecture, the platform provides real-time sales forecasting and automated stock recommendations.

---

## 🚀 Key Features

*   **⚡ High-Precision Forecasting**: Utilizes a fine-tuned **CatBoost Regressor** to predict sales metrics based on multi-dimensional product and outlet features.
*   **🤖 Automated Inventory Logic**: An intelligent recommendation engine that categorizes stock levels into **Low, Medium, High, and Critical** tiers.
*   **📊 Dynamic Monitoring Dashboard**: A responsive React interface providing real-time visualization of prediction history and stock metrics.
*   **🛠️ Production-Ready MLOps**: Integrated pipelines for **Data Drift Detection** and **Automated Model Retraining** to ensure long-term model reliability.
*   **🐳 Containerized Microservices**: Fully orchestrated via **Docker Compose**, ensuring seamless deployment and environment parity.

---

## 🏗️ Tech Stack

### Backend & AI
*   **Python / FastAPI**: High-performance asynchronous API layer.
*   **CatBoost**: Advanced categorical gradient boosting for regression.
*   **SQLAlchemy / PostgreSQL**: Relational data persistence for prediction auditing.
*   **Joblib / Pickle**: Serialized model management.

### Frontend
*   **React.js**: Component-based UI architecture.
*   **Tailwind CSS**: Modern utility-first styling for a premium interface.
*   **Axios**: Efficient handling of asynchronous HTTP requests.

### DevOps & Infrastructure
*   **Docker**: Multi-container orchestration.
*   **PostgreSQL**: Scalable database management.
*   **Git**: Version control and CI/CD readiness.

---

## 📐 System Architecture

1.  **Ingestion**: Raw retail data is processed via automated cleaning scripts.
2.  **Inference**: The FastAPI backend serves the CatBoost model to provide instant predictions.
3.  **Persistence**: Every prediction is logged in PostgreSQL for historical analysis.
4.  **Observation**: Monitoring scripts perform statistical checks (KS-test) to identify data drift.

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Kaushtubha/retail-forecast.git

# Navigate to the project
cd retail-forecast

# Launch the entire stack using Docker
docker compose up --build
```

---

## 📈 MLOps Lifecycle

The project includes a dedicated `notebooks/` directory for continuous improvement:
*   `01_eda.py`: Deep statistical analysis of the Big Mart Sales dataset.
*   `04_retrain.py`: Script to update `model.pkl` with new production data.
*   `05_drift.py`: Statistical checks to identify shifts in data distribution.

---

## 👤 Author

**Kaushtubham Shukla**
*   **Full Stack Web Developer & AI Engineer**
*   **Education**: B.Tech in CSE, VIT Bhopal University
*   **Registration Number**: 23BAI10690
*   **Notable Projects**: [AskLexi](https://github.com/Kaushtubha), [Statbot Pro](https://github.com/Kaushtubha), [Dastawez.ai](https://github.com/Kaushtubha)
