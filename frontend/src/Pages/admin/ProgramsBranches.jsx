import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const ProgramsBranches = () => {
    const [programs, setPrograms] = useState([]);
    const [branches, setBranches] = useState([]);
    const [pbMappings, setPBMappings] = useState([]);

    const [programForm, setProgramForm] = useState({ name: '', code: '' });
    const [branchForm, setBranchForm] = useState({ name: '', code: '' });
    const [mappingForm, setMappingForm] = useState({ program_id: '', branch_id: '' });

    // Edit State
    const [editingProgram, setEditingProgram] = useState(null);
    const [editingBranch, setEditingBranch] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [p, b, pb] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/programs`),
                axios.get(`${BASE_URL}/api/admin/branches`),
                axios.get(`${BASE_URL}/api/admin/pb-mapping`)
            ]);
            setPrograms(p.data.data || []);
            setBranches(b.data.data || []);
            setPBMappings(pb.data.data || []);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    // --- PROGRAMS ---
    const addProgram = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/admin/programs`, programForm);
            toast.success('Program added!');
            setProgramForm({ name: '', code: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add program');
        }
    };

    const updateProgram = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/admin/programs/${editingProgram.id}`, editingProgram);
            toast.success('Program updated!');
            setEditingProgram(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to update program');
        }
    };

    const deleteProgram = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this program?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/programs/${id}`);
            toast.success('Program deactivated!');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete program');
        }
    };

    const toggleProgram = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/api/admin/programs/${id}/toggle`);
            toast.success('Status updated!');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // --- BRANCHES ---
    const addBranch = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/admin/branches`, branchForm);
            toast.success('Branch added!');
            setBranchForm({ name: '', code: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add branch');
        }
    };

    const updateBranch = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/admin/branches/${editingBranch.id}`, editingBranch);
            toast.success('Branch updated!');
            setEditingBranch(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to update branch');
        }
    };

    const deleteBranch = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this branch?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/branches/${id}`);
            toast.success('Branch deactivated!');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete branch');
        }
    };

    const toggleBranch = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/api/admin/branches/${id}/toggle`);
            toast.success('Status updated!');
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    // --- MAPPINGS ---
    const addMapping = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/admin/pb-mapping`, mappingForm);
            toast.success('Mapping created!');
            setMappingForm({ program_id: '', branch_id: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to create mapping');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Programs & Branches Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Programs Section */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                        Programs
                        <span className="text-sm font-normal text-gray-500">{programs.length} total</span>
                    </h2>

                    {/* Add/Edit Form */}
                    <form onSubmit={editingProgram ? updateProgram : addProgram} className="bg-gray-50 p-4 rounded mb-4">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Program Name"
                                className="w-2/3 border rounded px-3 py-2"
                                value={editingProgram ? editingProgram.name : programForm.name}
                                onChange={(e) => editingProgram
                                    ? setEditingProgram({ ...editingProgram, name: e.target.value })
                                    : setProgramForm({ ...programForm, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Code"
                                className="w-1/3 border rounded px-3 py-2"
                                value={editingProgram ? editingProgram.code : programForm.code}
                                onChange={(e) => editingProgram
                                    ? setEditingProgram({ ...editingProgram, code: e.target.value })
                                    : setProgramForm({ ...programForm, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className={`flex-1 text-white px-4 py-2 rounded ${editingProgram ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                {editingProgram ? 'Update Program' : 'Add Program'}
                            </button>
                            {editingProgram && (
                                <button
                                    type="button"
                                    onClick={() => setEditingProgram(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Code</th>
                                    <th className="p-2 text-center">Status</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{p.name}</td>
                                        <td className="p-2 font-mono">{p.code}</td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => toggleProgram(p.id)}
                                                className={`px-2 py-0.5 rounded text-xs ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-2 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingProgram(p)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteProgram(p.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Del
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Branches Section */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
                    <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                        Branches
                        <span className="text-sm font-normal text-gray-500">{branches.length} total</span>
                    </h2>

                    {/* Add/Edit Form */}
                    <form onSubmit={editingBranch ? updateBranch : addBranch} className="bg-gray-50 p-4 rounded mb-4">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Branch Name"
                                className="w-2/3 border rounded px-3 py-2"
                                value={editingBranch ? editingBranch.name : branchForm.name}
                                onChange={(e) => editingBranch
                                    ? setEditingBranch({ ...editingBranch, name: e.target.value })
                                    : setBranchForm({ ...branchForm, name: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Code"
                                className="w-1/3 border rounded px-3 py-2"
                                value={editingBranch ? editingBranch.code : branchForm.code}
                                onChange={(e) => editingBranch
                                    ? setEditingBranch({ ...editingBranch, code: e.target.value })
                                    : setBranchForm({ ...branchForm, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className={`flex-1 text-white px-4 py-2 rounded ${editingBranch ? 'bg-orange-500' : 'bg-green-500'}`}>
                                {editingBranch ? 'Update Branch' : 'Add Branch'}
                            </button>
                            {editingBranch && (
                                <button
                                    type="button"
                                    onClick={() => setEditingBranch(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Code</th>
                                    <th className="p-2 text-center">Status</th>
                                    <th className="p-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.map(b => (
                                    <tr key={b.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{b.name}</td>
                                        <td className="p-2 font-mono">{b.code}</td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => toggleBranch(b.id)}
                                                className={`px-2 py-0.5 rounded text-xs ${b.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {b.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="p-2 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingBranch(b)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteBranch(b.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Del
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Mappings */}
            <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
                <h2 className="text-xl font-bold mb-4">Program-Branch Mapping</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <form onSubmit={addMapping} className="md:w-1/3 space-y-4">
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={mappingForm.program_id}
                            onChange={(e) => setMappingForm({ ...mappingForm, program_id: e.target.value })}
                            required
                        >
                            <option value="">Select Program</option>
                            {programs.filter(p => p.is_active).map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                        </select>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={mappingForm.branch_id}
                            onChange={(e) => setMappingForm({ ...mappingForm, branch_id: e.target.value })}
                            required
                        >
                            <option value="">Select Branch</option>
                            {branches.filter(b => b.is_active).map(b => <option key={b.id} value={b.id}>{b.code} - {b.name}</option>)}
                        </select>
                        <button className="w-full bg-purple-500 text-white px-4 py-2 rounded">
                            Create Mapping
                        </button>
                    </form>

                    <div className="md:w-2/3 max-h-60 overflow-y-auto border rounded">
                        <table className="w-full text-sm">
                            <thead className="bg-purple-50 sticky top-0">
                                <tr>
                                    <th className="p-3 text-left">Program</th>
                                    <th className="p-3 text-left">Branch</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pbMappings.map(m => (
                                    <tr key={m.id} className="border-b">
                                        <td className="p-3 text-gray-700">{m.program?.code}</td>
                                        <td className="p-3 font-semibold">{m.branch?.name} ({m.branch?.code})</td>
                                        <td className="p-3 text-right text-gray-400 italic">Mapped</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramsBranches;
