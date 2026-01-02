const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    try {
        // Get admin user from database
        const { data: adminUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'admin@websaga.com')
            .single();

        if (fetchError || !adminUser) {
            console.log('Admin user not found in database');
            return;
        }

        console.log('Found admin user:', adminUser.email);

        // Update password in Supabase Auth
        const { data, error } = await supabase.auth.admin.updateUserById(
            adminUser.id,
            { password: 'admin123' }
        );

        if (error) {
            console.log('Error updating password:', error.message);
            return;
        }

        console.log('\n✓ Admin password reset successfully!');
        console.log('\nAdmin Login Credentials:');
        console.log('Email: admin@websaga.com');
        console.log('Password: admin123');

    } catch (err) {
        console.error('Error:', err.message);
    }
})();
