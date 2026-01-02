import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import gmritLogo from '../../assets/gmrit_logo.jpeg';

const FacultyLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user) || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    const navigation = [
        {
            name: 'Dashboard',
            path: '/faculty/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        // TODO: Map existing 'Courses.jsx' here properly later. For now, we focus on Question Bank as requested.
        // {
        //     name: 'My Courses',
        //     path: `/teacher/${user.user_id}/courses`, // This might link to existing layout, which is fine
        //     icon: (...)
        // },
        {
            name: 'Question Bank',
            path: '/faculty/questions',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Sidebar for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <SidebarContent navigation={navigation} isActive={isActive} navigate={navigate} />
                    </div>
                </div>
            )}

            {/* Static sidebar for desktop */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <SidebarContent navigation={navigation} isActive={isActive} navigate={navigate} />
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top nav */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Faculty Portal</h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user.name || 'Faculty Member'}</p>
                                <p className="text-xs text-gray-500">{user.role || 'Faculty'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Sidebar Content Component
const SidebarContent = ({ navigation, isActive, navigate }) => (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <img className="h-10 w-auto" src={gmritLogo} alt="GMRIT" />
                <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">GMRIT</p>
                    <p className="text-xs text-gray-500">Faculty Portal</p>
                </div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`${isActive(item.path)
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            } group flex items-center w-full px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-150`}
                    >
                        <span className={`${isActive(item.path) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0`}>
                            {item.icon}
                        </span>
                        <span className="flex-1 text-left">{item.name}</span>
                    </button>
                ))}
            </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full">
                <p className="text-xs text-gray-500 text-center">
                    © 2026 GMRIT
                </p>
            </div>
        </div>
    </div>
);

export default FacultyLayout;
