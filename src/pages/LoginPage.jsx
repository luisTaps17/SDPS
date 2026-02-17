import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }
    if (username === "admin" && password === "admin123") {
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(); }, 1000);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">💧</div>
          <div>
            <div className="login-logo-name">Smart Drainage Protection System</div>
            <div className="login-logo-sub">Admin Portal</div>
          </div>
        </div>

        <div className="login-heading">Welcome back</div>
        <div className="login-sub">Sign in with your admin credentials</div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button className="btn-login" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="login-hint">Demo credentials: admin / admin123</div>
      </div>
    </div>
  );
}
