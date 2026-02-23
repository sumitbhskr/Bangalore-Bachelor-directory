// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { resourceAPI } from "../services/api";
// import ResourceCard from "../components/ResourceCard";
// import "../styles/BrowsePage.css";

// function BrowsePage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     type: searchParams.get("type") || "",
//     area: "",
//     search: "",
//     minPrice: "",
//     maxPrice: "",
//     foodType: "",
//   });

//   useEffect(() => {
//     fetchResources();
//   }, [filters]);

//   const fetchResources = async () => {
//     try {
//       setLoading(true);
//       const cleanFilters = Object.fromEntries(
//         Object.entries(filters).filter(([_, v]) => v !== ""),
//       );
//       const { data } = await resourceAPI.getAll(cleanFilters);
//       setResources(data);
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const resetFilters = () => {
//     setFilters({
//       type: "",
//       area: "",
//       search: "",
//       minPrice: "",
//       maxPrice: "",
//       foodType: "",
//     });
//   };

//   return (
//     <div className="browse-page">
//       <div className="container">
//         <h1>Browse Listings</h1>

//         <div className="filters">
//           <input
//             type="text"
//             name="search"
//             placeholder="Search..."
//             value={filters.search}
//             onChange={handleFilterChange}
//           />

//           <select
//             name="type"
//             value={filters.type}
//             onChange={handleFilterChange}
//           >
//             <option value="">All Types</option>
//             <option value="pg">PG</option>
//             <option value="tiffin">Tiffin Service</option>
//             <option value="cook">Cook</option>
//           </select>

//           <select
//             name="area"
//             value={filters.area}
//             onChange={handleFilterChange}
//           >
//             <option value="">All Areas</option>
//             <option value="HSR Layout">HSR Layout</option>
//             <option value="BTM Layout">BTM Layout</option>
//             <option value="Koramangala">Koramangala</option>
//             <option value="Whitefield">Whitefield</option>
//             <option value="Marathahalli">Marathahalli</option>
//             <option value="Electronic City">Electronic City</option>
//           </select>

//           <select
//             name="foodType"
//             value={filters.foodType}
//             onChange={handleFilterChange}
//           >
//             <option value="">All Food Types</option>
//             <option value="Vegetarian">Vegetarian</option>
//             <option value="Non-Vegetarian">Non-Vegetarian</option>
//             <option value="Both">Both</option>
//           </select>

//           <input
//             type="number"
//             name="minPrice"
//             placeholder="Min Price"
//             value={filters.minPrice}
//             onChange={handleFilterChange}
//           />

//           <input
//             type="number"
//             name="maxPrice"
//             placeholder="Max Price"
//             value={filters.maxPrice}
//             onChange={handleFilterChange}
//           />

//           <button onClick={resetFilters} className="btn-reset">
//             Reset Filters
//           </button>
//         </div>

//         <div className="results-count">
//           {loading ? "Loading..." : `${resources.length} results found`}
//         </div>

//         <div className="resources-grid">
//           {loading ? (
//             <p>Loading resources...</p>
//           ) : resources.length > 0 ? (
//             resources.map((resource) => (
//               <ResourceCard key={resource._id} resource={resource} />
//             ))
//           ) : (
//             <p className="no-results">
//               No resources found. Try different filters.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BrowsePage;

///////////
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { resourceAPI } from "../services/api";
import ResourceCard from "../components/ResourceCard";
import "../styles/BrowsePage.css";

function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    area: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    foodType: "",
  });

  useEffect(() => {
    fetchResources();
  }, [filters, currentPage]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      const response = await resourceAPI.getAll({
        ...cleanFilters,
        page: currentPage,
        limit: 9,
      });
      setResources(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      area: "",
      search: "",
      minPrice: "",
      maxPrice: "",
      foodType: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="browse-page">
      <div className="container">
        <h1>Browse Listings</h1>

        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="pg">PG</option>
            <option value="tiffin">Tiffin Service</option>
            <option value="cook">Cook</option>
          </select>
          <select
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
          >
            <option value="">All Areas</option>
            <option value="HSR Layout">HSR Layout</option>
            <option value="BTM Layout">BTM Layout</option>
            <option value="Koramangala">Koramangala</option>
            <option value="Whitefield">Whitefield</option>
            <option value="Marathahalli">Marathahalli</option>
            <option value="Electronic City">Electronic City</option>
          </select>
          <select
            name="foodType"
            value={filters.foodType}
            onChange={handleFilterChange}
          >
            <option value="">All Food Types</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Both">Both</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <button onClick={resetFilters} className="btn-reset">
            Reset Filters
          </button>
        </div>

        <div className="results-info">
          {loading ? (
            "Loading..."
          ) : (
            <span>
              <strong>{total}</strong> results found
              {totalPages > 1 && (
                <span>
                  {" "}
                  — Page <strong>{currentPage}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </span>
              )}
            </span>
          )}
        </div>

        <div className="resources-grid">
          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : resources.length > 0 ? (
            resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))
          ) : (
            <p className="no-results">
              No resources found. Try different filters.
            </p>
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              «
            </button>

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ‹ Prev
            </button>

            {getPageNumbers().map((num) => (
              <button
                key={num}
                className={`page-btn ${currentPage === num ? "active" : ""}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>

            <button
              className="page-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowsePage;
