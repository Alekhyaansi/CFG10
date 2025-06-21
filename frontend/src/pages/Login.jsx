// src/pages/Login.jsx
import { useState } from 'react';
import { loginUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(formData);
    const { token, user } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // ✅ Navigate based on role
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
        navigate('/dashboard'); // fallback route
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}
