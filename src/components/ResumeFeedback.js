
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ResumeFeedback = () => {
  const [formData, setFormData] = useState({
    resumeText: '',
    jobDescription: ''
  });
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type (PDF or DOC/DOCX)
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(fileType)) {
        setError('Please upload a PDF or Word document.');
        setFile(null);
        e.target.value = ''; // Reset file input
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback(null);
    
    try {
      const API_URL = 'http://localhost:5000';
      let response;
      
      if (file) {
        // File upload approach
        const formDataWithFile = new FormData();
        formDataWithFile.append('resume', file);
        formDataWithFile.append('jobDescription', formData.jobDescription);
        
        response = await axios.post(
          `${API_URL}/api/resume-feedback/upload`, 
          formDataWithFile, 
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Text-based approach
        if (!formData.resumeText.trim()) {
          setError('Please enter your resume text or upload a file.');
          setLoading(false);
          return;
        }
        
        response = await axios.post(`${API_URL}/api/resume-feedback`, formData);
      }
      
      setFeedback(response.data);
      toast.success('Resume feedback generated successfully!');
    } catch (err) {
      console.error('Resume feedback error:', err);
      setError(err.response?.data?.message || 'Failed to generate resume feedback. Please try again.');
      toast.error('Failed to generate resume feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderMatchScore = (score) => {
    let colorClass = 'text-red-500';
    if (score >= 80) {
      colorClass = 'text-green-500';
    } else if (score >= 60) {
      colorClass = 'text-yellow-600';
    } else if (score >= 40) {
      colorClass = 'text-orange-500';
    }
    
    return <span className={`font-bold ${colorClass}`}>{score}%</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-2">Resume Feedback</h2>
        <p className="text-gray-600 mb-6">
          Get AI-powered feedback on your resume based on the job description.
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="resumeText">
                Resume Text
              </label>
              <textarea
                id="resumeText"
                name="resumeText"
                value={formData.resumeText}
                onChange={handleChange}
                rows="8"
                placeholder="Paste your resume text here..."
                className="form-input"
                disabled={loading || !!file}
              />
              <p className="mt-2 text-sm text-gray-500">
                Or upload your resume file:
              </p>
              <div className="mt-2">
                <label 
                  htmlFor="resumeFile" 
                  className={`flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded cursor-pointer ${
                    file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {file ? (
                    <>
                      <CheckCircle size={20} className="text-green-500" />
                      <span className="text-green-600 font-medium">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <FileUp size={20} className="text-gray-500" />
                      <span className="text-gray-600">Select a PDF or Word document</span>
                    </>
                  )}
                </label>
                <input
                  type="file"
                  id="resumeFile"
                  name="resumeFile"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  disabled={loading}
                />
              </div>
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="jobDescription">
                Job Description *
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows="8"
                placeholder="Paste the job description here..."
                className="form-input"
                required
                disabled={loading}
              />
            </div>
            
            <div className="text-right">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || (!formData.resumeText && !file) || !formData.jobDescription}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Get Feedback'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {feedback && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Resume Analysis Results</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Match Score:</span>
              {renderMatchScore(feedback.matchScore)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  feedback.matchScore >= 80 ? 'bg-green-500' : 
                  feedback.matchScore >= 60 ? 'bg-yellow-500' : 
                  feedback.matchScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${feedback.matchScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <AlertCircle size={18} className="text-red-500 mr-2" />
              Missing Keywords
            </h4>
            {feedback.missingKeywords && feedback.missingKeywords.length > 0 ? (
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <ul className="list-disc pl-5 space-y-1">
                  {feedback.missingKeywords.map((keyword, index) => (
                    <li key={index} className="text-gray-700">{keyword}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-green-600">Great job! No important keywords missing.</p>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <CheckCircle size={18} className="text-blue-500 mr-2" />
              Suggestions
            </h4>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              {feedback.suggestions && feedback.suggestions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No specific suggestions at this time.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFeedback;
