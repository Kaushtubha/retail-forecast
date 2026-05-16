import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

export default function Login({ onLogin, theme, toggleTheme }) {
  const [tab,      setTab]      = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [ready,    setReady]    = useState(false);
  const [form,     setForm]     = useState({ username:'', password:'' });
  const canvasRef               = useRef(null);

  useEffect(() => { setTimeout(() => setReady(true), 120); }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    let raf;
    let W = cvs.width  = window.innerWidth;
    let H = cvs.height = window.innerHeight;
    let mx = W / 2, my = H / 2;

    const pts = Array.from({ length: 110 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - .5) * .55,
      vy: (Math.random() - .5) * .55,
      r:  Math.random() * 2 + .4,
      h:  Math.random() > .5 ? 245 : 270,
    }));

    const onMove = e => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);

    const onResize = () => {
      W = cvs.width  = window.innerWidth;
      H = cvs.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const dx = mx - p.x, dy = my - p.y;
        const d  = Math.hypot(dx, dy);
        if (d < 180) { p.vx += dx * .00006; p.vy += dy * .00006; }
        p.vx *= .985; p.vy *= .985;
        p.x  += p.vx;  p.y  += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},65%,65%,.55)`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${.22 * (1 - d / 140)})`;
            ctx.lineWidth   = .7;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const submit = async () => {
    if (!form.username.trim()) { setError('Username is required'); return; }
    if (form.password.length < 4) { setError('Password must be 4+ characters'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    onLogin(form.username.trim());
    setLoading(false);
  };

  return (
    <div className="lp">
      <canvas ref={canvasRef} className="lp-canvas" />
      <div className="lp-orb o1"/><div className="lp-orb o2"/>
      <div className="lp-orb o3"/><div className="lp-orb o4"/>
      <div className="lp-grid"/>

      <button className="lp-theme" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={`lp-card ${ready ? 'lp-in' : ''}`}>

        {/* LEFT PANEL */}
        <div className="lp-left">
          <div className="lp-brand">
            <div className="lp-logo-wrap">
              <span className="lp-logo-icon">⚡</span>
            </div>
            <div>
              <div className="lp-logo-name">JEYAS</div>
              <div className="lp-logo-sub">AI Analytics Platform</div>
            </div>
          </div>

          <h1 className="lp-hero">
            Predict.<br/>
            <span className="lp-grad">Optimize.</span><br/>
            Grow.
          </h1>
          <p className="lp-sub">
            AI-powered demand forecasting that helps retailers make smarter inventory decisions in real-time.
          </p>

          <div className="lp-features">
            {[
              ['🧠', 'CatBoost ML',    'RMSE 1028 accuracy'],
              ['📊', 'Real-time API',  'Instant predictions'],
              ['🗄️', 'PostgreSQL',     'All data persisted'],
              ['🎨', 'Premium UI',     'Production-grade'],
            ].map(([ic, t, d], i) => (
              <div className="lp-feat" key={i} style={{ animationDelay:`${i * .08}s` }}>
                <span className="lp-feat-ic">{ic}</span>
                <div>
                  <div className="lp-feat-t">{t}</div>
                  <div className="lp-feat-d">{d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lp-stats">
            {[['8.5K+','Products'],['98%','Accuracy'],['10+','Outlets'],['∞','Scale']].map(([n,l]) => (
              <div className="lp-stat" key={l}>
                <span className="lp-stat-n">{n}</span>
                <span className="lp-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lp-right">
          <div className="lp-glow-bar"/>

          <div className="lp-tabs">
            <button
              className={tab === 'login' ? 'lp-tab active' : 'lp-tab'}
              onClick={() => { setTab('login'); setError(''); }}
            >Sign In</button>
            <button
              className={tab === 'register' ? 'lp-tab active' : 'lp-tab'}
              onClick={() => { setTab('register'); setError(''); }}
            >Sign Up</button>
          </div>

          <h2 className="lp-title">
            {tab === 'login' ? 'Welcome Back 👋' : 'Create Account 🚀'}
          </h2>
          <p className="lp-desc">
            {tab === 'login' ? 'Sign in to your AI dashboard' : 'Join thousands of retailers'}
          </p>

          <div className="lp-field">
            <label>Username</label>
            <div className="lp-input-wrap">
              <span className="lp-ic">👤</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
            </div>
          </div>

          <div className="lp-field">
            <label>Password</label>
            <div className="lp-input-wrap">
              <span className="lp-ic">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && submit()}
              />
              <button className="lp-eye" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="lp-err">⚠️ {error}</div>}

          <button
            className={`lp-btn${loading ? ' lp-loading' : ''}`}
            onClick={submit}
            disabled={loading}
          >
            {loading
              ? <><span className="lp-spin"/> Authenticating...</>
              : tab === 'login' ? '✨ Sign In' : '🚀 Create Account'
            }
          </button>

          <div className="lp-or"><span>or continue with</span></div>

          <div className="lp-oauth">
            <button className="lp-oauth-btn">🌐 Google</button>
            <button className="lp-oauth-btn">🐙 GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}