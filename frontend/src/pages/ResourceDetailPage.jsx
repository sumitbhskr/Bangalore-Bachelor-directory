// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { resourceAPI } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";
// import "../styles/ResourceDetailPage.css";

// function ResourceDetailPage() {
//   const { id } = useParams();
//   const { isAuthenticated } = useAuth();
//   const [resource, setResource] = useState(null);
//   const [review, setReview] = useState({ rating: 5, comment: "" });

//   useEffect(() => {
//     fetchResource();
//   }, [id]);

//   const fetchResource = async () => {
//     try {
//       const { data } = await resourceAPI.getById(id);
//       setResource(data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await resourceAPI.addReview(id, review);
//       alert("Review added!");
//       setReview({ rating: 5, comment: "" });
//       fetchResource();
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add review");
//     }
//   };

//   if (!resource) return <div className="loading-state">Loading...</div>;

//   const getWhatsAppLink = () => {
//     const number = resource.whatsappNumber.replace(/\D/g, "");
//     const message = encodeURIComponent(
//       `Hi! I'm interested in your ${resource.type} - ${resource.name}`,
//     );
//     return `https://wa.me/91${number}?text=${message}`;
//   };

//   return (
//     <div className="resource-detail-page">
//       <div className="container">
//         <div className="detail-container">
//           <div className="detail-header">
//             <h1>{resource.name}</h1>
//             <div className="rating-display">
//               <FaStar /> {resource.rating} ({resource.numReviews} reviews)
//             </div>
//             <p className="location-display">
//               <FaMapMarkerAlt /> {resource.area}, {resource.subArea}
//             </p>
//             <div className="price-display">₹{resource.price}/month</div>

//             <div className="action-buttons">
//               <a
//                 href={getWhatsAppLink()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="action-button btn-whatsapp"
//               >
//                 <FaWhatsapp /> WhatsApp
//               </a>
//               <a
//                 href={`tel:${resource.contact}`}
//                 className="action-button btn-call"
//               >
//                 <FaPhone /> Call
//               </a>
//             </div>
//           </div>

//           <div className="detail-body">
//             <div className="detail-section">
//               <h3>Description</h3>
//               <p>{resource.description}</p>
//             </div>

//             <div className="detail-section">
//               <h3>Amenities</h3>
//               <div className="amenities-list">
//                 {resource.amenities?.map((a, i) => (
//                   <span key={i} className="amenity-item">
//                     {a}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="detail-section reviews-section">
//               <h3>Reviews ({resource.reviews?.length || 0})</h3>
//               {resource.reviews?.map((r) => (
//                 <div key={r._id} className="review-item">
//                   <div className="review-header">
//                     <strong className="review-author">{r.userName}</strong>
//                     <div className="review-rating">
//                       {r.rating} <FaStar />
//                     </div>
//                   </div>
//                   <p className="review-comment">{r.comment}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {isAuthenticated && (
//           <form onSubmit={handleReviewSubmit} className="review-form">
//             <h3>Add Your Review</h3>
//             <div className="form-group">
//               <label>Rating</label>
//               <select
//                 value={review.rating}
//                 onChange={(e) =>
//                   setReview({ ...review, rating: Number(e.target.value) })
//                 }
//               >
//                 {[1, 2, 3, 4, 5].map((n) => (
//                   <option key={n} value={n}>
//                     {n} Stars
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label>Your Review</label>
//               <textarea
//                 placeholder="Write your review..."
//                 value={review.comment}
//                 onChange={(e) =>
//                   setReview({ ...review, comment: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <button type="submit" className="submit-review-btn">
//               Submit Review
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ResourceDetailPage;

/////
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { resourceAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import "../styles/ResourceDetailPage.css";

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

  if (!resource) return <div className="loading-state">Loading...</div>;

  const getWhatsAppLink = () => {
    const number = resource.whatsappNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${resource.type} - ${resource.name}`,
    );
    return `https://wa.me/91${number}?text=${message}`;
  };

  return (
    <div className="resource-detail-page">
      <div className="container">
        <div className="detail-container">
          <div className="detail-header">
            <h1>{resource.name}</h1>

            {/* ✅ FIX 1: Header me average rating ke filled stars */}
            <div className="rating-display">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(resource.rating)
                      ? "star-filled"
                      : "star-empty"
                  }
                />
              ))}
              <span className="rating-text">
                {resource.rating} ({resource.numReviews} reviews)
              </span>
            </div>

            <p className="location-display">
              <FaMapMarkerAlt /> {resource.area}, {resource.subArea}
            </p>
            <div className="price-display">₹{resource.price}/month</div>

            <div className="action-buttons">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="action-button btn-whatsapp"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`tel:${resource.contact}`}
                className="action-button btn-call"
              >
                <FaPhone /> Call
              </a>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-section">
              <h3>Description</h3>
              <p>{resource.description}</p>
            </div>

            <div className="detail-section">
              <h3>Amenities</h3>
              <div className="amenities-list">
                {resource.amenities?.map((a, i) => (
                  <span key={i} className="amenity-item">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section reviews-section">
              <h3>Reviews ({resource.reviews?.length || 0})</h3>
              {resource.reviews?.length === 0 && (
                <p className="no-reviews">
                  Abhi tak koi review nahi hai. Pehle review do!
                </p>
              )}
              {resource.reviews?.map((r) => (
                <div key={r._id} className="review-item">
                  <div className="review-header">
                    <strong className="review-author">{r.userName}</strong>
                    {/* ✅ FIX 2: Review cards me filled stars (number nahi) */}
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < r.rating ? "star-filled" : "star-empty"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Add Your Review</h3>
            <div className="form-group">
              <label>Rating</label>
              {/* ✅ FIX 3: Select dropdown ki jagah clickable stars */}
              <div className="star-select">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    className={
                      n <= review.rating ? "star-filled" : "star-empty"
                    }
                    onClick={() => setReview({ ...review, rating: n })}
                  />
                ))}
                <span className="rating-label">{review.rating} / 5</span>
              </div>
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea
                placeholder="Write your review..."
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                required
              />
            </div>
            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResourceDetailPage;
