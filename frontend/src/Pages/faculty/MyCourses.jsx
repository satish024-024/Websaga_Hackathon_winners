import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const MyCourses = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user?.user || {});
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/faculty/${user.id}/allocated-courses`);
            setCourses(res.data.data || []);
        } catch (error) {
            toast.error('Failed to load courses');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getCourseTypeColor = (type) => {
        const colors = {
            'Theory': 'bg-blue-100 text-blue-800',
            'Lab': 'bg-green-100 text-green-800',
            'Project': 'bg-purple-100 text-purple-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const getElectiveTypeColor = (type) => {
        const colors = {
            'CORE': 'bg-indigo-100 text-indigo-800',
            'PE': 'bg-orange-100 text-orange-800',
            'OE': 'bg-pink-100 text-pink-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <p className="mt-2 text-gray-600">
                    Manage your allocated courses, add outcomes, and create questions
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No courses allocated</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Contact your administrator to allocate courses to you.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Card Header with Gradient */}
                            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white line-clamp-2">
                                            {course.course?.course_name || 'Course Name'}
                                        </h3>
                                        <p className="text-sm text-green-100 mt-1 font-mono">
                                            {course.course?.course_code || 'CODE'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getCourseTypeColor(course.course_type)}`}>
                                        {course.course_type}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                {/* Branch */}
                                <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">Branch:</span> {course.program_branch?.branch?.name || 'N/A'}
                                    </span>
                                </div>

                                {/* Year & Semester */}
                                <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">Year/Sem:</span> {course.year}/{course.semester}
                                    </span>
                                </div>

                                {/* Elective Type */}
                                <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getElectiveTypeColor(course.elective_type)}`}>
                                        {course.elective_type}
                                    </span>
                                </div>

                                {/* Academic Year */}
                                <div className="flex items-center text-sm">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">AY:</span> {course.academic_year || '2025-2026'}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => navigate(`/faculty/course/${course.id}`)}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                    View Details
                                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
