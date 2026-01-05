const supabase = require('../config/supabaseClient');

// Helper: Shuffle array (for future use if needed)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Helper: Select unique questions matching criteria (VARIANT approach)
async function selectVariantQuestions(criteria, course_id, excludeIds = []) {
    const questions = [];

    for (const c of criteria) {
        let query = supabase
            .from('questions')
            .select('*')
            .eq('course_id', course_id)
            .eq('marks', c.marks)
            .eq('is_active', true)
            .not('id', 'in', `(${excludeIds.join(',') || 'null'})`);

        if (c.co_id) query = query.eq('co_id', c.co_id);
        if (c.bloom_level_id) query = query.eq('bloom_level_id', c.bloom_level_id);
        if (c.difficulty_level_id) query = query.eq('difficulty_level_id', c.difficulty_level_id);
        if (c.unit_id) query = query.eq('unit_id', c.unit_id);

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
            throw new Error(`Not enough questions matching criteria for ${c.marks} marks`);
        }

        // Randomly select one question
        const selected = data[Math.floor(Math.random() * data.length)];
        questions.push(selected);
        excludeIds.push(selected.id); // Ensure no duplicates across sets
    }

    return questions;
}

// ==================== FACULTY QP MANAGEMENT ====================

// Create/Save Draft QP
const createQuestionPaper = async (req, res) => {
    try {
        const {
            course_id,
            assessment_type,
            exam_date,
            academic_year,
            instructions,
            questionCriteria // Array of { co_id, bloom_level_id, difficulty_level_id, unit_id, marks, count }
        } = req.body;

        const created_by = req.user?.id;

        // Calculate total marks
        const total_marks = questionCriteria.reduce((sum, c) => sum + (c.marks * (c.count || 1)), 0);

        // Create QP record
        const { data: qpData, error: qpError } = await supabase
            .from('question_papers')
            .insert([{
                course_id,
                assessment_type,
                exam_date,
                academic_year,
                instructions,
                total_marks,
                created_by,
                status: 'draft'
            }])
            .select()
            .single();

        if (qpError) return res.status(400).json({ success: false, msg: qpError.message });

        return res.status(201).json({
            success: true,
            data: qpData,
            msg: 'Question paper saved as draft'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Update Draft QP
const updateQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Only allow updating draft QPs
        const { data: existing } = await supabase
            .from('question_papers')
            .select('status, created_by')
            .eq('id', id)
            .single();

        if (!existing) {
            return res.status(404).json({ success: false, msg: 'Question paper not found' });
        }

        if (existing.status !== 'draft') {
            return res.status(400).json({ success: false, msg: 'Can only edit draft question papers' });
        }

        if (existing.created_by !== req.user?.id) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        const { data, error } = await supabase
            .from('question_papers')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, msg: error.message });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Submit QP for Approval
const submitQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('question_papers')
            .update({
                status: 'submitted',
                submitted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('created_by', req.user?.id)
            .eq('status', 'draft')
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, msg: error.message });
        if (!data) return res.status(404).json({ success: false, msg: 'Question paper not found or already submitted' });

        return res.status(200).json({
            success: true,
            data,
            msg: 'Question paper submitted for approval'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Get Faculty's Question Papers
const getMyQuestionPapers = async (req, res) => {
    try {
        const { status, course_id } = req.query;
        const faculty_id = req.user?.id;

        let query = supabase
            .from('question_papers')
            .select(`
                *,
                course:courses(id, course_name, course_code),
                reviewed_by_user:users!reviewed_by(full_name)
            `)
            .eq('created_by', faculty_id)
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (course_id) query = query.eq('course_id', course_id);

        const { data, error } = await query;

        if (error) return res.status(400).json({ success: false, msg: error.message });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete Draft QP
const deleteQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('question_papers')
            .delete()
            .eq('id', id)
            .eq('created_by', req.user?.id)
            .eq('status', 'draft');

        if (error) return res.status(400).json({ success: false, msg: error.message });

        return res.status(200).json({ success: true, msg: 'Question paper deleted' });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// ==================== ADMIN QP APPROVAL ====================

// Get All QPs (Admin)
const getAllQuestionPapers = async (req, res) => {
    try {
        const { status, course_id, faculty_id } = req.query;

        let query = supabase
            .from('question_papers')
            .select(`
                *,
                course:courses(id, course_name, course_code),
                created_by_user:users!created_by(id, full_name, email),
                reviewed_by_user:users!reviewed_by(full_name)
            `)
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (course_id) query = query.eq('course_id', course_id);
        if (faculty_id) query = query.eq('created_by', faculty_id);

        const { data, error } = await query;

        if (error) return res.status(400).json({ success: false, msg: error.message });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Approve QP (Admin)
const approveQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { review_comments } = req.body;

        const { data, error } = await supabase
            .from('question_papers')
            .update({
                status: 'approved',
                reviewed_by: req.user?.id,
                reviewed_at: new Date().toISOString(),
                review_comments,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('status', 'submitted')
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, msg: error.message });
        if (!data) return res.status(404).json({ success: false, msg: 'Question paper not found or not in submitted status' });

        return res.status(200).json({
            success: true,
            data,
            msg: 'Question paper approved'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Reject QP (Admin)
const rejectQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { review_comments } = req.body;

        if (!review_comments) {
            return res.status(400).json({ success: false, msg: 'Review comments required for rejection' });
        }

        const { data, error } = await supabase
            .from('question_papers')
            .update({
                status: 'rejected',
                reviewed_by: req.user?.id,
                reviewed_at: new Date().toISOString(),
                review_comments,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('status', 'submitted')
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, msg: error.message });
        if (!data) return res.status(404).json({ success: false, msg: 'Question paper not found or not in submitted status' });

        return res.status(200).json({
            success: true,
            data,
            msg: 'Question paper rejected'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Publish QP (Admin) - Makes it final
const publishQuestionPaper = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('question_papers')
            .update({
                status: 'published',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('status', 'approved')
            .select()
            .single();

        if (error) return res.status(400).json({ success: false, msg: error.message });
        if (!data) return res.status(404).json({ success: false, msg: 'Question paper not found or not approved' });

        return res.status(200).json({
            success: true,
            data,
            msg: 'Question paper published'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// ==================== QUESTION PAPER SETS (Variant Approach) ====================

// Generate 4 Variant Sets (A, B, C, D)
const generateQuestionPaperSets = async (req, res) => {
    try {
        const { qp_id } = req.params;
        const { questionCriteria } = req.body; // Same structure used to create QP

        // Verify QP exists and is approved
        const { data: qp } = await supabase
            .from('question_papers')
            .select('*, course:courses(id)')
            .eq('id', qp_id)
            .single();

        if (!qp || qp.status !== 'approved') {
            return res.status(400).json({ success: false, msg: 'Question paper not approved' });
        }

        const sets = ['A', 'B', 'C', 'D'];
        const usedQuestionIds = [];
        const generatedSets = [];

        for (const setType of sets) {
            // Create set record
            const { data: setData, error: setError } = await supabase
                .from('question_paper_sets')
                .insert([{ qp_id, set_type: setType }])
                .select()
                .single();

            if (setError) {
                return res.status(400).json({ success: false, msg: `Error creating set ${setType}: ${setError.message}` });
            }

            // Select unique questions for this set
            try {
                const questions = await selectVariantQuestions(
                    questionCriteria,
                    qp.course_id,
                    usedQuestionIds
                );

                // Insert questions into junction table
                const qpQuestions = questions.map((q, index) => ({
                    qp_set_id: setData.id,
                    question_id: q.id,
                    question_number: index + 1
                }));

                const { error: junctionError } = await supabase
                    .from('question_paper_questions')
                    .insert(qpQuestions);

                if (junctionError) {
                    return res.status(400).json({ success: false, msg: junctionError.message });
                }

                generatedSets.push({
                    set: setType,
                    set_id: setData.id,
                    questions: questions
                });

            } catch (error) {
                return res.status(400).json({ success: false, msg: error.message });
            }
        }

        return res.status(201).json({
            success: true,
            data: generatedSets,
            msg: '4 variant sets generated successfully'
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Get All Sets for a QP
const getQuestionPaperSets = async (req, res) => {
    try {
        const { qp_id } = req.params;

        const { data, error } = await supabase
            .from('question_paper_sets')
            .select(`
                *,
                questions:question_paper_questions(
                    question_number,
                    question:questions(*)
                )
            `)
            .eq('qp_id', qp_id)
            .order('set_type');

        if (error) return res.status(400).json({ success: false, msg: error.message });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    // Faculty
    createQuestionPaper,
    updateQuestionPaper,
    submitQuestionPaper,
    getMyQuestionPapers,
    deleteQuestionPaper,

    // Admin
    getAllQuestionPapers,
    approveQuestionPaper,
    rejectQuestionPaper,
    publishQuestionPaper,

    // Sets
    generateQuestionPaperSets,
    getQuestionPaperSets
};
