import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom'; 

const Home = () => {
  return (
    <div className="home-container">

      {/* 🌊 Hero */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>💧 Saathi</h1>
          <p>A Guided Force for Empowering slums & communities with clean, safe water. Be the change 💪</p>
          <div className="hero-buttons">
            <Link to="/register"><button className="btn pop">🚀 Get Started</button></Link>
            <Link to="/login"><button className="btn-outline">🤝 Already a member?Learn more</button></Link>
          </div>
        </div>
      </section>

      {/* 🔥 What We Do */}
      <section className="features">
        <h2>💡 What We Do</h2>
        <div className="feature-cards">
          {[
            { emoji: "💧", title: "Monitor", text: "Smart water sensors in real time." },
            { emoji: "📚", title: "Train", text: "Free courses + workshops." },
            { emoji: "🤝", title: "Saathi Network", text: "Community-led changemakers." },
            { emoji: "💬", title: "Support Groups", text: "Share, solve, support each other." }
          ].map((item, index) => (
            <div className="card pop-card" key={index}>
              <h3>{item.emoji} {item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 Training */}
      <section className="training pop-section">
        <h2>🎓 Upskill & Empower</h2>
        <p>Get certified, spread knowledge & make water safer for everyone.</p>
        <button className="btn pop">📘 Explore Trainings</button>
      </section>

      {/* ✊ Saathi Shoutout */}
      <section className="saathi-section pop-section">
        <h2>🌟 Meet the Saathis</h2>
        <blockquote>
          “We protect our people by testing every drop.”<br />
          <footer>– Rani Devi, Delhi Slums</footer>
        </blockquote>
        <p>Over 500+ Saathis across 12 cities 💥</p>
        <button className="btn-outline">Become a Saathi ➜</button>
      </section>

      {/* 💬 Support Groups */}
      <section className="support pop-section">
        <h2>💬 Support Circles</h2>
        <p>Join local groups. Share real stories. Get expert water advice.</p>
        <button className="btn">👥 Join a Group</button>
      </section>

      {/* 📊 Impact */}
      <section className="impact pop-section">
        <h2>📈 Our Impact</h2>
        <div className="impact-stats">
          <div className="impact-card">
            <strong>12,54,000+</strong>
            <p>Liters of Clean Water Delivered</p>
          </div>
          <div className="impact-card">
            <strong>524</strong>
            <p>Active Saathis</p>
          </div>
          <div className="impact-card">
            <strong>43</strong>
            <p>Slum Clusters Covered</p>
          </div>
        </div>
      </section>

      {/* 🎤 Testimonials */}
      <section className="testimonials pop-section">
        <h2>💬 Real Voices</h2>
        <div className="testimonial pop-card">
          <p>“We stopped 100L of daily water waste. Game changer!”</p>
          <span>– Aamir, Mumbai</span>
        </div>
        <div className="testimonial pop-card">
          <p>“Training got me a job. Real impact.”</p>
          <span>– Kavita, Delhi</span>
        </div>
      </section>

      {/* 📱 Connect */}
      <section className="connect pop-section">
        <h2>📲 Stay Connected</h2>
        <p>Join us on WhatsApp, Insta, and Telegram.</p>
        <div className="social-links">
          <a href="#">📸 Instagram</a>
          <a href="#">💬 WhatsApp</a>
          <a href="#">📢 Telegram</a>
        </div>
        <button className="btn pop">⬇️ Download App</button>
      </section>

      {/* ⚙️ Footer */}
      <footer className="footer">
        <p>© 2025 WaterWise • Built with 💙 for Clean India</p>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Donate</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
