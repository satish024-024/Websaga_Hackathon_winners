import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user) || {};

    const quickActions = [
        {
            title: 'Question Bank',
            description: 'Add new questions to the repository',
            action: () => navigate('/faculty/questions'),
            gradient: 'from-pink-500 to-rose-600',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        // Placeholder for future features
        {
            title: 'My Courses (Coming Soon)',
            description: 'View assigned courses and subjects',
            action: () => { }, // navigate(`/teacher/${user.user_id}/courses`),
            gradient: 'from-blue-500 to-indigo-600',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
                <p className="mt-2 text-gray-600">
                    Faculty Dashboard - GMR Institute of Technology
                </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action) => (
                        <button
                            key={action.title}
                            onClick={action.action}
                            className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-gray-100"
                        >
                            <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${action.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                            <div className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center">
                                Open module
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
