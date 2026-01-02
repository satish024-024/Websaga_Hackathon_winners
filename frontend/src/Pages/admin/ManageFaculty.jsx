import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const ManageFaculty = () => {
    const [facultyList, setFacultyList] = useState([]);
    const [branches, setBranches] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'bulk'

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        emp_id: '',
        phone: '',
        honorific: 'Mr.',
        department_branch_id: ''
    });

    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [branchesRes, facultyRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/branches`),
                axios.get(`${BASE_URL}/api/faculty`)
            ]);
            setBranches(branchesRes.data.data || []);
            setFacultyList(facultyRes.data.data || []);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/faculty`, {
                ...formData,
                role: 'faculty'
            });

            if (res.data.success) {
                // Show password to admin
                const password = res.data.password;
                alert(`Faculty Created Successfully!\n\nEmail: ${formData.email}\nPassword: ${password}\n\nPLEASE SAVE THIS PASSWORD NOW. It will not be shown again.`);
                toast.success('Faculty added successfully');

                setFormData({
                    full_name: '',
                    email: '',
                    emp_id: '',
                    phone: '',
                    honorific: 'Mr.',
                    department_branch_id: ''
                });
                setViewMode('list');
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add faculty');
        }
    };

    const handleBulkUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.warning('Please select a CSV file');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${BASE_URL}/api/faculty/bulk-upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                if (res.data.errors.length > 0) {
                    console.error('Bulk Upload Errors:', res.data.errors);
                    alert(`Upload completed with ${res.data.errors.length} errors. Check console for details.`);
                }
                setFile(null);
                setViewMode('list');
                fetchData();
            }
        } catch (error) {
            toast.error('Bulk upload failed');
        }
    };

    const toggleStatus = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/api/faculty/${id}/toggle-status`);
            fetchData();
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this faculty member?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/faculty/${id}`);
            fetchData();
            toast.success('Faculty deactivated');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Faculty</h1>
                <div className="space-x-4">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('add')}
                        className={`px-4 py-2 rounded ${viewMode === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Add New
                    </button>
                    <button
                        onClick={() => setViewMode('bulk')}
                        className={`px-4 py-2 rounded ${viewMode === 'bulk' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Bulk Upload
                    </button>
                </div>
            </div>

            {/* LIST VIEW */}
            {viewMode === 'list' && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 font-bold border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">EMP ID</th>
                                <th className="p-4">Department</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyList.map(emp => (
                                <tr key={emp.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-bold">{emp.honorific} {emp.full_name}</div>
                                        <div className="text-xs text-gray-500">{emp.email}</div>
                                    </td>
                                    <td className="p-4">{emp.emp_id}</td>
                                    <td className="p-4">{emp.department?.name || '-'}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleStatus(emp.id)}
                                            className={`px-2 py-1 rounded text-xs ${emp.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                        >
                                            {emp.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(emp.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {facultyList.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">No faculty found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ADD VIEW */}
            {viewMode === 'add' && (
                <div className="bg-white p-8 rounded shadow max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-6">Add User (Faculty)</h2>
                    <form onSubmit={handleCreateFaculty} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Honorific</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={formData.honorific}
                                    onChange={e => setFormData({ ...formData, honorific: e.target.value })}
                                >
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Dr.</option>
                                    <option>Prof.</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold mb-1">Full Name</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border rounded p-2"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Emp ID</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={formData.emp_id}
                                    onChange={e => setFormData({ ...formData, emp_id: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Phone</label>
                                <input
                                    className="w-full border rounded p-2"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Department</label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={formData.department_branch_id}
                                    onChange={e => setFormData({ ...formData, department_branch_id: e.target.value })}
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded text-sm text-yellow-800">
                            Note: A random password will be generated automatically and displayed after creation.
                        </div>

                        <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
                            Create Faculty Member
                        </button>
                    </form>
                </div>
            )}

            {/* BULK UPLOAD VIEW */}
            {viewMode === 'bulk' && (
                <div className="bg-white p-8 rounded shadow max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold mb-6">Bulk Upload Faculty</h2>
                    <p className="mb-4 text-gray-600">
                        Upload a CSV file with the following columns: <br />
                        <code className="bg-gray-100 p-1">email, full_name, emp_id, phone, honorific, department_branch_id</code>
                    </p>

                    <form onSubmit={handleBulkUpload} className="space-y-6">
                        <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={e => setFile(e.target.files[0])}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                        </div>
                        <button className="w-full bg-green-600 text-white p-3 rounded font-bold hover:bg-green-700">
                            Upload File
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageFaculty;

