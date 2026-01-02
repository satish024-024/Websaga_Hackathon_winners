const supabase = require('../config/supabaseClient');

// --- QUESTIONS ---
const createQuestion = async (req, res) => {
    const {
        course_id,
        co_id,
        bloom_level_id,
        difficulty_level_id,
        unit_id,
        question_text,
        image_url,
        marks,
        created_by,
        question_type,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option
    } = req.body;

    const { data, error } = await supabase
        .from('questions')
        .insert([{
            course_id,
            co_id,
            bloom_level_id,
            difficulty_level_id,
            unit_id,
            question_text,
            image_url,
            marks,
            created_by,
            question_type: question_type || 'descriptive',
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getQuestions = async (req, res) => {
    const { course_id } = req.query;
    let query = supabase.from('questions').select(`
    *,
    bloom_level:bloom_levels(name),
    difficulty_level:difficulty_levels(name),
    unit:units(name),
    co:course_outcomes(code)
  `);

    if (course_id) {
        query = query.eq('course_id', course_id);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

// --- QP GENERATION LOGIC ---

// Helper: Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const selectRandomQuestions = async (req, res) => {
    // Input: Criteria List
    // [ { co_id, bloom_id, diff_id, marks, count: 1 }, ... ]
    // For Hackathon simple version: Request single question matching criteria

    const { course_id, co_id, bloom_level_id, difficulty_level_id, unit_id, marks } = req.body;

    // Fetch ALL matching questions (assuming pool < 1000, this is fine)
    let query = supabase
        .from('questions')
        .select(`
      *,
      co:course_outcomes(code),
      bloom_level:bloom_levels(name),
      difficulty_level:difficulty_levels(name),
      unit:units(unit_number)
    `)
        .eq('course_id', course_id)
        .eq('marks', marks)
        .eq('is_active', true);

    if (co_id) query = query.eq('co_id', co_id);
    if (bloom_level_id) query = query.eq('bloom_level_id', bloom_level_id);
    if (difficulty_level_id) query = query.eq('difficulty_level_id', difficulty_level_id);
    if (unit_id) query = query.eq('unit_id', unit_id);

    const { data, error } = await query;

    if (error) return res.status(400).json({ success: false, msg: error.message });
    if (!data || data.length === 0) {
        return res.status(404).json({ success: false, msg: "No matching questions found" });
    }

    // Shuffle and pick one
    const shuffled = shuffleArray(data);
    const selected = shuffled[0];

    return res.status(200).json({ success: true, data: selected });
};

// --- REFERENCE DATA ---
const getPlugins = async (req, res) => {
    const [blooms, diffs, units] = await Promise.all([
        supabase.from('bloom_levels').select('*'),
        supabase.from('difficulty_levels').select('*'),
        supabase.from('units').select('*')
    ]);

    return res.status(200).json({
        success: true,
        data: {
            blooms: blooms.data,
            difficulties: diffs.data,
            units: units.data
        }
    });
};

const createCourseOutcome = async (req, res) => {
    const { course_id, code, description } = req.body;
    const { data, error } = await supabase
        .from('course_outcomes')
        .insert([{ course_id, code, description }])
        .select();

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(201).json({ success: true, data: data[0] });
};

const getCourseOutcomes = async (req, res) => {
    const { course_id } = req.query;
    const { data, error } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', course_id);

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const getCourseOutcomesByCourseId = async (req, res) => {
    const { course_id } = req.params;
    const { data, error } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', course_id);

    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const getBloomLevels = async (req, res) => {
    const { data, error } = await supabase.from('bloom_levels').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const getDifficultyLevels = async (req, res) => {
    const { data, error } = await supabase.from('difficulty_levels').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

const getUnits = async (req, res) => {
    const { data, error } = await supabase.from('units').select('*');
    if (error) return res.status(400).json({ success: false, msg: error.message });
    return res.status(200).json({ success: true, data });
};

module.exports = {
    createQuestion, getQuestions,
    selectRandomQuestions,
    getPlugins,
    createCourseOutcome, getCourseOutcomes, getCourseOutcomesByCourseId,
    getBloomLevels, getDifficultyLevels, getUnits
};
