import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [regulations, setRegulations] = useState([]);
    const [pbMappings, setPBMappings] = useState([]);

    const [formData, setFormData] = useState({
        course_name: '',
        course_code: '',
        program_branch_id: '',
        regulation_id: '',
        year: 'I',
        semester: 'I',
        course_type: 'Theory',
        elective_type: 'CORE',
        credits: 3
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, programsRes, branchesRes, regsRes, pbRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/courses`),
                axios.get(`${BASE_URL}/api/admin/programs`),
                axios.get(`${BASE_URL}/api/admin/branches`),
                axios.get(`${BASE_URL}/api/admin/regulations`),
                axios.get(`${BASE_URL}/api/admin/pb-mapping`)
            ]);

            setCourses(coursesRes.data.data || []);
            setPrograms(programsRes.data.data || []);
            setBranches(branchesRes.data.data || []);
            setRegulations(regsRes.data.data || []);
            setPBMappings(pbRes.data.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/courses`, formData);
            if (res.data.success) {
                toast.success('Course added successfully!');
                fetchData();
                // Reset form
                setFormData({
                    course_name: '',
                    course_code: '',
                    program_branch_id: '',
                    regulation_id: '',
                    year: 'I',
                    semester: 'I',
                    course_type: 'Theory',
                    elective_type: 'CORE',
                    credits: 3
                });
            }
        } catch (error) {
            console.error('Error adding course:', error);
            toast.error(error.response?.data?.msg || 'Failed to add course');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>

            {/* Instructions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-sm">
                    <strong>Note:</strong> Before adding a course, ensure you have:
                    <br />1. Created a Program (e.g., B.Tech)
                    <br />2. Created a Branch (e.g., CSE)
                    <br />3. Created Program-Branch Mapping
                    <br />4. Created a Regulation (e.g., AR23)
                </p>
            </div>

            {/* Add Course Form */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
                <h2 className="text-xl font-bold mb-4">Add New Course</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Course Name
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.course_name}
                            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                            placeholder="e.g., Digital Electronics"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Course Code
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.course_code}
                            onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                            placeholder="e.g., ECE301"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Program-Branch Mapping
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.program_branch_id}
                            onChange={(e) => setFormData({ ...formData, program_branch_id: e.target.value })}
                            required
                        >
                            <option value="">Select Program-Branch</option>
                            {pbMappings.map(pb => (
                                <option key={pb.id} value={pb.id}>
                                    {pb.program?.name} - {pb.branch?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Regulation
                        </label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.regulation_id}
                            onChange={(e) => setFormData({ ...formData, regulation_id: e.target.value })}
                            required
                        >
                            <option value="">Select Regulation</option>
                            {regulations.map(reg => (
                                <option key={reg.id} value={reg.id}>{reg.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        >
                            <option value="I">I</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        >
                            <option value="I">I</option>
                            <option value="II">II</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Course Type</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.course_type}
                            onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                        >
                            <option value="Theory">Theory</option>
                            <option value="Lab">Lab</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Elective Type</label>
                        <select
                            className="shadow border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.elective_type}
                            onChange={(e) => setFormData({ ...formData, elective_type: e.target.value })}
                        >
                            <option value="CORE">CORE</option>
                            <option value="Professional Elective">Professional Elective</option>
                            <option value="Open Elective">Open Elective</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Credits</label>
                        <input
                            type="number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={formData.credits}
                            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                            min="1"
                            max="6"
                        />
                    </div>

                    <div className="col-span-2">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Add Course
                        </button>
                    </div>
                </form>
            </div>

            {/* Courses List */}
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <h2 className="text-xl font-bold mb-4">Existing Courses ({courses.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Code</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Year/Sem</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="border-b">
                                    <td className="px-4 py-2">{course.course_code}</td>
                                    <td className="px-4 py-2">{course.course_name}</td>
                                    <td className="px-4 py-2">{course.year}/{course.semester}</td>
                                    <td className="px-4 py-2">{course.course_type}</td>
                                    <td className="px-4 py-2">{course.credits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
