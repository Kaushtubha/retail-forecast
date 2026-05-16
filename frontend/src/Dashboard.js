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

  const loadHistory = useCallback(async () => {
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
    </div>
  );
}

export default Dashboard;