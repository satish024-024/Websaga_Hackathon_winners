import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import gmritLogo from '../../assets/gmrit_logo.jpeg';

const AdminPanel = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  const modules = [
    {
      id: 1,
      title: 'Programs & Branches',
      description: 'Manage academic programs and department branches',
      path: '/admin/adminPanel/websaga/programs',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      title: 'Regulations',
      description: 'Configure curriculum regulations and academic policies',
      path: '/admin/adminPanel/websaga/regulations',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      title: 'Course Management',
      description: 'Add and organize academic course curriculum',
      path: '/admin/adminPanel/websaga/courses',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Faculty Management',
      description: 'Manage faculty profiles and assignments',
      path: '/admin/adminPanel/websaga/faculty',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 5,
      title: 'Question Bank',
      description: 'Build and manage question repository',
      path: '/admin/adminPanel/websaga/questions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 6,
      title: 'Question Paper Generator',
      description: 'Generate exam papers with intelligent question selection',
      path: '/admin/adminPanel/websaga/qp-generator',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Core Feature'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={gmritLogo} alt="GMRIT" className="h-10 w-10" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">WEBSAGA ERP</h1>
                <p className="text-xs text-gray-500">Academic Management System</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user.role || 'Administrator'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your institution's academic operations
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => navigate(module.path)}
              className="relative group bg-white overflow-hidden border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-200"
            >
              {module.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {module.badge}
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className={`inline-flex p-3 ${module.bgColor} rounded-lg ${module.color}`}>
                  {module.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {module.description}
                </p>
                <div className="mt-4">
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-500">
                    Access module
                    <span aria-hidden="true"> →</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            © 2026 GMR Institute of Technology. WEBSAGA Academic ERP v2.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;
