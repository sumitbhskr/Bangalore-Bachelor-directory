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

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";

      // Step 1: Upload image if selected
      if (imageFile) {
        setUploadProgress("Uploading image...");
        const uploadRes = await resourceAPI.uploadImage(imageFile);
        imageUrl = uploadRes.imageUrl;
        setUploadProgress("Image uploaded! Creating listing...");
      } else {
        setUploadProgress("Creating listing...");
      }

      // Step 2: Create resource
      const data = {
        ...formData,
        price: Number(formData.price),
        images: imageUrl ? [imageUrl] : [],
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
      setUploadProgress("");
    }
  };

  return (
    <div className="add-listing-page">
      <div className="container">
        <h1>Add New Listing</h1>
        {error && <div className="error">{error}</div>}
        {uploadProgress && (
          <div className="upload-progress">{uploadProgress}</div>
        )}

        <form onSubmit={handleSubmit} className="listing-form">
          {/* Type */}
          <div className="form-group">
            <label>Type *</label>
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

          {/* Name */}
          <div className="form-group">
            <label>Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Sunshine PG for Gents"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category *</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g. Men's PG, Vegetarian Tiffin"
            />
          </div>

          {/* Area + SubArea */}
          <div className="form-row">
            <div className="form-group">
              <label>Area *</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              >
                <option value="">Select Area</option>
                <option value="HSR Layout">HSR Layout</option>
                <option value="BTM Layout">BTM Layout</option>
                <option value="Koramangala">Koramangala</option>
                <option value="Whitefield">Whitefield</option>
                <option value="Marathahalli">Marathahalli</option>
                <option value="Electronic City">Electronic City</option>
                <option value="Indiranagar">Indiranagar</option>
                <option value="Bellandur">Bellandur</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sub Area</label>
              <input
                name="subArea"
                value={formData.subArea}
                onChange={handleChange}
                placeholder="e.g. Sector 1, 5th Block"
              />
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price (₹/month) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g. 8500"
            />
          </div>

          {/* Contact + WhatsApp */}
          <div className="form-row">
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="9876543210"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp Number *</label>
              <input
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Food Type */}
          <div className="form-group">
            <label>Food Type *</label>
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

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your listing — amenities, rules, nearby landmarks..."
            />
            <small>{formData.description.length}/1000</small>
          </div>

          {/* Amenities */}
          <div className="form-group">
            <label>Amenities (comma-separated)</label>
            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, AC, Meals, Laundry, Parking"
            />
          </div>

          {/* ── Image Upload ───────────────────────────────── */}
          <div className="form-group">
            <label>Listing Photo (Max 5MB)</label>

            {!imagePreview ? (
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  id="image-input"
                  style={{ display: "none" }}
                />
                <label htmlFor="image-input" className="image-upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload photo</span>
                  <span className="upload-hint">JPG, PNG, WebP — Max 5MB</span>
                </label>
              </div>
            ) : (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn-remove-image"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? uploadProgress || "Creating..." : "🚀 Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddListingPage;
