import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/login"); // redirect to login after successful registration
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit" className="auth-btn">
          Register
        </button>
      </form>

      <p className="auth-text">
        Already have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterPage;