import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { resourceAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchMyListings();
  }, [isAuthenticated]);

  const fetchMyListings = async () => {
    try {
      const { data } = await resourceAPI.getAll();
      setMyListings(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await resourceAPI.delete(id);
        fetchMyListings();
      } catch (error) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="dashboard-page" style={{ padding: "2rem" }}>
      <div className="container">
        <h1>My Dashboard</h1>
        <p>Welcome, {user?.name}!</p>

        <h2>My Listings ({myListings.length})</h2>
        <div className="listings-list">
          {myListings.map((listing) => (
            <div
              key={listing._id}
              className="listing-item"
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <h3>{listing.name}</h3>
              <p>
                {listing.area} - ₹{listing.price}
              </p>
              <p>
                Views: {listing.views} | Rating: {listing.rating}
              </p>
              <button
                onClick={() => handleDelete(listing._id)}
                style={{
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
