import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';

const QPGenerator = () => {
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [pbMappings, setPBMappings] = useState([]);

    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assessmentType, setAssessmentType] = useState('MID-1');
    const [examDate, setExamDate] = useState('');

    const [questionCriteria, setQuestionCriteria] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    // Plugin data for dropdowns
    const [courseOutcomes, setCourseOutcomes] = useState([]);
    const [bloomLevels, setBloomLevels] = useState([]);
    const [difficultyLevels, setDifficultyLevels] = useState([]);
    const [units, setUnits] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedProgram) {
            filterCoursesByProgram(selectedProgram);
        }
    }, [selectedProgram]);

    const fetchData = async () => {
        try {
            const [programsRes, coursesRes, pbRes, bloomRes, diffRes, unitsRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/programs`),
                axios.get(`${BASE_URL}/api/admin/courses`),
                axios.get(`${BASE_URL}/api/admin/pb-mapping`),
                axios.get(`${BASE_URL}/api/qp/bloom-levels`),
                axios.get(`${BASE_URL}/api/qp/difficulty-levels`),
                axios.get(`${BASE_URL}/api/qp/units`)
            ]);
            setPrograms(programsRes.data.data || []);
            setCourses(coursesRes.data.data || []);
            setPBMappings(pbRes.data.data || []);
            setBloomLevels(bloomRes.data.data || []);
            setDifficultyLevels(diffRes.data.data || []);
            setUnits(unitsRes.data.data || []);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const filterCoursesByProgram = (programId) => {
        // Find PB mappings for this program
        const relevantMappings = pbMappings.filter(m => m.program?.id === programId);
        const mappingIds = relevantMappings.map(m => m.id);

        // Filter courses that belong to these mappings
        const filtered = courses.filter(c => mappingIds.includes(c.program_branch_id));
        setFilteredCourses(filtered);
    };

    const selectCourse = async (course) => {
        setSelectedCourse(course);
        // Fetch Course Outcomes for this course
        try {
            const cosRes = await axios.get(`${BASE_URL}/api/qp/course-outcomes/${course.id}`);
            setCourseOutcomes(cosRes.data.data || []);
        } catch (error) {
            console.error('Failed to load course outcomes');
        }
        // Initialize question criteria based on marks distribution
        // For example: MID-1 typically has questions worth 40 marks
        setQuestionCriteria([
            { co_id: '', bloom_id: '', diff_id: '', unit_id: '', marks: 10, count: 1 },
            { co_id: '', bloom_id: '', diff_id: '', unit_id: '', marks: 10, count: 1 },
            { co_id: '', bloom_id: '', diff_id: '', unit_id: '', marks: 20, count: 1 }
        ]);
    };

    const selectRandomQuestions = async () => {
        try {
            const questions = [];

            for (const criteria of questionCriteria) {
                const res = await axios.post(`${BASE_URL}/api/qp/select-random`, {
                    course_id: selectedCourse.id,
                    co_id: criteria.co_id || undefined,
                    bloom_level_id: criteria.bloom_id || undefined,
                    difficulty_level_id: criteria.diff_id || undefined,
                    unit_id: criteria.unit_id || undefined,
                    marks: criteria.marks
                });

                if (res.data.success) {
                    questions.push(res.data.data);
                }
            }

            setSelectedQuestions(questions);
            toast.success(`Selected ${questions.length} questions!`);
        } catch (error) {
            toast.error('Failed to select questions. Make sure you have added questions for this course.');
        }
    };

    const generatePDF = () => {
        toast.info('PDF generation feature coming soon! For now, you can print this page.');
        window.print();
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">🎯 Question Paper Generator</h1>

            {/* Step 1: Select Program */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Step 1: Select Program</h2>
                <select
                    className="w-full border rounded px-3 py-2 text-lg"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                >
                    <option value="">-- Select Program --</option>
                    {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                    ))}
                </select>
            </div>

            {/* Step 2: Select Course */}
            {selectedProgram && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">Step 2: Select Course</h2>
                    <select
                        className="w-full border rounded px-3 py-2 text-lg"
                        value={selectedCourse?.id || ''}
                        onChange={(e) => {
                            const course = filteredCourses.find(c => c.id === parseInt(e.target.value) || c.id === e.target.value);
                            selectCourse(course);
                        }}
                    >
                        <option value="">-- Select Course --</option>
                        {filteredCourses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.course_code} - {course.course_name} (Year: {course.year})
                            </option>
                        ))}
                    </select>
                    {filteredCourses.length === 0 && (
                        <p className="text-red-500 mt-2">No courses found for this program. Please check mappings.</p>
                    )}
                </div>
            )}

            {/* Step 3: Configure QP */}
            {selectedCourse && (
                <>
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <h2 className="text-xl font-bold mb-4">Step 3: Configure Question Paper</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold mb-2">Assessment Type</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={assessmentType}
                                    onChange={(e) => setAssessmentType(e.target.value)}
                                >
                                    <option>MID-1</option>
                                    <option>MID-2</option>
                                    <option>Regular</option>
                                    <option>Supply</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold mb-2">Exam Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-2"
                                    value={examDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setExamDate(e.target.value)}
                                />

                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div><strong>Regulation:</strong> {selectedCourse.regulation?.name}</div>
                                <div><strong>Year:</strong> {selectedCourse.year}</div>
                                <div><strong>Semester:</strong> {selectedCourse.semester}</div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Configure Questions Criteria */}
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <h2 className="text-xl font-bold mb-4">Step 4: Configure Questions Pattern</h2>
                        <p className="text-sm text-gray-600 mb-4">Define the criteria for each question slot (CO, Bloom Level, Difficulty, Unit, and Marks).</p>

                        {questionCriteria.map((criteria, index) => (
                            <div key={index} className="border-2 border-gray-200 p-4 rounded mb-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg">Question #{index + 1}</h3>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                        onClick={() => {
                                            const newCriteria = questionCriteria.filter((_, i) => i !== index);
                                            setQuestionCriteria(newCriteria);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {/* Course Outcome */}
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Course Outcome</label>
                                        <select
                                            className="border rounded px-2 py-2 w-full text-sm"
                                            value={criteria.co_id || ''}
                                            onChange={(e) => {
                                                const newCriteria = [...questionCriteria];
                                                newCriteria[index].co_id = e.target.value;
                                                setQuestionCriteria(newCriteria);
                                            }}
                                        >
                                            <option value="">Select CO</option>
                                            {courseOutcomes.map(co => (
                                                <option key={co.id} value={co.id}>{co.code}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Bloom Level */}
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Bloom Level</label>
                                        <select
                                            className="border rounded px-2 py-2 w-full text-sm"
                                            value={criteria.bloom_id || ''}
                                            onChange={(e) => {
                                                const newCriteria = [...questionCriteria];
                                                newCriteria[index].bloom_id = e.target.value;
                                                setQuestionCriteria(newCriteria);
                                            }}
                                        >
                                            <option value="">Select Bloom</option>
                                            {bloomLevels.map(bl => (
                                                <option key={bl.id} value={bl.id}>{bl.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Difficulty */}
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Difficulty</label>
                                        <select
                                            className="border rounded px-2 py-2 w-full text-sm"
                                            value={criteria.diff_id || ''}
                                            onChange={(e) => {
                                                const newCriteria = [...questionCriteria];
                                                newCriteria[index].diff_id = e.target.value;
                                                setQuestionCriteria(newCriteria);
                                            }}
                                        >
                                            <option value="">Select Difficulty</option>
                                            {difficultyLevels.map(dl => (
                                                <option key={dl.id} value={dl.id}>{dl.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Unit */}
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Unit</label>
                                        <select
                                            className="border rounded px-2 py-2 w-full text-sm"
                                            value={criteria.unit_id || ''}
                                            onChange={(e) => {
                                                const newCriteria = [...questionCriteria];
                                                newCriteria[index].unit_id = e.target.value;
                                                setQuestionCriteria(newCriteria);
                                            }}
                                        >
                                            <option value="">Select Unit</option>
                                            {units.map(u => (
                                                <option key={u.id} value={u.id}>Unit {u.unit_number}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Marks */}
                                    <div>
                                        <label className="block text-xs font-bold mb-1">Marks</label>
                                        <input
                                            type="number"
                                            className="border rounded px-2 py-2 w-full text-sm"
                                            value={criteria.marks}
                                            onChange={(e) => {
                                                const newCriteria = [...questionCriteria];
                                                newCriteria[index].marks = parseInt(e.target.value) || 0;
                                                setQuestionCriteria(newCriteria);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded text-sm mt-2 hover:bg-blue-600"
                            onClick={() => setQuestionCriteria([...questionCriteria, { co_id: '', bloom_id: '', diff_id: '', unit_id: '', marks: 2, count: 1 }])}
                        >
                            + Add Question Slot
                        </button>
                    </div>

                    {/* Step 5: Auto-select Questions */}
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <h2 className="text-xl font-bold mb-4">Step 5: Generate Questions</h2>
                        <p className="mb-4 text-gray-600">
                            Click the button below to automatically select questions based on the criteria.
                        </p>
                        <button
                            onClick={selectRandomQuestions}
                            className="bg-green-500 text-white px-6 py-3 rounded font-bold text-lg"
                        >
                            🎲 Auto-Select Questions
                        </button>
                    </div>

                    {/* Preview Selected Questions */}
                    {selectedQuestions.length > 0 && (
                        <div className="bg-white p-6 rounded shadow mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Selected Questions</h2>
                                <button
                                    onClick={generatePDF}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    📄 Generate PDF
                                </button>
                            </div>

                            <div className="border-2 border-gray-300 p-8 bg-white">
                                {/* QP Header */}
                                <div className="text-center mb-8 border-b-2 border-gray-800 pb-4">
                                    <div className="flex justify-center items-center gap-4 mb-2">
                                        <img src="/src/assets/gmrit_logo.jpeg" alt="Logo" className="h-20 w-auto" />
                                        <div>
                                            <h1 className="text-2xl font-bold uppercase tracking-wider">GMR Institute of Technology</h1>
                                            <p className="font-bold text-gray-600">An Autonomous Institute Affiliated to JNTUGV</p>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mt-4 underline">{assessmentType} EXAMINATIONS</h2>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-left font-bold text-sm">
                                        <p>Program: {selectedCourse.course_code.includes('B.Tech') ? 'B.Tech' : 'B.Tech'} {selectedCourse.branch?.code}</p>
                                        <p className="text-right">Regulation: {selectedCourse.regulation?.name}</p>
                                        <p>Course: {selectedCourse.course_name} ({selectedCourse.course_code})</p>
                                        <p className="text-right">Date: {new Date(examDate).toLocaleDateString()}</p>
                                        <p>Time: 3 Hours</p>
                                        <p className="text-right">Max. Marks: {selectedQuestions.reduce((sum, q) => sum + q.marks, 0)}</p>
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="space-y-6">
                                    {selectedQuestions.map((q, index) => (
                                        <div key={q.id} className="border-b pb-4">
                                            <div className="flex justify-between">
                                                <span className="font-bold">Q{index + 1}.</span>
                                                <span className="font-bold">[{q.marks} Marks]</span>
                                            </div>
                                            <p className="mt-2 ml-6">{q.question_text}</p>
                                            <div className="mt-2 ml-6 text-sm text-gray-600">
                                                CO: {q.co?.code} | Bloom: {q.bloom_level?.name} | Difficulty: {q.difficulty_level?.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 text-right font-bold">
                                    Total Marks: {selectedQuestions.reduce((sum, q) => sum + q.marks, 0)}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default QPGenerator;
