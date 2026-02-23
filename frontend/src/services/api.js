import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

axios.defaults.baseURL = API_URL;

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await axios.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get("/auth/profile");
    return response.data;
  },
};

// Resources API
export const resourceAPI = {
  // Sab listings
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`/resources?${params}`);
    return response.data;
  },

  // Single listing
  getById: async (id) => {
    const response = await axios.get(`/resources/${id}`);
    return response.data;
  },

  // ✅ Sirf meri listings — Dashboard fix
  getMyListings: async () => {
    const response = await axios.get("/resources/my-listings");
    return response.data;
  },

  // Naya listing banao
  create: async (resourceData) => {
    const response = await axios.post("/resources", resourceData);
    return response.data;
  },

  // Update listing
  update: async (id, resourceData) => {
    const response = await axios.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  // Delete listing
  delete: async (id) => {
    const response = await axios.delete(`/resources/${id}`);
    return response.data;
  },

  // ✅ Image upload — Cloudinary
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post("/resources/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Review add karo
  addReview: async (id, reviewData) => {
    const response = await axios.post(`/resources/${id}/reviews`, reviewData);
    return response.data;
  },

  // Review delete karo
  deleteReview: async (resourceId, reviewId) => {
    const response = await axios.delete(
      `/resources/${resourceId}/reviews/${reviewId}`
    );
    return response.data;
  },
};

export default { authAPI, resourceAPI };
