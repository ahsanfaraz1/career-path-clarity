
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ApplicationForm = ({ application = null, onSave, onCancel }) => {
  const isEditing = !!application;
  
  const initialFormState = {
    company: '',
    jobTitle: '',
    applicationDate: new Date().toISOString().split('T')[0], // today's date in YYYY-MM-DD
    status: 'Applied',
    jobDescription: '',
    notes: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (application) {
      // Format the date for the input field if it exists
      let formattedDate = application.applicationDate;
      if (formattedDate) {
        formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      }
      
      setFormData({
        ...application,
        applicationDate: formattedDate
      });
    }
  }, [application]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const API_URL = 'http://localhost:5000';
      let response;
      
      if (isEditing) {
        // Update existing application
        response = await axios.put(`${API_URL}/api/applications/${application._id}`, formData);
        toast.success('Application updated successfully!');
      } else {
        // Add new application
        response = await axios.post(`${API_URL}/api/applications`, formData);
        toast.success('Application added successfully!');
      }
      
      onSave(response.data);
    } catch (err) {
      console.error('Application form error:', err);
      setError(err.response?.data?.message || 'Error saving application. Please try again.');
      toast.error('Error saving application.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {isEditing ? 'Edit Application' : 'Add New Application'}
        </h3>
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="company">
              Company *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="jobTitle">
              Job Title *
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="applicationDate">
              Application Date *
            </label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="status">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="jobDescription">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            rows="4"
            className="form-input"
            placeholder="Paste the job description here..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="form-input"
            placeholder="Add any personal notes here..."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
