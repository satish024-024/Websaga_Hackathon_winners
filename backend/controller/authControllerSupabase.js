const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login Function
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({ success: false, msg: authError.message });
        }

        // 2. Fetch user details from our 'users' table
        const { data: users, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id) // Join on ID
            .single();

        if (dbError || !users) {
            // Fallback if user in Auth but not in DB (shouldn't happen with proper flow)
            return res.status(404).json({ success: false, msg: "User profile not found" });
        }

        const user = users;

        // 3. Return response (Auth token from Supabase is valid)
        return res.status(200).json({
            success: true,
            token: authData.session.access_token, // Use Supabase token
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
};

// Create User (Admin only)
const createUser = async (req, res) => {
    const { email, password, full_name, role, emp_id, phone, honorific } = req.body;

    try {
        // Create in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name, role, emp_id }
        });

        if (authError) throw authError;

        // Insert into users table (skip password_hash or use dummy)
        const { data, error } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                email,
                // password_hash: null, // No longer needed
                full_name,
                role: role || 'faculty',
                emp_id,
                phone,
                honorific
            }])
            .select();

        if (error) throw error;

        return res.status(201).json({ success: true, data: data[0] });

    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = { login, createUser };
