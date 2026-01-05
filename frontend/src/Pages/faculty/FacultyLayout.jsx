import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const FacultyLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user?.user || {});

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    const navItems = [
        {
            name: 'Dashboard',
            path: '/faculty/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'My Courses',
            path: '/faculty/my-courses',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
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

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-900">GMRIT</p>
                                <p className="text-xs text-gray-500">Faculty Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`${isActive(item.path)
                                    ? 'bg-green-50 border-green-500 text-green-700'
                                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    } group flex items-center w-full px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-150`}
                            >
                                <span className={`${isActive(item.path) ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0`}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">© 2025 GMRIT</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h1 className="text-xl font-semibold text-gray-900">WEBSAGA ERP</h1>

                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user.name || 'Faculty User'}</p>
                                <p className="text-xs text-gray-500">Faculty</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Sidebar */}
                {sidebarOpen && (
                    <div className="lg:hidden">
                        <div className="fixed inset-0 flex z-40">
                            {/* Overlay */}
                            <div
                                className="fixed inset-0 bg-gray-600 bg-opacity-75"
                                onClick={() => setSidebarOpen(false)}
                            ></div>

                            {/* Sidebar */}
                            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                                <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        onClick={() => setSidebarOpen(false)}
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    >
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Logo */}
                                <div className="flex items-center h-16 px-6 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">F</span>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-semibold text-gray-900">GMRIT</p>
                                            <p className="text-xs text-gray-500">Faculty Portal</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Navigation */}
                                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                                    {navItems.map((item) => (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                navigate(item.path);
                                                setSidebarOpen(false);
                                            }}
                                            className={`${isActive(item.path)
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                } group flex items-center w-full px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-150`}
                                        >
                                            <span className={`${isActive(item.path) ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'} mr-3 flex-shrink-0`}>
                                                {item.icon}
                                            </span>
                                            {item.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FacultyLayout;
