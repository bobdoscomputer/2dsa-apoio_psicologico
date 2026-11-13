import axios from 'axios';
import { appParams } from '@/lib/app-params';

const { appBaseUrl } = appParams || {};

const baseURL = import.meta.env.VITE_API_BASE_URL || appBaseUrl || '/api';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const appClient = {
  client,
  auth: {
    me: async () => {
      try {
        const res = await client.get('/auth/me');
        return res.data;
      } catch (err) {
        return Promise.reject(err);
      }
    },
    loginViaEmailPassword: async (email, password) => {
      const res = await client.post('/auth/login', { email, password });
      return res.data;
    },
    loginWithProvider: (provider, redirectUrl) => {
      // For local dev, redirect to a provider login route if configured
      if (typeof window !== 'undefined') {
        window.location.href = `/auth/${provider}?returnTo=${encodeURIComponent(redirectUrl || window.location.href)}`;
      }
    },
    register: async (data) => {
      const res = await client.post('/auth/register', data);
      return res.data;
    },
    verifyOtp: async ({ email, otpCode }) => {
      const res = await client.post('/auth/verify-otp', { email, otp: otpCode });
      return res.data;
    },
    setToken: (token) => {
      try { localStorage.setItem('app_access_token', token); } catch (e) {}
      if (token) client.defaults.headers.Authorization = `Bearer ${token}`;
    },
    resendOtp: async (email) => {
      const res = await client.post('/auth/resend-otp', { email });
      return res.data;
    },
    resetPasswordRequest: async (email) => {
      const res = await client.post('/auth/reset-request', { email });
      return res.data;
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      const res = await client.post('/auth/reset-password', { resetToken, newPassword });
      return res.data;
    },
    logout: (redirectTo) => {
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('app_access_token'); } catch (e) {}
        if (redirectTo) window.location.href = redirectTo;
      }
    },
    redirectToLogin: (returnTo) => {
      if (typeof window !== 'undefined') {
        const redirectUrl = `/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`;
        window.location.href = redirectUrl;
      }
    }
  }
};

// Lightweight entities helper to mimic SDK behaviour for local dev.
const makeEntity = (name) => ({
  list: async (sort = null, limit = null) => {
    const params = {};
    if (sort) params.sort = sort;
    if (limit) params.limit = limit;
    const res = await client.get(`/entities/${name}`, { params });
    return res.data;
  },
  filter: async (filters = {}, sort = null, limit = null) => {
    const params = { ...filters };
    if (sort) params.sort = sort;
    if (limit) params.limit = limit;
    const res = await client.get(`/entities/${name}`, { params });
    return res.data;
  },
  create: async (data) => {
    const res = await client.post(`/entities/${name}`, data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await client.patch(`/entities/${name}/${id}`, data);
    return res.data;
  }
});

appClient.entities = new Proxy({}, {
  get: (_, prop) => makeEntity(prop)
});

appClient.integrations = {
  Core: {
    UploadFile: async ({ file }) => {
      if (!file) return { file_url: null };
      // Try to POST to a conventional upload endpoint, fallback to object URL
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await client.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data;
      } catch (e) {
        if (typeof window !== 'undefined' && window.URL && file instanceof Blob) {
          return { file_url: window.URL.createObjectURL(file) };
        }
        return Promise.reject(e);
      }
    }
  }
};

export const app = appClient;
export default appClient;
