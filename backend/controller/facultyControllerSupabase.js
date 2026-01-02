const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

// Generate random password
const generateRandomPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Create single faculty
const createFaculty = async (req, res) => {
    try {
        const { honorific, full_name, emp_id, email, phone, department_branch_id, role } = req.body;

        // Generate random password
        const plainPassword = generateRandomPassword();

        // No need to manually hash for local DB if using Supabase Auth
        // const salt = await bcrypt.genSalt(10);
        // const password_hash = await bcrypt.hash(plainPassword, salt);


        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: plainPassword,
            email_confirm: true,
            user_metadata: {
                full_name: full_name,
                role: role || 'faculty',
                emp_id: emp_id
            }
        });

        if (authError) {
            console.error('Supabase Auth Error:', authError);
            return res.status(400).json({ success: false, msg: authError.message });
        }

        // Insert into users table
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id, // Use Supabase Auth user ID
                email,
                password_hash: 'managed_by_supabase_auth', // Dummy value since Auth handles it
                full_name,
                role: role || 'faculty',
                emp_id,
                phone,
                honorific,
                department_branch_id,
                is_active: true
            }])
            .select();

        if (dbError) {
            console.error('Database Error:', dbError);
            return res.status(400).json({ success: false, msg: dbError.message });
        }

        // Send welcome email to faculty
        const { sendFacultyWelcomeEmail } = require('../utils/emailService');
        const emailResult = await sendFacultyWelcomeEmail(email, full_name, emp_id, plainPassword);

        if (!emailResult.success) {
            console.warn('Email sending failed, but user was created:', emailResult.error);
        }

        // Return success with plain password (Admin can share manually or we send email)
        return res.status(201).json({
            success: true,
            data: userData[0],
            password: plainPassword, // Send back to display to admin
            emailSent: emailResult.success,
            message: emailResult.success
                ? 'Faculty created successfully. Welcome email sent to faculty member.'
                : 'Faculty created successfully. Please share the password manually (email failed).'
        });

    } catch (err) {
        console.error('Create Faculty Error:', err);
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Get all faculty
const getAllFaculty = async (req, res) => {
    try {
        const { department_branch_id, is_active } = req.query;

        let query = supabase
            .from('users')
            .select(`
                *,
                department:branches(id, name, code)
            `)
            .eq('role', 'faculty');

        if (department_branch_id) {
            query = query.eq('department_branch_id', department_branch_id);
        }

        if (is_active !== undefined) {
            query = query.eq('is_active', is_active === 'true');
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ success: false, msg: error.message });
        }

        return res.status(200).json({ success: true, data });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Get faculty by ID
const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                department:branches(id, name, code)
            `)
            .eq('id', id)
            .eq('role', 'faculty')
            .single();

        if (error) {
            return res.status(404).json({ success: false, msg: 'Faculty not found' });
        }

        return res.status(200).json({ success: true, data });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Update faculty
const updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const { honorific, full_name, emp_id, phone, department_branch_id } = req.body;

        const updateData = {
            honorific,
            full_name,
            emp_id,
            phone,
            department_branch_id
        };

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .eq('role', 'faculty')
            .select();

        if (error) {
            return res.status(400).json({ success: false, msg: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, msg: 'Faculty not found' });
        }

        // Also update Supabase Auth user metadata
        await supabase.auth.admin.updateUserById(id, {
            user_metadata: {
                full_name: full_name,
                emp_id: emp_id
            }
        });

        return res.status(200).json({ success: true, data: data[0] });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Delete faculty (soft delete)
const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('users')
            .update({ is_active: false })
            .eq('id', id)
            .eq('role', 'faculty')
            .select();

        if (error) {
            return res.status(400).json({ success: false, msg: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, msg: 'Faculty not found' });
        }

        return res.status(200).json({ success: true, msg: 'Faculty deactivated successfully' });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Toggle faculty status
const toggleFacultyStatus = async (req, res) => {
    try {
        const { id } = req.params;

        // Get current status
        const { data: currentData } = await supabase
            .from('users')
            .select('is_active')
            .eq('id', id)
            .eq('role', 'faculty')
            .single();

        if (!currentData) {
            return res.status(404).json({ success: false, msg: 'Faculty not found' });
        }

        // Toggle status
        const { data, error } = await supabase
            .from('users')
            .update({ is_active: !currentData.is_active })
            .eq('id', id)
            .eq('role', 'faculty')
            .select();

        if (error) {
            return res.status(400).json({ success: false, msg: error.message });
        }

        return res.status(200).json({ success: true, data: data[0] });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// Bulk upload faculty from CSV
const bulkUploadFaculty = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }

        const results = [];
        const errors = [];
        let lineNumber = 1;

        // Parse CSV from buffer
        const stream = Readable.from(req.file.buffer.toString());

        stream
            .pipe(csv())
            .on('data', (row) => {
                lineNumber++;
                results.push({ ...row, lineNumber });
            })
            .on('end', async () => {
                const createdFaculty = [];

                for (const row of results) {
                    try {
                        const { honorific, full_name, emp_id, email, phone, department_branch_id } = row;

                        // Validate required fields
                        if (!email || !full_name || !emp_id) {
                            errors.push({
                                line: row.lineNumber,
                                email: email || 'N/A',
                                error: 'Missing required fields (email, full_name, emp_id)'
                            });
                            continue;
                        }

                        // Generate password
                        const plainPassword = generateRandomPassword();
                        const salt = await bcrypt.genSalt(10);
                        const password_hash = await bcrypt.hash(plainPassword, salt);

                        // Create in Supabase Auth
                        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                            email: email.trim(),
                            password: plainPassword,
                            email_confirm: true,
                            user_metadata: {
                                full_name: full_name.trim(),
                                role: 'faculty',
                                emp_id: emp_id.trim()
                            }
                        });

                        if (authError) {
                            errors.push({
                                line: row.lineNumber,
                                email: email,
                                error: authError.message
                            });
                            continue;
                        }

                        // Insert into database
                        const { data: userData, error: dbError } = await supabase
                            .from('users')
                            .insert([{
                                id: authData.user.id,
                                email: email.trim(),
                                password_hash,
                                full_name: full_name.trim(),
                                role: 'faculty',
                                emp_id: emp_id.trim(),
                                phone: phone?.trim() || null,
                                honorific: honorific?.trim() || null,
                                department_branch_id: department_branch_id?.trim() || null,
                                is_active: true
                            }])
                            .select();

                        if (dbError) {
                            errors.push({
                                line: row.lineNumber,
                                email: email,
                                error: dbError.message
                            });
                            continue;
                        }

                        createdFaculty.push({
                            ...userData[0],
                            password: plainPassword
                        });

                    } catch (err) {
                        errors.push({
                            line: row.lineNumber,
                            email: row.email || 'N/A',
                            error: err.message
                        });
                    }
                }

                return res.status(200).json({
                    success: true,
                    message: `Bulk upload completed. Created: ${createdFaculty.length}, Failed: ${errors.length}`,
                    created: createdFaculty,
                    errors: errors
                });
            })
            .on('error', (err) => {
                return res.status(500).json({ success: false, msg: 'CSV parsing error: ' + err.message });
            });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty,
    toggleFacultyStatus,
    bulkUploadFaculty
};
