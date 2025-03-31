
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  // Configure axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on first load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/auth/user`);
          setCurrentUser(res.data);
        } catch (err) {
          console.error('Authentication error:', err);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      toast.success('Registration successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/login`, credentials);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Invalid credentials. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    navigate('/');
    toast.info('You have been logged out.');
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
