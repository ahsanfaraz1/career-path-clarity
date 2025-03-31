
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import StatsChart from './StatsChart';
import ApplicationList from './ApplicationList';
import ApplicationForm from './ApplicationForm';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [error, setError] = useState('');

  // Fetch applications and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const API_URL = 'http://localhost:5000';
        
        const [applicationsRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/api/applications`),
          axios.get(`${API_URL}/api/applications/stats`)
        ]);
        
        setApplications(applicationsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load your applications. Please try again later.');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveApplication = (newOrUpdatedApplication) => {
    if (editingApplication) {
      // Update existing application in the list
      setApplications(applications.map(app => 
        app._id === newOrUpdatedApplication._id ? newOrUpdatedApplication : app
      ));
      setEditingApplication(null);
    } else {
      // Add new application to the list
      setApplications([...applications, newOrUpdatedApplication]);
      setShowAddForm(false);
    }
    
    // Refresh stats
    refreshStats();
  };

  const handleDeleteApplication = async (id) => {
    try {
      const API_URL = 'http://localhost:5000';
      await axios.delete(`${API_URL}/api/applications/${id}`);
      
      // Remove from state
      setApplications(applications.filter(app => app._id !== id));
      
      // Refresh stats
      refreshStats();
      
      toast.success('Application deleted successfully');
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Failed to delete application');
    }
  };

  const refreshStats = async () => {
    try {
      const API_URL = 'http://localhost:5000';
      const statsRes = await axios.get(`${API_URL}/api/applications/stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error refreshing stats:', err);
    }
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setShowAddForm(false); // Close add form if it's open
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingApplication(null);
  };

  if (loading && !applications.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
        
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingApplication(null);
          }}
          className="btn btn-primary flex items-center mt-4 md:mt-0"
          disabled={showAddForm || editingApplication}
        >
          <Plus size={20} className="mr-1" />
          Add Application
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {(showAddForm || editingApplication) && (
        <div className="mb-8">
          <ApplicationForm 
            application={editingApplication}
            onSave={handleSaveApplication}
            onCancel={handleCancelForm}
          />
        </div>
      )}
      
      {!loading && !showAddForm && !editingApplication && (
        <div className="mb-8">
          <StatsChart stats={stats} />
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Applications</h2>
        <ApplicationList 
          applications={applications} 
          onEdit={handleEdit}
          onDelete={handleDeleteApplication}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
