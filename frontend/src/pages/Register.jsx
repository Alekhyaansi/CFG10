import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authContext"; // or ../services/authService if renamed

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    role: "", // Can be "WQC", "Trainer", etc.
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(formData);
      console.log("✅ Registered:", response.data);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="WQC">WQC</option>
          <option value="Trainer">Trainer</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">Register</button>

        <p>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
