import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { resourceAPI } from "../services/api";
import ResourceCard from "../components/ResourceCard";
import "../styles/BrowsePage.css";

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, [filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      const { data } = await resourceAPI.getAll(cleanFilters);
      setResources(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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

        <div className="results-count">
          {loading ? "Loading..." : `${resources.length} results found`}
        </div>

        <div className="resources-grid">
          {loading ? (
            <p>Loading resources...</p>
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
      </div>
    </div>
  );
}

export default BrowsePage;
