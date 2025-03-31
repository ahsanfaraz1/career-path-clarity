
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import axios from 'axios';
import './index.css';

// Configure axios with base URL from environment variable
const API_URL = 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

// Global axios error handling
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")!).render(<App />);
