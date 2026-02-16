// import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// // Set base URL
// axios.defaults.baseURL = API_URL;

// // Auth API
// export const authAPI = {
//   register: async (userData) => {
//     const response = await axios.post("/auth/register", userData);
//     return response.data;
//   },

//   login: async (credentials) => {
//     const response = await axios.post("/auth/login", credentials);
//     return response.data;
//   },

//   getProfile: async () => {
//     const response = await axios.get("/auth/profile");
//     return response.data;
//   },
// };

// // Resources API
// export const resourceAPI = {
//   getAll: async (filters = {}) => {
//     const params = new URLSearchParams(filters).toString();
//     const response = await axios.get(`/resources?${params}`);
//     return response.data;
//   },

//   getById: async (id) => {
//     const response = await axios.get(`/resources/${id}`);
//     return response.data;
//   },

//   create: async (resourceData) => {
//     const response = await axios.post("/resources", resourceData);
//     return response.data;
//   },

//   update: async (id, resourceData) => {
//     const response = await axios.put(`/resources/${id}`, resourceData);
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await axios.delete(`/resources/${id}`);
//     return response.data;
//   },

//   addReview: async (id, reviewData) => {
//     const response = await axios.post(`/resources/${id}/reviews`, reviewData);
//     return response.data;
//   },

//   deleteReview: async (resourceId, reviewId) => {
//     const response = await axios.delete(
//       `/resources/${resourceId}/reviews/${reviewId}`,
//     );
//     return response.data;
//   },
// };

// export default { authAPI, resourceAPI };

import axios from "axios";

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Set base URL
axios.defaults.baseURL = API_URL;

// Request interceptor for adding token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
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
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(`/resources?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/resources/${id}`);
    return response.data;
  },

  create: async (resourceData) => {
    const response = await axios.post("/resources", resourceData);
    return response.data;
  },

  update: async (id, resourceData) => {
    const response = await axios.put(`/resources/${id}`, resourceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`/resources/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await axios.post(`/resources/${id}/reviews`, reviewData);
    return response.data;
  },

  deleteReview: async (resourceId, reviewId) => {
    const response = await axios.delete(
      `/resources/${resourceId}/reviews/${reviewId}`,
    );
    return response.data;
  },
};

export default { authAPI, resourceAPI };
