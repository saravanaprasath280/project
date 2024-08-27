import axios from 'axios';

export const API_URL = 'http://localhost:8000/api/';

// Create an Axios instance
const apiInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in headers
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
export const registerUser = (userData) => {
  return axios.post(`${API_URL}register/`, userData);
};

export const loginUser = (credentials) => {
  return axios.post(`${API_URL}login/`, credentials);
};

export const getDashboardData = () => {
  return apiInstance.get('dashboard/');
};

export const uploadProfileImage = (formData) => {
  return apiInstance.post('upload-profile-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
