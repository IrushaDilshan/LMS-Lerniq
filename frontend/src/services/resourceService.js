import axios from 'axios';

// ── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Resource API ──────────────────────────────────────────────────────────────

/**
 * Fetch paginated / filtered resources.
 * @param {Object} params - type, status, location, minCapacity, keyword, page, size, sort
 */
export const getResources = async (params = {}) => {
  const response = await api.get('/resources', { params });
  return response.data.data; // unwrap ApiResponse wrapper
};

/**
 * Fetch a single resource by ID.
 */
export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data.data;
};

/**
 * Create a new resource (ADMIN only).
 */
export const createResource = async (data) => {
  const response = await api.post('/resources', data);
  return response.data.data;
};

/**
 * Update a resource (PUT - ADMIN only).
 */
export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data.data;
};

/**
 * Patch only the status of a resource (ADMIN only).
 */
export const updateResourceStatus = async (id, status) => {
  const response = await api.patch(`/resources/${id}/status`, { status });
  return response.data.data;
};

/**
 * Delete a resource (ADMIN only).
 */
export const deleteResource = async (id) => {
  await api.delete(`/resources/${id}`);
};

/**
 * Get resource stats for admin dashboard.
 */
export const getResourceStats = async () => {
  const response = await api.get('/resources/stats');
  return response.data.data;
};

export default api;
