import React from 'react';
import { useNavigate } from 'react-router-dom';

const WebsagaDashboard = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Manage Courses',
            description: 'Add, view, and manage courses with proper Program-Branch mapping',
            path: '/admin/adminPanel/websaga/courses',
            icon: '📚',
            color: 'bg-blue-500'
        },
        {
            title: 'Programs & Branches',
            description: 'Coming soon - Manage academic programs and branches',
            path: '#',
            icon: '🎓',
            color: 'bg-green-500'
        },
        {
            title: 'Question Bank',
            description: 'Coming soon - Manage questions and course outcomes',
            path: '#',
            icon: '❓',
            color: 'bg-purple-500'
        },
        {
            title: 'QP Generator',
            description: 'Coming soon - Generate automated question papers',
            path: '#',
            icon: '📄',
            color: 'bg-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        WEBSAGA Academic ERP
                    </h1>
                    <p className="text-gray-600">
                        GMRIT College of Engineering - Automated Question Paper Generation System
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => module.path !== '#' && navigate(module.path)}
                            className={`${module.path !== '#'
                                    ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-1'
                                    : 'opacity-60 cursor-not-allowed'
                                } bg-white rounded-lg shadow-md p-6 transition-all duration-300`}
                        >
                            <div
                                className={`${module.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}
                            >
                                {module.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{module.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Quick Start Guide</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                        <li>
                            Go to <strong>Manage Courses</strong> to add your first course
                        </li>
                        <li>Before adding courses, ensure you have created:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Programs (e.g., B.Tech, M.Tech)</li>
                                <li>Branches (e.g., CSE, ECE)</li>
                                <li>Program-Branch Mappings</li>
                                <li>Regulations (e.g., AR23, AR21)</li>
                            </ul>
                        </li>
                        <li>Once courses are set up, you can manage questions and generate papers</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default WebsagaDashboard;
