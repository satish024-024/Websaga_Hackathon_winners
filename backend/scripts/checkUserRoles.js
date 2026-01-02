const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, full_name, role, is_active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error:', error);
            return;
        }

        console.log('\n=== ALL USERS IN DATABASE ===\n');
        users.forEach(u => {
            console.log(`Email: ${u.email}`);
            console.log(`Name: ${u.full_name || 'N/A'}`);
            console.log(`Role: ${u.role}`);
            console.log(`Active: ${u.is_active}`);
            console.log('---');
        });
        console.log(`Total: ${users.length} users\n`);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
})();
