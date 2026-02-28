import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/boards"); // redirect to boards page
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-btn">Login</button>
      </form>
      <p className="auth-text">
        Don't have an account? 
        <span className="auth-link" onClick={() => navigate("/register")}> Register</span>
      </p>
    </div>
  );
};

export default LoginPage;