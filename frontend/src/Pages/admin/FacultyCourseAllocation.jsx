import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const FacultyCourseAllocation = () => {
    const [faculty, setFaculty] = useState([]);
    const [programBranches, setProgramBranches] = useState([]);
    const [regulations, setRegulations] = useState([]);
    const [courses, setCourses] = useState([]);
    const [allocations, setAllocations] = useState([]);

    const [formData, setFormData] = useState({
        faculty_id: '',
        program_branch_id: '',
        regulation_id: '',
        course_id: '',
        course_type: 'Theory',
        year: 1,
        semester: 1,
        elective_type: 'CORE',
        academic_year: ''
    });

    useEffect(() => {
        fetchData();
        setAcademicYear();
    }, []);

    const setAcademicYear = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed

        let academicYear;
        if (currentMonth >= 5) { // June onwards
            academicYear = `${currentYear}-${currentYear + 1}`;
        } else {
            academicYear = `${currentYear - 1}-${currentYear}`;
        }

        setFormData(prev => ({ ...prev, academic_year: academicYear }));
    };

    const fetchData = async () => {
        try {
            console.log('Fetching from BASE_URL:', BASE_URL);

            const [facultyRes, pbRes, regRes, coursesRes, allocRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/faculty`),
                axios.get(`${BASE_URL}/api/admin/pb-mapping`),
                axios.get(`${BASE_URL}/api/admin/regulations`),
                axios.get(`${BASE_URL}/api/admin/courses`),
                axios.get(`${BASE_URL}/api/admin/course-allocations`)
            ]);

            console.log('Faculty:', facultyRes.data);
            console.log('PB Mappings:', pbRes.data);
            console.log('Allocations:', allocRes.data);

            setFaculty((facultyRes.data.data || []).filter(f => f.is_active));
            setProgramBranches(pbRes.data.data || []);
            setRegulations((regRes.data.data || []).filter(r => r.is_active));
            setCourses(coursesRes.data.data || []);
            setAllocations(allocRes.data.data || []);
        } catch (error) {
            console.error('Fetch error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            toast.error('Failed to load data: ' + (error.response?.data?.msg || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Only send what the backend expects
            const payload = {
                faculty_id: formData.faculty_id,
                course_id: formData.course_id,
                academic_year: formData.academic_year
            };

            await axios.post(`${BASE_URL}/api/admin/allocate-course`, payload);
            toast.success('Course allocated successfully!');
            setFormData({
                faculty_id: '',
                program_branch_id: '',
                regulation_id: '',
                course_id: '',
                course_type: 'Theory',
                year: 1,
                semester: 1,
                elective_type: 'CORE',
                academic_year: formData.academic_year
            });
            fetchData();
        } catch (error) {
            console.error('Allocation error:', error);
            toast.error(error.response?.data?.msg || 'Failed to allocate course');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this allocation?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/course-allocations/${id}`);
            toast.success('Allocation deleted!');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete allocation');
        }
    };

    // Filter courses based on selected regulation
    const filteredCourses = courses.filter(c =>
        !formData.regulation_id || c.regulation_id === formData.regulation_id
    );

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Faculty-Course Allocation</h1>

            {/* Allocation Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Allocate Course to Faculty</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Faculty */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.faculty_id}
                                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                                required
                            >
                                <option value="">Select Faculty</option>
                                {faculty.map(f => (
                                    <option key={f.id} value={f.id}>
                                        {f.honorific} {f.full_name} ({f.emp_id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Program-Branch */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program-Branch *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.program_branch_id}
                                onChange={(e) => setFormData({ ...formData, program_branch_id: e.target.value })}
                                required
                            >
                                <option value="">Select Program-Branch</option>
                                {programBranches.map(pb => (
                                    <option key={pb.id} value={pb.id}>
                                        {pb.program?.code} - {pb.branch?.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Regulation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Regulation *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.regulation_id}
                                onChange={(e) => setFormData({ ...formData, regulation_id: e.target.value, course_id: '' })}
                                required
                            >
                                <option value="">Select Regulation</option>
                                {regulations.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Course */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.course_id}
                                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                required
                                disabled={!formData.regulation_id}
                            >
                                <option value="">Select Course</option>
                                {filteredCourses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.course_code} - {c.course_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Course Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course Type *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.course_type}
                                onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                                required
                            >
                                <option value="Theory">Theory</option>
                                <option value="Lab">Lab</option>
                                <option value="Project">Project</option>
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                required
                            >
                                <option value={1}>I</option>
                                <option value={2}>II</option>
                                <option value={3}>III</option>
                                <option value={4}>IV</option>
                            </select>
                        </div>

                        {/* Semester */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                required
                            >
                                <option value={1}>I</option>
                                <option value={2}>II</option>
                            </select>
                        </div>

                        {/* Elective Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Elective Type *</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={formData.elective_type}
                                onChange={(e) => setFormData({ ...formData, elective_type: e.target.value })}
                                required
                            >
                                <option value="CORE">CORE</option>
                                <option value="PE">Professional Elective</option>
                                <option value="OE">Open Elective</option>
                            </select>
                        </div>

                        {/* Academic Year (Auto-filled, Disabled) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                                value={formData.academic_year}
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">Auto-calculated based on current date</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium"
                        >
                            Allocate Course
                        </button>
                    </div>
                </form>
            </div>

            {/* Allocations Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Current Allocations ({allocations.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Faculty</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Branch</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Year/Sem</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {allocations.length > 0 ? (
                                allocations.map((alloc) => (
                                    <tr key={alloc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {alloc.faculty?.full_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">{alloc.faculty?.emp_id || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {alloc.course?.course_name || 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">{alloc.course?.course_code || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            -
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {alloc.course?.year || '-'}/{alloc.course?.semester || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                                                -
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {alloc.academic_year || '2025-2026'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDelete(alloc.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No allocations found. Create your first allocation above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FacultyCourseAllocation;
