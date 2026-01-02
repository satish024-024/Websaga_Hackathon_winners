const supabase = require('../config/supabaseClient');

// --- PROGRAMS ---
const createProgram = async (req, res) => {
    const { name, code } = req.body;
    const { data, error } = await supabase
        .from('programs')
        .insert([{ name, code }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getPrograms = async (req, res) => {
    const { data, error } = await supabase.from('programs').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const updateProgram = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    const { data, error } = await supabase
        .from('programs')
        .update({ name, code })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Program not found' });
    return res.status(200).json({ success: true, data: data[0] });
};

const deleteProgram = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('programs')
        .update({ is_active: false })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Program not found' });
    return res.status(200).json({ success: true, msg: 'Program deactivated successfully' });
};

const toggleProgramStatus = async (req, res) => {
    const { id } = req.params;

    const { data: currentData } = await supabase
        .from('programs')
        .select('is_active')
        .eq('id', id)
        .single();

    if (!currentData) return res.status(404).json({ success: false, msg: 'Program not found' });

    const { data, error } = await supabase
        .from('programs')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data: data[0] });
};


// --- BRANCHES ---
const createBranch = async (req, res) => {
    const { name, code } = req.body;
    const { data, error } = await supabase
        .from('branches')
        .insert([{ name, code }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getBranches = async (req, res) => {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const updateBranch = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;

    const { data, error } = await supabase
        .from('branches')
        .update({ name, code })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Branch not found' });
    return res.status(200).json({ success: true, data: data[0] });
};

const deleteBranch = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('branches')
        .update({ is_active: false })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Branch not found' });
    return res.status(200).json({ success: true, msg: 'Branch deactivated successfully' });
};

const toggleBranchStatus = async (req, res) => {
    const { id } = req.params;

    const { data: currentData } = await supabase
        .from('branches')
        .select('is_active')
        .eq('id', id)
        .single();

    if (!currentData) return res.status(404).json({ success: false, msg: 'Branch not found' });

    const { data, error } = await supabase
        .from('branches')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data: data[0] });
};


// --- REGULATIONS ---
const createRegulation = async (req, res) => {
    const { name } = req.body;
    const { data, error } = await supabase
        .from('regulations')
        .insert([{ name }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getRegulations = async (req, res) => {
    const { data, error } = await supabase.from('regulations').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const updateRegulation = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const { data, error } = await supabase
        .from('regulations')
        .update({ name })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Regulation not found' });
    return res.status(200).json({ success: true, data: data[0] });
};

const deleteRegulation = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('regulations')
        .update({ is_active: false })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, msg: 'Regulation not found' });
    return res.status(200).json({ success: true, msg: 'Regulation deactivated successfully' });
};

const toggleRegulationStatus = async (req, res) => {
    const { id } = req.params;

    const { data: currentData } = await supabase
        .from('regulations')
        .select('is_active')
        .eq('id', id)
        .single();

    if (!currentData) return res.status(404).json({ success: false, msg: 'Regulation not found' });

    const { data, error } = await supabase
        .from('regulations')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data: data[0] });
};

// --- MAPPINGS (Program-Branch) ---
const mapProgramBranch = async (req, res) => {
    const { program_id, branch_id } = req.body;
    const { data, error } = await supabase
        .from('program_branch_mappings')
        .insert([{ program_id, branch_id }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getProgramBranchMappings = async (req, res) => {
    const { data, error } = await supabase
        .from('program_branch_mappings')
        .select(`
      id,
      program_id,
      branch_id,
      program:programs(id, name, code),
      branch:branches(id, name, code)
    `);

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

// --- COURSES ---
const createCourse = async (req, res) => {
    const {
        course_name,
        course_code,
        program_branch_id,
        regulation_id,
        year,
        semester,
        course_type,
        elective_type,
        credits
    } = req.body;

    const { data, error } = await supabase
        .from('courses')
        .insert([{
            course_name,
            course_code,
            program_branch_id,
            regulation_id,
            year,
            semester,
            course_type,
            elective_type,
            credits
        }])
        .select();

    if (error) {
        console.error('Course creation error:', error);
        console.error('Request body:', req.body);
        return res.status(400).json({ success: false, msg: error.message, details: error });
    }
    return res.status(201).json({ success: true, data: data[0] });
};

const getCourses = async (req, res) => {
    // Filter by program if provided query param
    // But standard list first
    const { data, error } = await supabase
        .from('courses')
        .select(`
      *,
      regulation:regulations(name)
    `);

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

module.exports = {
    createProgram, getPrograms, updateProgram, deleteProgram, toggleProgramStatus,
    createBranch, getBranches, updateBranch, deleteBranch, toggleBranchStatus,
    createRegulation, getRegulations, updateRegulation, deleteRegulation, toggleRegulationStatus,
    mapProgramBranch, getProgramBranchMappings,
    createCourse, getCourses
};


