import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const Regulations = () => {
    const [regulations, setRegulations] = useState([]);
    const [name, setName] = useState('');
    const [editingReg, setEditingReg] = useState(null);

    useEffect(() => {
        fetchRegulations();
    }, []);

    const fetchRegulations = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/regulations`);
            if (res.data.success) {
                setRegulations(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch regulations');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReg) {
                // Update logic
                await axios.put(`${BASE_URL}/api/admin/regulations/${editingReg.id}`, { name });
                toast.success('regulation updated');
            } else {
                await axios.post(`${BASE_URL}/api/admin/regulations`, { name });
                toast.success('regulation added');
            }
            setName('');
            setEditingReg(null);
            fetchRegulations();
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${BASE_URL}/api/admin/regulations/${id}`);
            toast.success('Regulation deactivated');
            fetchRegulations();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleEdit = (reg) => {
        setEditingReg(reg);
        setName(reg.name);
    };

    const toggleStatus = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/api/admin/regulations/${id}/toggle`);
            toast.success('Status updated');
            fetchRegulations();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Manage Regulations</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 flex gap-4">
                <input
                    type="text"
                    placeholder="Regulation Name (e.g., R19, R20)"
                    className="flex-1 border p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button className={`px-6 py-2 rounded text-white ${editingReg ? 'bg-orange-500' : 'bg-blue-500'}`}>
                    {editingReg ? 'Update' : 'Add'}
                </button>
                {editingReg && (
                    <button
                        type="button"
                        onClick={() => { setEditingReg(null); setName(''); }}
                        className="bg-gray-500 px-6 py-2 rounded text-white"
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 font-bold border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regulations.map((reg) => (
                            <tr key={reg.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-bold">{reg.name}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => toggleStatus(reg.id)}
                                        className={`px-2 py-1 rounded text-xs transition-colors ${reg.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                    >
                                        {reg.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4 text-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(reg)}
                                        className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(reg.id)}
                                        className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {regulations.length === 0 && (
                            <tr>
                                <td colSpan="3" className="p-4 text-center text-gray-500">No regulations found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Regulations;
