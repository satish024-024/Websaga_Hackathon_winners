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


// --- COURSES (UPDATED FOR MANY-TO-MANY) ---
const createCourse = async (req, res) => {
    const {
        course_name,
        course_code,
        program_branch_ids, // Changed: Now accepts array of program_branch_ids
        regulation_id,
        year,
        semester,
        course_type,
        elective_type,
        credits
    } = req.body;

    // Step 1: Create the course (without program_branch_id)
    const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert([{
            course_name,
            course_code,
            regulation_id,
            year,
            semester,
            course_type,
            elective_type,
            credits
        }])
        .select()
        .single();

    if (courseError) {
        console.error('Course creation error:', courseError);
        return res.status(400).json({ success: false, msg: courseError.message, details: courseError });
    }

    // Step 2: Create course-branch mappings
    if (program_branch_ids && Array.isArray(program_branch_ids) && program_branch_ids.length > 0) {
        const mappings = program_branch_ids.map(pb_id => ({
            course_id: courseData.id,
            program_branch_id: pb_id
        }));

        const { error: mappingError } = await supabase
            .from('course_branch_mappings')
            .insert(mappings);

        if (mappingError) {
            console.error('Course-branch mapping error:', mappingError);
            // Rollback: delete the course
            await supabase.from('courses').delete().eq('id', courseData.id);
            return res.status(400).json({
                success: false,
                msg: 'Failed to create course-branch mappings',
                details: mappingError
            });
        }
    }

    return res.status(201).json({ success: true, data: courseData });
};

const getCourses = async (req, res) => {
    const { program_branch_id } = req.query;

    // Simplified query - get courses with basic info only
    let query = supabase
        .from('courses')
        .select(`
            *,
            regulation:regulations(name),
            program_branch:program_branch_mappings(
                id,
                program:programs(id, name, code),
                branch:branches(id, name, code)
            )
        `);

    if (program_branch_id) {
        query = query.eq('program_branch_id', program_branch_id);
    }

    const { data, error } = await query;

    if (error) return res.status(400).json({ success: false, msg: error.message });

    return res.status(200).json({ success: true, data });
};

// Add branches to an existing course
const addCourseBranchMapping = async (req, res) => {
    const { course_id, program_branch_ids } = req.body;

    if (!program_branch_ids || !Array.isArray(program_branch_ids)) {
        return res.status(400).json({
            success: false,
            msg: 'program_branch_ids must be an array'
        });
    }

    const mappings = program_branch_ids.map(pb_id => ({
        course_id,
        program_branch_id: pb_id
    }));

    const { data, error } = await supabase
        .from('course_branch_mappings')
        .insert(mappings)
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data });
};

// Remove a branch from a course
const removeCourseBranchMapping = async (req, res) => {
    const { course_id, program_branch_id } = req.body;

    const { error } = await supabase
        .from('course_branch_mappings')
        .delete()
        .eq('course_id', course_id)
        .eq('program_branch_id', program_branch_id);

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, msg: 'Mapping removed successfully' });
};

module.exports = {
    createProgram, getPrograms, updateProgram, deleteProgram, toggleProgramStatus,
    createBranch, getBranches, updateBranch, deleteBranch, toggleBranchStatus,
    createRegulation, getRegulations, updateRegulation, deleteRegulation, toggleRegulationStatus,
    mapProgramBranch, getProgramBranchMappings,
    createCourse, getCourses,
    addCourseBranchMapping, removeCourseBranchMapping
};
