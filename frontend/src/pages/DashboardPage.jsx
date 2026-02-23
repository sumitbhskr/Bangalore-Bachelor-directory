// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { resourceAPI } from "../services/api";
// import { useNavigate, Link } from "react-router-dom";
// import "../styles/DashboardPage.css";

// function DashboardPage() {
//   const { user, isAuthenticated } = useAuth();
//   const [myListings, setMyListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [deleteId, setDeleteId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//       return;
//     }
//     fetchMyListings();
//   }, [isAuthenticated]);

//   // FIXED: getMyListings instead of getAll ✅
//   const fetchMyListings = async () => {
//     try {
//       setLoading(true);
//       const response = await resourceAPI.getMyListings();
//       setMyListings(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this listing?"))
//       return;
//     try {
//       setDeleteId(id);
//       await resourceAPI.delete(id);
//       setMyListings((prev) => prev.filter((l) => l._id !== id));
//     } catch (error) {
//       alert("Failed to delete listing");
//     } finally {
//       setDeleteId(null);
//     }
//   };

//   const getTypeEmoji = (type) => {
//     if (type === "pg") return "🏠";
//     if (type === "tiffin") return "🍱";
//     if (type === "cook") return "👨‍🍳";
//     return "📋";
//   };

//   const getStatusColor = (status) => {
//     if (status === "active") return "#00b894";
//     if (status === "pending") return "#fdcb6e";
//     return "#d63031";
//   };

//   return (
//     <div className="dashboard-page">
//       <div className="container">
//         {/* Header */}
//         <div className="dashboard-header">
//           <div>
//             <h1>My Dashboard</h1>
//             <p className="welcome-text">
//               Welcome back, <strong>{user?.name}</strong>!
//             </p>
//           </div>
//           <Link to="/add-listing" className="btn-add-new">
//             + Add New Listing
//           </Link>
//         </div>

//         {/* Stats Bar */}
//         <div className="stats-bar">
//           <div className="stat-item">
//             <span className="stat-number">{myListings.length}</span>
//             <span className="stat-label">My Listings</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-number">
//               {myListings.filter((l) => l.status === "active").length}
//             </span>
//             <span className="stat-label">Active</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-number">
//               {myListings.reduce((sum, l) => sum + (l.views || 0), 0)}
//             </span>
//             <span className="stat-label">Total Views</span>
//           </div>
//           <div className="stat-item">
//             <span className="stat-number">
//               {myListings.reduce((sum, l) => sum + (l.numReviews || 0), 0)}
//             </span>
//             <span className="stat-label">Total Reviews</span>
//           </div>
//         </div>

//         {/* Listings */}
//         <h2 className="section-title">My Listings ({myListings.length})</h2>

//         {loading ? (
//           <div className="loading-state">Loading your listings...</div>
//         ) : myListings.length === 0 ? (
//           <div className="empty-state">
//             <p>🏠 You haven't posted any listings yet.</p>
//             <Link to="/add-listing" className="btn-add-new">
//               Post Your First Listing
//             </Link>
//           </div>
//         ) : (
//           <div className="listings-grid">
//             {myListings.map((listing) => (
//               <div key={listing._id} className="listing-card">
//                 {/* Image */}
//                 {listing.images?.[0] ? (
//                   <img
//                     src={listing.images[0]}
//                     alt={listing.name}
//                     className="listing-image"
//                   />
//                 ) : (
//                   <div className="listing-image-placeholder">
//                     {getTypeEmoji(listing.type)}
//                   </div>
//                 )}

//                 <div className="listing-body">
//                   {/* Title + Status */}
//                   <div className="listing-top">
//                     <h3>{listing.name}</h3>
//                     <span
//                       className="status-badge"
//                       style={{
//                         backgroundColor: getStatusColor(listing.status),
//                       }}
//                     >
//                       {listing.status}
//                     </span>
//                   </div>

//                   {/* Info */}
//                   <p className="listing-area">
//                     📍 {listing.area}
//                     {listing.subArea ? `, ${listing.subArea}` : ""}
//                   </p>
//                   <p className="listing-price">
//                     ₹{listing.price?.toLocaleString()}/month
//                   </p>

//                   {/* Metrics */}
//                   <div className="listing-metrics">
//                     <span>👁 {listing.views || 0} views</span>
//                     <span>
//                       ⭐ {listing.rating || 0} ({listing.numReviews || 0})
//                     </span>
//                     <span>
//                       {listing.featured ? "🏆 Featured" : ""}
//                       {listing.verified ? "✓ Verified" : ""}
//                     </span>
//                   </div>

//                   {/* Actions */}
//                   <div className="listing-actions">
//                     <Link
//                       to={`/resource/${listing._id}`}
//                       className="btn-view-listing"
//                     >
//                       View
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(listing._id)}
//                       className="btn-delete-listing"
//                       disabled={deleteId === listing._id}
//                     >
//                       {deleteId === listing._id ? "Deleting..." : "Delete"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default DashboardPage;

//////

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { resourceAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const { data } = await resourceAPI.getAll();
      // Filter to show only user's listings
      const userListings = data.filter(
        (resource) =>
          resource.createdBy?._id === user?._id ||
          resource.createdBy === user?._id,
      );
      setMyListings(userListings);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;

    try {
      await resourceAPI.delete(id);
      setMyListings((prev) => prev.filter((l) => l._id !== id));
      alert("Listing deleted successfully!");
    } catch (error) {
      alert("Failed to delete listing");
    }
  };

  const getTypeEmoji = (type) => {
    if (type === "pg") return "🏠";
    if (type === "tiffin") return "🍱";
    if (type === "cook") return "👨‍🍳";
    return "📋";
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p className="welcome-text">
              Welcome back, <strong>{user?.name}</strong>!
            </p>
          </div>
          <Link to="/add-listing" className="btn-add-new">
            + Add New Listing
          </Link>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{myListings.length}</span>
            <span className="stat-label">My Listings</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {myListings.filter((l) => l.status === "active").length}
            </span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {myListings.reduce((sum, l) => sum + (l.views || 0), 0)}
            </span>
            <span className="stat-label">Total Views</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {myListings.reduce((sum, l) => sum + (l.numReviews || 0), 0)}
            </span>
            <span className="stat-label">Total Reviews</span>
          </div>
        </div>

        <h2 className="section-title">My Listings ({myListings.length})</h2>

        {loading ? (
          <div className="loading-state">Loading your listings...</div>
        ) : myListings.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>You haven't posted any listings yet.</p>
            <Link to="/add-listing" className="btn-add-listing">
              Post Your First Listing
            </Link>
          </div>
        ) : (
          <div className="listings-list">
            {myListings.map((listing) => (
              <div key={listing._id} className="listing-item">
                <div className="listing-header">
                  <h3>
                    {getTypeEmoji(listing.type)} {listing.name}
                  </h3>
                  <span className={`status-badge status-${listing.status}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="listing-info">
                  <p className="listing-location">
                    📍 {listing.area}
                    {listing.subArea ? `, ${listing.subArea}` : ""}
                  </p>
                  <p className="listing-price">
                    💰 ₹{listing.price?.toLocaleString()}/month
                  </p>
                </div>

                <div className="listing-stats">
                  <span>👁 {listing.views || 0} views</span>
                  <span>
                    ⭐ {listing.rating || 0} ({listing.numReviews || 0} reviews)
                  </span>
                  {listing.featured && (
                    <span className="badge-featured">🏆 Featured</span>
                  )}
                  {listing.verified && (
                    <span className="badge-verified">✓ Verified</span>
                  )}
                </div>

                <div className="listing-actions">
                  <Link to={`/resource/${listing._id}`} className="btn-view">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
