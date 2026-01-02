const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const branches = [
    { name: 'Computer Science and Engineering', code: 'CSE', is_active: true },
    { name: 'Electronics and Communication Engineering', code: 'ECE', is_active: true },
    { name: 'Electrical and Electronics Engineering', code: 'EEE', is_active: true },
    { name: 'Mechanical Engineering', code: 'MECH', is_active: true },
    { name: 'Civil Engineering', code: 'CIVIL', is_active: true }
];

(async () => {
    for (const b of branches) {
        const { data, error } = await supabase.from('branches').insert([b]).select();
        if (error) {
            console.log('✗ Error:', b.code, error.message);
        } else {
            console.log('✓ Added:', b.code);
        }
    }
    console.log('\nDone! Refresh the Manage Faculty page.');
})();
