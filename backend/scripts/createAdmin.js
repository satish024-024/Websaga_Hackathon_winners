const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    try {
        // Delete old admin from database if exists
        await supabase.from('users').delete().eq('email', 'admin@websaga.com');

        // Create new admin in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: 'admin@websaga.com',
            password: 'admin123',
            email_confirm: true,
            user_metadata: {
                full_name: 'System Administrator',
                role: 'admin'
            }
        });

        if (authError) {
            console.log('Auth Error:', authError.message);
            return;
        }

        // Insert into users table
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                email: 'admin@websaga.com',
                password_hash: 'managed_by_supabase_auth',
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true
            }])
            .select();

        if (dbError) {
            console.log('Database Error:', dbError.message);
            return;
        }

        console.log('\n✓ Admin user created successfully!');
        console.log('\nAdmin Login Credentials:');
        console.log('Email: admin@websaga.com');
        console.log('Password: admin123');
        console.log('\nYou can now login with these credentials!');

    } catch (err) {
        console.error('Error:', err.message);
    }
})();
