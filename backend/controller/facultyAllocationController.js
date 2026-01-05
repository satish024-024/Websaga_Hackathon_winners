const supabase = require('../config/supabaseClient');

// ==================== FACULTY COURSE ALLOCATION ====================

// Allocate courses to faculty (Admin only)
const allocateCourseToFaculty = async (req, res) => {
    try {
        const { faculty_id, course_id, academic_year } = req.body;

        const { data, error } = await supabase
            .from('faculty_course_allocations')
            .insert([{
                faculty_id,
                course_id,
                academic_year,
                allocated_by: req.user?.id // Assuming auth middleware sets req.user
            }])
            .select(`
                *,
                faculty:users!faculty_id(id, full_name, email),
                course:courses(id, course_name, course_code)
            `);

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return res.status(400).json({
                    success: false,
                    msg: 'This course is already allocated to this faculty for the given academic year'
                });
            }
            return res.status(400).json({ success: false, msg: error.message });
        }

        return res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all course allocations (Admin)
const getAllAllocations = async (req, res) => {
    try {
        const { academic_year, faculty_id, course_id } = req.query;

        let query = supabase
            .from('faculty_course_allocations')
            .select(`
                *,
                faculty:users!faculty_id(id, full_name, email, emp_id),
                course:courses(id, course_name, course_code, year, semester)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (academic_year) query = query.eq('academic_year', academic_year);
        if (faculty_id) query = query.eq('faculty_id', faculty_id);
        if (course_id) query = query.eq('course_id', course_id);

        const { data, error } = await query;

        if (error) return res.status(400).json({ success: false, msg: error.message });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Get faculty's allocated courses (Faculty view)
const getFacultyAllocatedCourses = async (req, res) => {
    try {
        const { faculty_id } = req.params;
        const { academic_year } = req.query;

        let query = supabase
            .from('faculty_course_allocations')
            .select(`
                *,
                course:courses(
                    id, course_name, course_code, year, semester,
                    regulation:regulations(name),
                    program_branch:program_branch_mappings(
                        program:programs(name, code),
                        branch:branches(name, code)
                    )
                )
            `)
            .eq('faculty_id', faculty_id)
            .eq('is_active', true);

        if (academic_year) query = query.eq('academic_year', academic_year);

        const { data, error } = await query;

        if (error) return res.status(400).json({ success: false, msg: error.message });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete allocation (Admin only)
const deleteAllocation = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('faculty_course_allocations')
            .update({ is_active: false })
            .eq('id', id);

        if (error) return res.status(400).json({ success: false, msg: error.message });
        return res.status(200).json({ success: true, msg: 'Allocation removed successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    allocateCourseToFaculty,
    getAllAllocations,
    getFacultyAllocatedCourses,
    deleteAllocation
};
