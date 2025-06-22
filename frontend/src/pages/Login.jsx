import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import './Login.css'; // 👉 Link your CSS

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role) {
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        case 'Trainer':
          navigate('/trainer-dashboard');
          break;
        case 'WQC':
          navigate('/wqc-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed 😓');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🔐 Welcome Back</h2>
        <p>Login to your dashboard and keep the water flowing 💧</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="email"
            type="email"
            placeholder="📧 Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="🔑 Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn pop">Login 🚀</button>
        </form>
      </div>
    </div>
  );
}
