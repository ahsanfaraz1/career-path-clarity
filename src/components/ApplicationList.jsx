
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Edit, Trash2, ChevronDown, ChevronUp, Calendar, Info, Edit3 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ApplicationList = ({ applications = [], onEdit, onDelete, loading }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [sortField, setSortField] = useState('applicationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (applications.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No applications found. Add your first job application!</p>
      </div>
    );
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await onDelete(id);
      } catch (err) {
        console.error('Error deleting application:', err);
        toast.error('Failed to delete application');
      }
    }
  };
  
  // Format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };
  
  // Get sorted applications
  const sortedApplications = [...applications].sort((a, b) => {
    if (sortField === 'applicationDate') {
      const dateA = new Date(a.applicationDate || 0);
      const dateB = new Date(b.applicationDate || 0);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // For string fields
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });
  
  // Get status color class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'Offer':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('company')}
              >
                <div className="flex items-center">
                  Company
                  {renderSortIndicator('company')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('jobTitle')}
              >
                <div className="flex items-center">
                  Position
                  {renderSortIndicator('jobTitle')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('applicationDate')}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIndicator('applicationDate')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedApplications.map((app) => (
              <React.Fragment key={app._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{app.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{app.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(app.applicationDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => toggleExpand(app._id)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={expandedId === app._id ? "Hide details" : "Show details"}
                      >
                        {expandedId === app._id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <Info size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(app)}
                        className="text-yellow-600 hover:text-yellow-800"
                        aria-label="Edit application"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(app._id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete application"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === app._id && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold flex items-center text-gray-700 mb-2">
                            <Edit3 size={16} className="mr-1" /> Job Description
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {app.jobDescription || 'No job description provided.'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold flex items-center text-gray-700 mb-2">
                            <Edit3 size={16} className="mr-1" /> Notes
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {app.notes || 'No notes provided.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationList;
