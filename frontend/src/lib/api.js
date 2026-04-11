import { useAuthStore } from '../store/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const request = async (url, options = {}) => {
  const authStore = useAuthStore.getState();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authStore.getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || error.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  register: (data) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  refreshToken: (refreshToken) => request('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }),
};

export const eventsAPI = {
  getAll: () => request('/events'),

  getById: (id) => request(`/events/${id}`),

  create: (data) => request('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => request(`/events/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  delete: (id) => request(`/events/${id}`, {
    method: 'DELETE',
  }),
};

export const registrationAPI = {
  register: (userId, eventId, orgId) => request('/register', {
    method: 'POST',
    body: JSON.stringify({ userId, eventId, orgId }),
  }),

  getUserRegistrations: (userId) => request(`/register/user/${userId}`),

  getEventRegistrations: (eventId) => request(`/register/event/${eventId}`),

  cancelRegistration: (registrationId) => request(`/register/${registrationId}/cancel`, {
    method: 'PATCH',
  }),
};

export const usersAPI = {
  getProfile: (userId) => request(`/users/${userId}`),

  updateProfile: (userId, data) => request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};
