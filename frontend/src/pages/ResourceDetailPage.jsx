import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { resourceAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";

function ResourceDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [resource, setResource] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const { data } = await resourceAPI.getById(id);
      setResource(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await resourceAPI.addReview(id, review);
      alert("Review added!");
      setReview({ rating: 5, comment: "" });
      fetchResource();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review");
    }
  };

  if (!resource) return <div style={{ padding: "2rem" }}>Loading...</div>;

  const getWhatsAppLink = () => {
    const number = resource.whatsappNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${resource.type} - ${resource.name}`,
    );
    return `https://wa.me/91${number}?text=${message}`;
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div className="container">
        <h1>{resource.name}</h1>
        <p>
          <FaStar /> {resource.rating} ({resource.numReviews} reviews)
        </p>
        <p>
          {resource.area}, {resource.subArea}
        </p>
        <h2>₹{resource.price}/month</h2>

        <div style={{ marginBottom: "2rem" }}>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            style={{
              background: "#25D366",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              marginRight: "1rem",
              display: "inline-block",
            }}
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href={`tel:${resource.contact}`}
            style={{
              background: "#007bff",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            <FaPhone /> Call
          </a>
        </div>

        <h3>Description</h3>
        <p>{resource.description}</p>

        <h3>Amenities</h3>
        <div>
          {resource.amenities?.map((a, i) => (
            <span
              key={i}
              style={{
                background: "#f0f0f0",
                padding: "0.5rem 1rem",
                margin: "0.25rem",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              {a}
            </span>
          ))}
        </div>

        <h3>Reviews ({resource.reviews?.length || 0})</h3>
        {resource.reviews?.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ddd",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <strong>{r.userName}</strong> - {r.rating} <FaStar />
            <p>{r.comment}</p>
          </div>
        ))}

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} style={{ marginTop: "2rem" }}>
            <h3>Add Review</h3>
            <div>
              <label>Rating: </label>
              <select
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: Number(e.target.value) })
                }
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Stars
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <textarea
                placeholder="Write your review..."
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                required
                style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: "#007bff",
                color: "white",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResourceDetailPage;
