import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import './Register.css'; // Add this CSS file

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', password: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed 😥');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>🚀 Join the Saaf Pani Movement</h2>
        <p>Become a Saathi and help your community get safe water!</p>
        <form onSubmit={handleSubmit} className="register-form">
          <input name="name" placeholder="👤 Full Name" onChange={handleChange} required />
          <input name="email" placeholder="📧 Email" type="email" onChange={handleChange} required />
          <input name="phone" placeholder="📱 Phone (optional)" onChange={handleChange} />
          <input name="location" placeholder="📍 Your Location" onChange={handleChange} required />
          <input name="password" type="password" placeholder="🔐 Password" onChange={handleChange} required />
          <button type="submit" className="btn pop">Register Now 💧</button>
        </form>
      </div>
    </div>
  );
}
