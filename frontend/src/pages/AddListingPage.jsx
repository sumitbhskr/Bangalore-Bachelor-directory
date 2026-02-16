import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resourceAPI } from "../services/api";
import "../styles/AddListingPage.css";

function AddListingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "pg",
    category: "",
    area: "",
    subArea: "",
    price: "",
    contact: "",
    whatsappNumber: "",
    description: "",
    foodType: "Both",
    amenities: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        ...formData,
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
      };
      await resourceAPI.create(data);
      alert("Listing created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="add-listing-page">
      <div className="container">
        <h1>Add New Listing</h1>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="listing-form">
          <div className="form-group">
            <label>Type*</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="pg">PG</option>
              <option value="tiffin">Tiffin Service</option>
              <option value="cook">Cook</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name*</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category*</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Men's PG, Vegetarian Tiffin"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Area*</label>
              <input
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sub Area</label>
              <input
                name="subArea"
                value={formData.subArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Price (₹/month)*</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Number*</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>WhatsApp Number*</label>
              <input
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Food Type*</label>
            <select
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              required
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Amenities (comma-separated)</label>
            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, AC, Meals, Laundry"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddListingPage;
