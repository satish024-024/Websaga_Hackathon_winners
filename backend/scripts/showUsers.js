const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, password, role, emp_id')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('\n=== USERS WITH PASSWORDS ===\n');

    data.forEach((user, i) => {
        console.log(`${i + 1}. ${user.full_name} (${user.role.toUpperCase()})`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: ${user.password}`);
        console.log(`   👤 Emp ID: ${user.emp_id || 'N/A'}`);
        console.log('');
    });

    console.log(`Total users: ${data.length}\n`);
})();
