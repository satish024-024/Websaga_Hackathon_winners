import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user || {});
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalQuestions: 0,
        totalCOs: 0
    });
    const [recentQuestions, setRecentQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch faculty's allocated courses
            const coursesRes = await axios.get(`${BASE_URL}/api/faculty/${user.id}/allocated-courses`);
            const courses = coursesRes.data.data || [];

            // Fetch total questions created by this faculty
            const questionsRes = await axios.get(`${BASE_URL}/api/questions?created_by=${user.id}`);
            const questions = questionsRes.data.data || [];

            // Count total COs across all courses
            let totalCOs = 0;
            for (const course of courses) {
                const cosRes = await axios.get(`${BASE_URL}/api/qp/course-outcomes/${course.course_id}`);
                totalCOs += (cosRes.data.data || []).length;
            }

            setStats({
                totalCourses: courses.length,
                totalQuestions: questions.length,
                totalCOs
            });

            // Get recent 5 questions
            setRecentQuestions(questions.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: 'View My Courses',
            description: 'Access your allocated courses',
            action: () => navigate('/faculty/my-courses'),
            gradient: 'from-green-500 to-emerald-600',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            title: 'Add Questions',
            description: 'Add questions to your courses',
            action: () => navigate('/faculty/questions'),
            gradient: 'from-teal-500 to-cyan-600',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white mb-8 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome, {user.name || 'Faculty'}!</h1>
                <p className="text-green-100">
                    Manage your courses, create questions, and track your academic contributions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">My Courses</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-teal-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Questions Created</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-cyan-100 rounded-lg p-3">
                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Course Outcomes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCOs}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {quickActions.map((action) => (
                        <button
                            key={action.title}
                            onClick={action.action}
                            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-left border border-gray-100"
                        >
                            <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${action.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Questions */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Questions</h2>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                    {recentQuestions.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {recentQuestions.map((q, idx) => (
                                <div key={q.id || idx} className="p-4 hover:bg-gray-50">
                                    <p className="text-sm font-medium text-gray-900 mb-1">{q.question_text}</p>
                                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                                        <span className="flex items-center">
                                            <span className="font-semibold text-green-600">{q.marks} marks</span>
                                        </span>
                                        <span>CO: {q.co?.code || 'N/A'}</span>
                                        <span>Bloom: {q.bloom_level?.name || 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p>No questions added yet. Start by adding questions to your courses!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
