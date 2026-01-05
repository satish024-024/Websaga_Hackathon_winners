import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const QuestionBank = () => {
    const [courses, setCourses] = useState([]);
    const [cos, setCos] = useState([]);
    const [blooms, setBlooms] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [units, setUnits] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [selectedCourse, setSelectedCourse] = useState('');
    const [showCOForm, setShowCOForm] = useState(false);
    const [coForm, setCoForm] = useState({ code: '', description: '' });
    const [formData, setFormData] = useState({
        course_id: '',
        co_id: '',
        bloom_level_id: '',
        difficulty_level_id: '',
        unit_id: '',
        question_text: '',
        marks: 2,
        question_type: 'descriptive',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchPlugins();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchCOs(selectedCourse);
            fetchQuestions(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/courses`);
            setCourses(res.data.data || []);
        } catch (error) {
            toast.error('Failed to load courses');
        }
    };

    const fetchPlugins = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/plugins`);
            const data = res.data.data;
            setBlooms(data.blooms || []);
            setDifficulties(data.difficulties || []);
            setUnits(data.units || []);
        } catch (error) {
            toast.error('Failed to load plugins');
        }
    };

    const fetchCOs = async (courseId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/course-outcomes?course_id=${courseId}`);
            setCos(res.data.data || []);
        } catch (error) {
            console.error('Failed to load COs');
        }
    };

    const fetchQuestions = async (courseId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/questions?course_id=${courseId}`);
            setQuestions(res.data.data || []);
        } catch (error) {
            console.error('Failed to load questions');
        }
    };

    const handleCourseChange = (courseId) => {
        setSelectedCourse(courseId);
        setFormData({ ...formData, course_id: courseId });
    };

    const addCO = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/course-outcomes`, {
                course_id: selectedCourse,
                ...coForm
            });
            toast.success('Course Outcome added!');
            setCoForm({ code: '', description: '' });
            setShowCOForm(false);
            fetchCOs(selectedCourse);
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add CO');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const res = await axios.post(`${BASE_URL}/api/upload/question-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url;
        } catch (error) {
            toast.error('Image upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const addQuestion = async (e) => {
        e.preventDefault();
        try {
            // Upload image if present
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadImage();
                if (!imageUrl) {
                    toast.error('Failed to upload image. Please try again.');
                    return; // Stop if image upload failed
                }
            }

            // Submit question with image URL
            await axios.post(`${BASE_URL}/api/questions`, {
                ...formData,
                image_url: imageUrl
            });

            toast.success('Question added successfully!');

            // Reset form
            setFormData({
                course_id: selectedCourse,
                co_id: '',
                bloom_level_id: '',
                difficulty_level_id: '',
                unit_id: '',
                question_text: '',
                marks: 2,
                question_type: 'descriptive',
                option_a: '',
                option_b: '',
                option_c: '',
                option_d: '',
                correct_option: ''
            });
            setImageFile(null);
            setImagePreview('');
            const imageInput = document.getElementById('imageInput');
            if (imageInput) imageInput.value = ''; // Clear file input
            fetchQuestions(selectedCourse);
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to add question');
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Question Bank Management</h1>

            {/* Course Selection */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <label className="block text-lg font-bold mb-2">Select Course</label>
                <select
                    className="w-full border rounded px-3 py-2 text-lg"
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                >
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.course_code} - {c.course_name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <>
                    {/* Course Outcomes */}
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Course Outcomes ({cos.length})</h2>
                            <button
                                onClick={() => setShowCOForm(!showCOForm)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {showCOForm ? 'Cancel' : '+ Add CO'}
                            </button>
                        </div>

                        {showCOForm && (
                            <form onSubmit={addCO} className="mb-4 space-y-3">
                                <div className="grid grid-cols-4 gap-4">
                                    <input
                                        type="text"
                                        placeholder="CO Code (e.g., CO1)"
                                        className="border rounded px-3 py-2"
                                        value={coForm.code}
                                        onChange={(e) => setCoForm({ ...coForm, code: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        className="col-span-2 border rounded px-3 py-2"
                                        value={coForm.description}
                                        onChange={(e) => setCoForm({ ...coForm, description: e.target.value })}
                                        required
                                    />
                                    <button className="bg-blue-500 text-white rounded">Add</button>
                                </div>
                            </form>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            {cos.map(co => (
                                <div key={co.id} className="border p-2 rounded">
                                    <strong>{co.code}:</strong> {co.description}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Question Form */}
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <h2 className="text-xl font-bold mb-4">Add Question</h2>
                        <form onSubmit={addQuestion} className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Course Outcome</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.co_id}
                                        onChange={(e) => setFormData({ ...formData, co_id: e.target.value })}
                                    >
                                        <option value="">Select CO</option>
                                        {cos.map(co => <option key={co.id} value={co.id}>{co.code}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Bloom Level</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.bloom_level_id}
                                        onChange={(e) => setFormData({ ...formData, bloom_level_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Bloom</option>
                                        {blooms.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Difficulty</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.difficulty_level_id}
                                        onChange={(e) => setFormData({ ...formData, difficulty_level_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Difficulty</option>
                                        {difficulties.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Unit</label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.unit_id}
                                        onChange={(e) => setFormData({ ...formData, unit_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Unit</option>
                                        {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Question Text</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    rows="3"
                                    value={formData.question_text}
                                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                                    placeholder="Enter the question..."
                                    required
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-bold mb-1">Question Diagram/Image (Optional)</label>
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Supported formats: JPG, PNG, GIF</p>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-3 relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-w-xs max-h-48 border rounded shadow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview('');
                                                document.getElementById('imageInput').value = '';
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Marks</label>
                                    <input
                                        type="number"
                                        className="w-full border rounded px-3 py-2"
                                        value={formData.marks}
                                        onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                                        min="1"
                                        max="20"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className={`w-full px-4 py-2 rounded font-bold text-white ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {uploading ? 'Uploading Image...' : 'Add Question'}
                            </button>
                        </form>
                    </div>

                    {/* Questions List */}
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Questions ({questions.length})</h2>
                        <div className="space-y-3">
                            {questions.map((q, index) => (
                                <div key={q.id} className="border-l-4 border-blue-500 p-4 bg-gray-50">
                                    <div className="flex justify-between">
                                        <span className="font-bold">Q{index + 1}</span>
                                        <div className="space-x-2 text-sm">
                                            <span className="bg-purple-100 px-2 py-1 rounded">{q.bloom_level?.name}</span>
                                            <span className="bg-yellow-100 px-2 py-1 rounded">{q.difficulty_level?.name}</span>
                                            <span className="bg-green-100 px-2 py-1 rounded">{q.marks}M</span>
                                        </div>
                                    </div>
                                    <p className="mt-2">{q.question_text}</p>
                                    <div className="mt-2 text-sm text-gray-600">
                                        CO: {q.co?.code} | Unit: {q.unit?.name}
                                    </div>
                                </div>
                            ))}
                            {questions.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No questions added yet for this course.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default QuestionBank;
