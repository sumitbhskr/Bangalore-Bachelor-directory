import { Link } from "react-router-dom";
import { FaWhatsapp, FaPhone, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import "../styles/ResourceCard.css";

function ResourceCard({ resource }) {
  const getWhatsAppLink = () => {
    const number = resource.whatsappNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hi! I'm interested in your ${resource.type} - ${resource.name}`,
    );
    return `https://wa.me/91${number}?text=${message}`;
  };

  const getGoogleMapsLink = () => {
    return (
      resource.googleMapsLink ||
      `https://www.google.com/maps/search/${resource.area}+${resource.subArea}`
    );
  };

  return (
    <div className="resource-card">
      {resource.featured && <span className="badge-featured">Featured</span>}
      {resource.verified && <span className="badge-verified">✓ Verified</span>}

      <div className="card-header">
        <h3>{resource.name}</h3>
        <div className="rating">
          <FaStar /> {resource.rating || 0} ({resource.numReviews || 0})
        </div>
      </div>

      <div className="card-body">
        <div className="card-info">
          <span className="type-badge">{resource.type.toUpperCase()}</span>
          <span className="category">{resource.category}</span>
        </div>

        <p className="location">
          <FaMapMarkerAlt /> {resource.area}, {resource.subArea}
        </p>

        <p className="description">
          {resource.description.substring(0, 100)}...
        </p>

        <div className="price">₹{resource.price.toLocaleString()}/month</div>

        <div className="amenities">
          {resource.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-tag">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <FaWhatsapp /> WhatsApp
        </a>

        <a href={`tel:${resource.contact}`} className="btn-call">
          <FaPhone /> Call
        </a>

        <a
          href={getGoogleMapsLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-maps"
        >
          <FaMapMarkerAlt /> Maps
        </a>

        <Link to={`/resource/${resource._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ResourceCard;
