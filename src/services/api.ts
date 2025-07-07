const API_BASE_URL = 'http://localhost:3001/api';

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

// API request helper with auth
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
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
    const query = userId ? `?userId=${userId}` : '';
    const response = await apiRequest(`/posts${query}`);
    return response.posts || [];
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

  toggleLike: async (id: string) => {
    const response = await apiRequest(`/posts/${id}/like`, {
      method: 'POST',
    });
    return response;
  },
};

// Activities API
export const activitiesAPI = {
  getAll: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    const response = await apiRequest(`/activities${query}`);
    return response.activities || [];
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
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}/upload-document`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  uploadImage: async (activityId: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
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
    const response = await apiRequest('/images');
    return response.images || [];
  },

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    return result.image;
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
    return apiRequest('/health');
  },
};

// Site Settings API
export const siteSettingsAPI = {
  getSettings: async () => {
    const response = await apiRequest('/site-settings');
    return response.settings;
  },

  updateSettings: async (settings: { heroTitle: string; heroDescription: string }) => {
    const response = await apiRequest('/site-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.settings;
  },

  getPublicSettings: async (userId: string) => {
    const response = await apiRequest(`/site-settings/public?userId=${userId}`);
    return response.settings;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await apiRequest('/users');
    return response.users || [];
  },

  getById: async (id: string) => {
    const response = await apiRequest(`/users/${id}`);
    return response.user;
  },
};