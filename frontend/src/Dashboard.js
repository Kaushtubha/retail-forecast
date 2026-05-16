import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FiBarChart2,
  FiClock,
  FiCpu,
  FiLogOut,
  FiMoon,
  FiSun,
  FiActivity,
  FiZap,
  FiShield,
  FiDatabase,
  FiTrendingUp,
} from "react-icons/fi";
import "./Dashboard.css";

const API_BASE = "http://localhost:8000";

const initialForm = {
  Item_Weight: "",
  Item_Fat_Content: 0,
  Item_Visibility: "",
  Item_Type: 0,
  Item_MRP: "",
  Outlet_Identifier: 0,
  Outlet_Size: 1,
  Outlet_Location_Type: 0,
  Outlet_Type: 0,
  Outlet_Age: "",
  Visibility_Was_Zero: 0,
  MRP_Category: 0,
};

const priorityColors = {
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

const priorityBg = {
  LOW: "rgba(34, 197, 94, 0.14)",
  MEDIUM: "rgba(245, 158, 11, 0.14)",
  HIGH: "rgba(249, 115, 22, 0.14)",
  CRITICAL: "rgba(239, 68, 68, 0.14)",
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("predict");
  const [darkMode, setDarkMode] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const userName = "Kaush";
  const token = sessionStorage.getItem("token") || "";

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }, [token]);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (activeTab === "history" || activeTab === "insights") {
      loadHistory();
    }
  }, [activeTab, loadHistory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = 0;
    let height = 0;
    const particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const makeParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 2.2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.08)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.12 - dist / 1200})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    makeParticles();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("resize", makeParticles);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", makeParticles);
    };
  }, []);

  const loadHistory =useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get("/history");
      setHistory(res.data.last_10 || []);
    } catch (e) {
      setError("Failed to load history.");
    } finally {
      setLoadingHistory(false);
    }
  }, [api]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingPredict(true);

    try {
      const payload = {
        Item_Weight: Number(form.Item_Weight),
        Item_Fat_Content: Number(form.Item_Fat_Content),
        Item_Visibility: Number(form.Item_Visibility),
        Item_Type: Number(form.Item_Type),
        Item_MRP: Number(form.Item_MRP),
        Outlet_Identifier: Number(form.Outlet_Identifier),
        Outlet_Size: Number(form.Outlet_Size),
        Outlet_Location_Type: Number(form.Outlet_Location_Type),
        Outlet_Type: Number(form.Outlet_Type),
        Outlet_Age: Number(form.Outlet_Age),
        Visibility_Was_Zero: Number(form.Visibility_Was_Zero),
        MRP_Category: Number(form.MRP_Category),
      };

      const res = await api.post("/predict", payload);
      setResult(res.data);
      setActiveTab("predict");
      await loadHistory();
    } catch (e) {
      setError(e?.response?.data?.detail || "Prediction failed.");
    } finally {
      setLoadingPredict(false);
    }
  };

  const onLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const avgSales = useMemo(() => {
    if (!history.length) return 0;
    return (
      history.reduce((sum, row) => sum + Number(row.predicted_sales || 0), 0) /
      history.length
    );
  }, [history]);

  const criticalAlerts = useMemo(
    () => history.filter((x) => String(x.priority).toUpperCase() === "CRITICAL").length,
    [history]
  );

  const peakSale = useMemo(() => {
    if (!history.length) return 0;
    return Math.max(...history.map((x) => Number(x.predicted_sales || 0)));
  }, [history]);

  const chartData = useMemo(() => {
    return [...history].slice().reverse().map((item, idx) => ({
      name: `#${idx + 1}`,
      sales: Number(item.predicted_sales || 0),
      priority: String(item.priority || "").toUpperCase(),
    }));
  }, [history]);

  const getPriorityTone = (priority) => {
    const p = String(priority || "").toUpperCase();
    return priorityColors[p] || "#94a3b8";
  };

  const getPriorityBackground = (priority) => {
    const p = String(priority || "").toUpperCase();
    return priorityBg[p] || "rgba(148, 163, 184, 0.14)";
  };

  const getRecommendationText = () => {
    if (!result?.inventory) return "Awaiting prediction";
    return `${result.inventory.recommendation} • ${result.inventory.units_to_stock} units • ${result.inventory.priority}`;
  };

  return (
    <div className={`dashboard-shell ${darkMode ? "dark" : "light"}`}>
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="dashboard-overlay" />

      <div className="dashboard-container">
        <header className="topbar glass">
          <div className="brand-block">
            <div className="brand-mark">J</div>
            <div>
              <div className="brand-title">JEYAS RetailIQ</div>
              <div className="brand-subtitle">Retail Demand Forecasting</div>
            </div>
          </div>

          <nav className="tab-nav">
            <button
              className={activeTab === "predict" ? "tab active" : "tab"}
              onClick={() => setActiveTab("predict")}
            >
              <FiZap /> Predict
            </button>
            <button
              className={activeTab === "history" ? "tab active" : "tab"}
              onClick={() => setActiveTab("history")}
            >
              <FiClock /> History
            </button>
            <button
              className={activeTab === "insights" ? "tab active" : "tab"}
              onClick={() => setActiveTab("insights")}
            >
              <FiActivity /> Insights
            </button>
          </nav>

          <div className="topbar-actions">
            <div className="user-chip">{userName}</div>
            <button className="icon-btn" onClick={() => setDarkMode((v) => !v)} title="Toggle theme">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button className="logout-btn" onClick={onLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </header>

        <section className="kpi-grid">
          <div className="kpi-card glass">
            <div className="kpi-label">Avg Sales</div>
            <div className="kpi-value">{avgSales.toFixed(2)}</div>
            <FiTrendingUp className="kpi-icon" />
          </div>
          <div className="kpi-card glass">
            <div className="kpi-label">Total Predictions</div>
            <div className="kpi-value">{history.length}</div>
            <FiDatabase className="kpi-icon" />
          </div>
          <div className="kpi-card glass">
            <div className="kpi-label">Critical Alerts</div>
            <div className="kpi-value">{criticalAlerts}</div>
            <FiShield className="kpi-icon" />
          </div>
          <div className="kpi-card glass">
            <div className="kpi-label">Peak Sale</div>
            <div className="kpi-value">{peakSale.toFixed(2)}</div>
            <FiBarChart2 className="kpi-icon" />
          </div>
        </section>

        {error ? <div className="error-banner">{error}</div> : null}

        {activeTab === "predict" && (
          <section className="content-grid">
            <div className="panel glass form-panel">
              <div className="panel-header">
                <h2>Prediction Form</h2>
                <p>Enter encoded features to forecast demand.</p>
              </div>

              <form className="predict-form" onSubmit={handlePredict}>
                {Object.keys(initialForm).map((key) => (
                  <label key={key} className="input-group">
                    <span>{key}</span>
                    <input
                      type="number"
                      step="any"
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={key}
                      required
                    />
                  </label>
                ))}

                <button className="primary-btn" type="submit" disabled={loadingPredict}>
                  {loadingPredict ? "Predicting..." : "Generate Prediction"}
                </button>
              </form>
            </div>

            <div className="panel glass result-panel">
              <div className="panel-header">
                <h2>Forecast Result</h2>
                <p>Model output and inventory recommendation.</p>
              </div>

              <div className="sales-ring">
                <div className="ring-inner">
                  <div className="ring-label">Predicted Sales</div>
                  <div className="ring-value">
                    {result ? Number(result.predicted_sales).toFixed(2) : "—"}
                  </div>
                </div>
              </div>

              <div className="result-card">
                <div className="result-line">{getRecommendationText()}</div>
                <div
                  className="priority-pill"
                  style={{
                    color: getPriorityTone(result?.inventory?.priority),
                    background: getPriorityBackground(result?.inventory?.priority),
                    borderColor: getPriorityTone(result?.inventory?.priority),
                  }}
                >
                  {result?.inventory?.priority || "No priority yet"}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "history" && (
          <section className="content-grid history-grid">
            <div className="panel glass chart-panel">
              <div className="panel-header">
                <h2>Prediction Trend</h2>
                <p>Last 10 saved predictions.</p>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.65)" />
                    <YAxis stroke="rgba(255,255,255,0.65)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(12, 15, 28, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="sales" radius={[10, 10, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={getPriorityTone(entry.priority)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel glass table-panel">
              <div className="panel-header">
                <h2>History Table</h2>
                <p>Saved predictions from PostgreSQL.</p>
              </div>

              <div className="table-wrap">
                {loadingHistory ? (
                  <div className="loading-state">Loading history...</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Predicted Sales</th>
                        <th>Recommendation</th>
                        <th>Priority</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((row) => (
                        <tr key={row.id}>
                          <td>{row.id}</td>
                          <td>{Number(row.predicted_sales).toFixed(2)}</td>
                          <td>{row.recommendation}</td>
                          <td>
                            <span
                              className="priority-pill compact"
                              style={{
                                color: getPriorityTone(row.priority),
                                background: getPriorityBackground(row.priority),
                                borderColor: getPriorityTone(row.priority),
                              }}
                            >
                              {row.priority}
                            </span>
                          </td>
                          <td>{row.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "insights" && (
          <section className="insight-grid">
            <div className="info-card glass">
              <FiCpu className="info-icon" />
              <h3>Model Details</h3>
              <p>CatBoost regression is the best model and is saved as model.pkl for serving predictions.</p>
            </div>
            <div className="info-card glass">
              <FiDatabase className="info-icon" />
              <h3>Data Pipeline</h3>
              <p>BigMart data is cleaned, encoded, feature engineered, and written to cleaned_train.csv before training.</p>
            </div>
            <div className="info-card glass">
              <FiActivity className="info-icon" />
              <h3>Tech Stack</h3>
              <p>React, Recharts, FastAPI, PostgreSQL, pandas, scikit-learn, and CatBoost power the full stack app.</p>
            </div>
            <div className="info-card glass">
              <FiZap className="info-icon" />
              <h3>Feature Importance</h3>
              <p>MRP, outlet type, visibility, and outlet age typically drive the strongest sales patterns.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;