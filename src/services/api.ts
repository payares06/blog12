const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Check if backend is available
let backendAvailable = true;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

const checkBackendHealth = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return backendAvailable;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    backendAvailable = response.ok;
    lastHealthCheck = now;
    return backendAvailable;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    backendAvailable = false;
    lastHealthCheck = now;
    return false;
  }
};

// API request helper with auth and fallback handling
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'API request failed');
    }

    backendAvailable = true;
    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Mark backend as unavailable on network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      backendAvailable = false;
    }
    
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const isHealthy = await checkBackendHealth();
    if (!isHealthy) {
      throw new Error('Backend no disponible. Por favor, inicia el servidor backend.');
    }

    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  login: async (email: string, password: string) => {
    const isHealthy = await checkBackendHealth();
    if (!isHealthy) {
      throw new Error('Backend no disponible. Por favor, inicia el servidor backend.');
    }

    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getProfile: async () => {
    const response = await apiRequest('/auth/profile');
    return response.user;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (userId?: string) => {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const response = await apiRequest(`/posts${query}`);
      return response.posts || [];
    } catch (error) {
      console.warn('Failed to load posts from API, using fallback data');
      // Return empty array as fallback
      return [];
    }
  },

  create: async (postData: { title: string; content: string; date?: string; image?: string }) => {
    const response = await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    return response.post;
  },

  update: async (id: string, postData: { title: string; content: string; date?: string; image?: string }) => {
    const response = await apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
    return response.post;
  },

  delete: async (id: string) => {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImage: async (postId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for uploads

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/upload-image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  deleteImage: async (postId: string, imageId: string) => {
    return apiRequest(`/posts/${postId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },

  toggleLike: async (id: string) => {
    const response = await apiRequest(`/posts/${id}/like`, {
      method: 'POST',
    });
    return response;
  },

  addComment: async (postId: string, content: string) => {
    const response = await apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response;
  },

  deleteComment: async (postId: string, commentId: string) => {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Activities API
export const activitiesAPI = {
  getAll: async (userId?: string) => {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const response = await apiRequest(`/activities${query}`);
      return response.activities || [];
    } catch (error) {
      console.warn('Failed to load activities from API, using fallback data');
      // Return empty array as fallback
      return [];
    }
  },

  create: async (activityData: { 
    title: string; 
    description: string; 
    character?: string; 
    links?: string[]; 
    documents?: string[] 
  }) => {
    const response = await apiRequest('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    return response.activity;
  },

  update: async (id: string, activityData: { 
    title: string; 
    description: string; 
    character?: string; 
    links?: string[]; 
    documents?: string[] 
  }) => {
    const response = await apiRequest(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
    return response.activity;
  },

  delete: async (id: string) => {
    return apiRequest(`/activities/${id}`, {
      method: 'DELETE',
    });
  },

  uploadDocument: async (activityId: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    const token = getAuthToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/upload-document`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  uploadImage: async (activityId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/upload-image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  deleteDocument: async (activityId: string, documentId: string) => {
    return apiRequest(`/activities/${activityId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  },

  deleteImage: async (activityId: string, imageId: string) => {
    return apiRequest(`/activities/${activityId}/images/${imageId}`, {
      method: 'DELETE',
    });
  },
};

// Images API
export const imagesAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/images');
      return response.images || [];
    } catch (error) {
      console.warn('Failed to load images from API, using fallback data');
      return [];
    }
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result.image;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  delete: async (id: string) => {
    return apiRequest(`/images/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return checkBackendHealth();
  },
};

// Site Settings API
export const siteSettingsAPI = {
  getSettings: async () => {
    try {
      const response = await apiRequest('/site-settings');
      return response.settings;
    } catch (error) {
      console.warn('Failed to load settings from API, using defaults');
      return {
        heroTitle: 'Bienvenidos a Mi Mundo',
        heroDescription: 'Un espacio donde comparto mis pensamientos, experiencias y momentos especiales. Cada historia es una ventana a mi corazón y mis reflexiones sobre la vida.'
      };
    }
  },

  updateSettings: async (settings: { heroTitle: string; heroDescription: string }) => {
    const response = await apiRequest('/site-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.settings;
  },

  getPublicSettings: async (userId: string) => {
    try {
      const response = await apiRequest(`/site-settings/public?userId=${userId}`);
      return response.settings;
    } catch (error) {
      console.warn('Failed to load public settings from API, using defaults');
      return {
        heroTitle: 'Bienvenidos a Mi Mundo',
        heroDescription: 'Un espacio donde comparto mis pensamientos, experiencias y momentos especiales. Cada historia es una ventana a mi corazón y mis reflexiones sobre la vida.'
      };
    }
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/users');
      return response.users || [];
    } catch (error) {
      console.warn('Failed to load users from API, using fallback data');
      // Return empty array as fallback when backend is not available
      return [];
    }
  },

  getById: async (id: string) => {
    const response = await apiRequest(`/users/${id}`);
    return response.user;
  },
};

// Export backend availability status
export const getBackendStatus = () => backendAvailable;