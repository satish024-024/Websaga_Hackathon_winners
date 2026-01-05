import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';
import QuestionBank from '../admin/QuestionBank';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('outcomes');
    const [course, setCourse] = useState(null);
    const [courseOutcomes, setCourseOutcomes] = useState([]);
    const [loading, setLoading] = useState(true);

    // CO Form State
    const [coForm, setCoForm] = useState({ code: '', description: '' });
    const [editingCO, setEditingCO] = useState(null);

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            // Fetch course allocation details
            const allocRes = await axios.get(`${BASE_URL}/api/admin/course-allocations`);
            const allocation = (allocRes.data.data || []).find(a => a.id === courseId);
            setCourse(allocation);

            // Fetch course outcomes
            if (allocation?.course_id) {
                const cosRes = await axios.get(`${BASE_URL}/api/qp/course-outcomes/${allocation.course_id}`);
                setCourseOutcomes(cosRes.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to load course data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCO = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/course-outcomes`, {
                course_id: course.course_id,
                code: coForm.code,
                description: coForm.description
            });
            toast.success('Course Outcome added!');
            setCoForm({ code: '', description: '' });
            fetchCourseData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add CO');
        }
    };

    const handleUpdateCO = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/course-outcomes/${editingCO.id}`, {
                code: coForm.code,
                description: coForm.description
            });
            toast.success('Course Outcome updated!');
            setEditingCO(null);
            setCoForm({ code: '', description: '' });
            fetchCourseData();
        } catch (error) {
            toast.error('Failed to update CO');
        }
    };

    const handleEditCO = (co) => {
        setEditingCO(co);
        setCoForm({ code: co.code, description: co.description });
    };

    const handleDeleteCO = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Course Outcome?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/course-outcomes/${id}`);
            toast.success('Course Outcome deleted!');
            fetchCourseData();
        } catch (error) {
            toast.error('Failed to delete CO');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Course not found</p>
                <button
                    onClick={() => navigate('/faculty/my-courses')}
                    className="mt-4 text-green-600 hover:text-green-700"
                >
                    ← Back to My Courses
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/faculty/my-courses')}
                    className="text-green-600 hover:text-green-700 mb-4 inline-flex items-center text-sm"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to My Courses
                </button>

                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold">{course.course?.course_name}</h1>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-green-100">
                        <span>Course Code: {course.course?.course_code}</span>
                        <span>•</span>
                        <span>Branch: {course.program_branch?.branch?.name}</span>
                        <span>•</span>
                        <span>Year: {course.year} / Sem: {course.semester}</span>
                        <span>•</span>
                        <span>Type: {course.course_type}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('outcomes')}
                        className={`${activeTab === 'outcomes'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        Course Outcomes
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`${activeTab === 'questions'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        Questions
                    </button>
                </nav>
            </div>

            {/* Course Outcomes Tab */}
            {activeTab === 'outcomes' && (
                <div>
                    {/* Add/Edit Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingCO ? 'Edit Course Outcome' : 'Add Course Outcome'}
                        </h2>
                        <form onSubmit={editingCO ? handleUpdateCO : handleAddCO} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CO Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., CO1"
                                        className="w-full border rounded px-3 py-2"
                                        value={coForm.code}
                                        onChange={(e) => setCoForm({ ...coForm, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Describe the learning outcome"
                                        className="w-full border rounded px-3 py-2"
                                        value={coForm.description}
                                        onChange={(e) => setCoForm({ ...coForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        {editingCO ? 'Update' : 'Add'}
                                    </button>
                                    {editingCO && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCO(null);
                                                setCoForm({ code: '', description: '' });
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* COs List */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {courseOutcomes.length > 0 ? (
                                    courseOutcomes.map((co) => (
                                        <tr key={co.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{co.code}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{co.description}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                                <button
                                                    onClick={() => handleEditCO(co)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCO(co.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                            No course outcomes added yet. Add your first CO above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
                <div>
                    <QuestionBank preselectedCourseId={course.course_id} />
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
