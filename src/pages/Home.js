
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, ChartBar } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-blue-100 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Track Your Job Applications with Ease
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl">
              SmartJobTracker helps you organize your job search, track applications, 
              and improve your resume with AI-powered feedback.
            </p>
            
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="btn btn-primary text-lg py-3 px-8"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="btn btn-primary text-lg py-3 px-8"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="btn bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 text-lg py-3 px-8"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Briefcase size={36} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Applications</h3>
              <p className="text-gray-600">
                Keep all your job applications organized in one place with status updates and important details.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FileText size={36} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Resume Feedback</h3>
              <p className="text-gray-600">
                Get personalized AI-powered feedback on your resume based on job descriptions.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <ChartBar size={36} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visualize Progress</h3>
              <p className="text-gray-600">
                See your application statistics at a glance with intuitive charts and metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Job Search?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of job seekers who have organized their job search with SmartJobTracker.
            </p>
            
            {!isAuthenticated && (
              <Link 
                to="/register" 
                className="btn btn-primary text-lg py-3 px-8"
              >
                Sign Up for Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
