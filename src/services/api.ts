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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
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
    return apiRequest('/user/profile');
  },
};

// Posts API
export const postsAPI = {
  getAll: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest(`/posts${query}`);
  },

  create: async (postData: { title: string; content: string; date?: string; image?: string }) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  update: async (id: string, postData: { title: string; content: string; date?: string; image?: string }) => {
    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Activities API
export const activitiesAPI = {
  getAll: async (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiRequest(`/activities${query}`);
  },

  create: async (activityData: { 
    title: string; 
    description: string; 
    character?: string; 
    links?: string[]; 
    documents?: string[] 
  }) => {
    return apiRequest('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },

  update: async (id: string, activityData: { 
    title: string; 
    description: string; 
    character?: string; 
    links?: string[]; 
    documents?: string[] 
  }) => {
    return apiRequest(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/activities/${id}`, {
      method: 'DELETE',
    });
  },
};

// Images API
export const imagesAPI = {
  getAll: async () => {
    return apiRequest('/images');
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

    return response.json();
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