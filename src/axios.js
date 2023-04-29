import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4444',
  // headers: { Authorization: window.localStorage.getItem('token') },
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;
