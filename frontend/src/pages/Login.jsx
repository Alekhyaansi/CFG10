import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        // localStorage.setItem("token", data.token); // optional
      } else {
        setIsError(true);
        setMessage(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("An error occurred.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
        {message && <p style={{ color: isError ? "red" : "green", textAlign: "center" }}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#1976d2",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  link: {
    marginTop: "15px",
    textAlign: "center",
  },
};

export default Login;
