const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();

        if (error) {
            console.error('Error listing users:', error);
            return;
        }

        console.log('Total Auth Users:', users.length);
        users.forEach(u => {
            console.log(`- ${u.email} (ID: ${u.id})`);
        });

    } catch (err) {
        console.error('Unexpected error:', err.message);
    }
})();
