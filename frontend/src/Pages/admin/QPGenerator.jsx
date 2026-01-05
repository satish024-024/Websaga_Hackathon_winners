import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/baseUrl';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    const randomizeSlot = (index) => {
        const randomCO = courseOutcomes.length > 0 ? courseOutcomes[Math.floor(Math.random() * courseOutcomes.length)].id : '';
        const randomBloom = bloomLevels.length > 0 ? bloomLevels[Math.floor(Math.random() * bloomLevels.length)].id : '';
        const randomDiff = difficultyLevels.length > 0 ? difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)].id : '';

        const newCriteria = [...questionCriteria];
        newCriteria[index] = {
            ...newCriteria[index],
            co_id: randomCO,
            bloom_id: randomBloom,
            diff_id: randomDiff
        };
        setQuestionCriteria(newCriteria);
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
                                    <div>
                                        <button
                                            className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 mr-2"
                                            onClick={() => randomizeSlot(index)}
                                        >
                                            🎲 Random
                                        </button>
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
                        <div className="bg-white p-6 rounded shadow mb-6 print:p-0 print:shadow-none">
                            <div className="flex justify-between items-center mb-4 print:hidden">
                                <h2 className="text-xl font-bold">Selected Questions Preview</h2>
                                <button
                                    onClick={generatePDF}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    📄 Print / Save as PDF
                                </button>
                            </div>

                            <div className="border border-gray-400 p-8 bg-white print:border-0 print:p-0">
                                {/* QP Header */}
                                <div className="text-center mb-2">
                                    <div className="flex flex-col items-center mb-2">
                                        <h1 className="text-xl font-bold uppercase">GMR Institute of Technology</h1>
                                        <p className="text-sm font-semibold">(An Autonomous Institute Affiliated to JNTUGV)</p>
                                        <p className="text-sm">Department of {selectedCourse.program_branch?.branch?.name || 'Engineering'}</p>
                                    </div>

                                    <h2 className="text-lg font-bold uppercase underline mb-2">{assessmentType} EXAMINATIONS</h2>

                                    <div className="w-full border-t border-l border-r border-black text-sm">
                                        <div className="grid grid-cols-[auto_1fr_auto] border-b border-black">
                                            <div className="p-1 font-bold border-r border-black">A.Y: 2024-25</div>
                                            <div className="p-1 text-center font-bold border-r border-black">SET-1</div>
                                            <div className="p-1 font-bold">Max. Marks: {selectedQuestions.reduce((sum, q) => sum + q.marks, 0)}</div>
                                        </div>
                                        <div className="grid grid-cols-[auto_1fr_auto] border-b border-black">
                                            <div className="p-1 border-r border-black"><span className="font-bold">Course:</span> {selectedCourse.course_name}</div>
                                            <div className="p-1 text-center border-r border-black"><span className="font-bold">Course Code:</span> {selectedCourse.course_code}</div>
                                            <div className="p-1"><span className="font-bold">Duration:</span> 90 Min</div>
                                        </div>
                                        <div className="grid grid-cols-[auto_1fr_auto] border-b border-black">
                                            <div className="p-1 border-r border-black"><span className="font-bold">Branch:</span> {selectedCourse.program_branch?.branch?.code || 'CE'}</div>
                                            <div className="p-1 text-center border-r border-black"><span className="font-bold">Year:</span> {selectedCourse.year}</div>
                                            <div className="p-1"><span className="font-bold">Semester:</span> {selectedCourse.semester}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions Table */}
                                <div className="w-full mb-6">
                                    <table className="w-full border-collapse border border-black text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 print:bg-transparent">
                                                <th className="border border-black p-2 w-12">Q.No</th>
                                                <th className="border border-black p-2">Questions</th>
                                                <th className="border border-black p-2 w-16">Marks</th>
                                                <th className="border border-black p-2 w-20">CO</th>
                                                <th className="border border-black p-2 w-16">BL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedQuestions.map((q, index) => (
                                                <tr key={q.id}>
                                                    <td className="border border-black p-2 text-center align-top font-bold">{index + 1}</td>
                                                    <td className="border border-black p-2 align-top">
                                                        <p>{q.question_text}</p>
                                                        {q.image_url && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={q.image_url}
                                                                    alt="Question Diagram"
                                                                    className="max-h-32 object-contain border"
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="border border-black p-2 text-center align-top">{q.marks}</td>
                                                    <td className="border border-black p-2 text-center align-top">{q.co?.code}</td>
                                                    <td className="border border-black p-2 text-center align-top">
                                                        {/* Map Bloom Name to Level L1-L6 if possible, else take first letter or full name */}
                                                        {q.bloom_level?.name?.includes('Remember') ? 'L1' :
                                                            q.bloom_level?.name?.includes('Understand') ? 'L2' :
                                                                q.bloom_level?.name?.includes('Apply') ? 'L3' :
                                                                    q.bloom_level?.name?.includes('Analyze') ? 'L4' :
                                                                        q.bloom_level?.name?.includes('Evaluate') ? 'L5' :
                                                                            q.bloom_level?.name?.includes('Create') ? 'L6' : q.bloom_level?.name}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Analysis - Charts */}
                                {/* Footer Analysis - Charts */}
                                <div className="break-inside-avoid mt-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                                        {/* 1. Bloom's Level Pie Chart */}
                                        <div className="border border-black p-2 bg-white flex flex-col items-center">
                                            <h3 className="text-center font-bold text-sm mb-2 w-full bg-gray-100 border-b border-black">Bloom's Level wise Marks Distribution</h3>
                                            <div className="flex justify-center items-center">
                                                <PieChart width={300} height={250}>
                                                    <Pie
                                                        data={Object.entries(selectedQuestions.reduce((acc, q) => {
                                                            const blName = q.bloom_level?.name || '';
                                                            let bl = 'Unknown';
                                                            if (blName.includes('Remember')) bl = 'L1';
                                                            else if (blName.includes('Understand')) bl = 'L2';
                                                            else if (blName.includes('Apply')) bl = 'L3';
                                                            else if (blName.includes('Analyze')) bl = 'L4';
                                                            else if (blName.includes('Evaluate')) bl = 'L5';
                                                            else if (blName.includes('Create')) bl = 'L6';
                                                            else bl = blName || 'Unknown';

                                                            acc[bl] = (acc[bl] || 0) + (parseInt(q.marks) || 0);
                                                            return acc;
                                                        }, {})).map(([name, value]) => ({ name, value }))}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {[0, 1, 2, 3, 4, 5].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'][index % 6]} />
                                                        ))}
                                                    </Pie>
                                                    <Legend verticalAlign="bottom" height={36} />
                                                    <Tooltip />
                                                </PieChart>
                                            </div>
                                        </div>

                                        {/* 2. CO Mark Distribution Bar Chart */}
                                        <div className="border border-black p-2 bg-white flex flex-col items-center">
                                            <h3 className="text-center font-bold text-sm mb-2 w-full bg-gray-100 border-b border-black">Course Outcome wise Mark Distribution</h3>
                                            <div className="flex justify-center items-center">
                                                <BarChart
                                                    width={300}
                                                    height={250}
                                                    data={Object.entries(selectedQuestions.reduce((acc, q) => {
                                                        const co = q.co?.code || 'Unknown';
                                                        acc[co] = (acc[co] || 0) + (parseInt(q.marks) || 0);
                                                        return acc;
                                                    }, {})).map(([name, marks]) => ({ name, marks }))}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Bar dataKey="marks" fill="#8884d8" label={{ position: 'top' }}>
                                                        {[0, 1, 2, 3, 4, 5].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'][index % 6]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </div>
                                        </div>

                                        {/* 3. CO Percentage Pie Chart */}
                                        <div className="border border-black p-2 bg-white flex flex-col items-center">
                                            <h3 className="text-center font-bold text-sm mb-2 w-full bg-gray-100 border-b border-black">COURSE OUTCOME WISE...</h3>
                                            <div className="flex justify-center items-center">
                                                <PieChart width={300} height={250}>
                                                    <Pie
                                                        data={Object.entries(selectedQuestions.reduce((acc, q) => {
                                                            const co = q.co?.code || 'Unknown';
                                                            acc[co] = (acc[co] || 0) + (parseInt(q.marks) || 0);
                                                            return acc;
                                                        }, {})).map(([name, value]) => ({ name, value }))}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={true}
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#82ca9d"
                                                        dataKey="value"
                                                    >
                                                        {[0, 1, 2, 3, 4, 5].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'][index % 6]} />
                                                        ))}
                                                    </Pie>
                                                    <Legend verticalAlign="bottom" height={36} />
                                                    <Tooltip />
                                                </PieChart>
                                            </div>
                                        </div>

                                    </div>

                                    {/* CO Statements */}
                                    <div>
                                        <h3 className="font-bold text-sm mb-1 uppercase text-center">CO Statements</h3>
                                        <table className="w-full border-collapse border border-black text-xs">
                                            <thead>
                                                <tr>
                                                    <th className="border border-black p-1 w-20">CO Code</th>
                                                    <th className="border border-black p-1">Statement</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Deduplicate COs */}
                                                {[...new Set(selectedQuestions.map(q => q.co?.id))].map(coId => {
                                                    const co = courseOutcomes.find(c => c.id === coId);
                                                    if (!co) return null;
                                                    return (
                                                        <tr key={coId}>
                                                            <td className="border border-black p-1 text-center font-bold">{co.code}</td>
                                                            <td className="border border-black p-1">{co.description}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 text-xs">
                                        <p><strong>BL - Bloom's Taxonomy Levels:</strong> L1-Remembering, L2-Understanding, L3-Applying, L4-Analyzing, L5-Evaluating, L6-Creating</p>
                                        <p><strong>CO - Course Outcomes</strong></p>
                                    </div>
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
