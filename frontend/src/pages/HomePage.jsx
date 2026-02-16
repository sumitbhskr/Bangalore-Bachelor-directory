import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { resourceAPI } from "../services/api";
import "../styles/HomePage.css";

function HomePage() {
  const [stats, setStats] = useState({ pgs: 0, tiffins: 0, cooks: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await resourceAPI.getAll();
      setStats({
        pgs: data.filter((r) => r.type === "pg").length,
        tiffins: data.filter((r) => r.type === "tiffin").length,
        cooks: data.filter((r) => r.type === "cook").length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Find Your Perfect Place in Bangalore</h1>
          <p>Trusted PGs, Tiffin Services & Cooks for Bachelors</p>

          <div className="search-box">
            <Link to="/browse?type=pg" className="search-btn">
              🏠 Find PG
            </Link>
            <Link to="/browse?type=tiffin" className="search-btn">
              🍱 Find Tiffin
            </Link>
            <Link to="/browse?type=cook" className="search-btn">
              👨‍🍳 Find Cook
            </Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stat-card">
            <h2>{stats.pgs}+</h2>
            <p>PGs Listed</p>
          </div>
          <div className="stat-card">
            <h2>{stats.tiffins}+</h2>
            <p>Tiffin Services</p>
          </div>
          <div className="stat-card">
            <h2>{stats.cooks}+</h2>
            <p>Cooks Available</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="icon">✓</span>
              <h3>Verified Listings</h3>
              <p>All listings are verified and reviewed</p>
            </div>
            <div className="feature-card">
              <span className="icon">💬</span>
              <h3>Direct Contact</h3>
              <p>WhatsApp and call buttons for instant contact</p>
            </div>
            <div className="feature-card">
              <span className="icon">🗺️</span>
              <h3>Google Maps</h3>
              <p>Exact location and directions</p>
            </div>
            <div className="feature-card">
              <span className="icon">⭐</span>
              <h3>Reviews & Ratings</h3>
              <p>Real reviews from real people</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Have a PG, Tiffin Service, or Looking for Work as a Cook?</h2>
          <Link to="/add-listing" className="btn-cta">
            Add Your Listing For FREE
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
