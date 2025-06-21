import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    role: "WQC",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful!");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setIsError(true);
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setIsError(true);
      setMessage("An error occurred.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={styles.input} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={styles.input} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required style={styles.input} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={styles.input} />
          <select name="role" value={form.role} onChange={handleChange} style={styles.input}>
            <option value="WQC">WQC</option>
            <option value="Admin">Admin</option>
            <option value="Trainee">Trainee</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
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

export default Register;
