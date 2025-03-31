
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { User, Mail, AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const API_URL = 'http://localhost:5000';
        const [profileRes, applicationsRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile`),
          axios.get(`${API_URL}/api/applications`)
        ]);
        
        setProfile(profileRes.data);
        setFormData({
          name: profileRes.data.name,
          email: profileRes.data.email
        });
        setApplicationCount(applicationsRes.data.length);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const API_URL = 'http://localhost:5000';
      const res = await axios.put(`${API_URL}/api/profile`, formData);
      
      setProfile(res.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const API_URL = 'http://localhost:5000';
      await axios.delete(`${API_URL}/api/profile`);
      
      toast.success('Account deleted successfully');
      logout(); // Redirect to home and clear auth
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
      toast.error('Failed to delete account');
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="text-gray-900 font-medium">{profile?.name}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="text-gray-900 font-medium">{profile?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <p className="text-gray-700">
                <span className="font-medium">Total Applications:</span> {applicationCount}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Member Since:</span> {new Date(profile?.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
        
        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <div className="flex items-start mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-1" />
              <div>
                <p className="text-red-600 font-medium">Delete your account?</p>
                <p className="text-gray-700 mt-1">
                  This action cannot be undone. All your applications and data will be permanently deleted.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn btn-danger"
          >
            Delete My Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
