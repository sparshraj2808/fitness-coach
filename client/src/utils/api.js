/* api.js - Centralized API client communication wrapper */

const BASE_URL = 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('fitcoach_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('fitcoach_token', token);
  } else {
    localStorage.removeItem('fitcoach_token');
  }
}

async function fetchAPI(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Call failed at [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Authentication
  login: async (email, password) => {
    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res.user;
  },

  register: async (userData) => {
    const res = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(res.token);
    return res.user;
  },

  getProfile: async () => {
    return await fetchAPI('/auth/profile');
  },

  updateProfile: async (profileData) => {
    return await fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // AI Chat
  getChatHistory: async () => {
    return await fetchAPI('/chat/history');
  },

  sendChatMessage: async (message) => {
    return await fetchAPI('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  clearChatHistory: async () => {
    return await fetchAPI('/chat/history', {
      method: 'DELETE',
    });
  },

  // Workouts
  getWorkoutTemplates: async () => {
    return await fetchAPI('/workouts/templates');
  },

  getWorkoutLogs: async () => {
    return await fetchAPI('/workouts/logs');
  },

  logWorkout: async (workoutLog) => {
    return await fetchAPI('/workouts/log', {
      method: 'POST',
      body: JSON.stringify(workoutLog),
    });
  },

  // Tracking & Telemetry
  getTrackerStatus: async () => {
    return await fetchAPI('/tracker/status');
  },

  logWater: async (amount) => {
    return await fetchAPI('/tracker/water', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  logCalories: async (calories) => {
    return await fetchAPI('/tracker/calories', {
      method: 'POST',
      body: JSON.stringify({ calories }),
    });
  },

  logWeight: async (weight) => {
    return await fetchAPI('/tracker/weight', {
      method: 'POST',
      body: JSON.stringify({ weight }),
    });
  },

  getTrackerHistory: async () => {
    return await fetchAPI('/tracker/history');
  },

  logout: () => {
    setAuthToken(null);
  }
};
