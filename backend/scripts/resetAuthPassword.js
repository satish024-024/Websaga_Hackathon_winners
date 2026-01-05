const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const email = 'admin@websaga.com';
const newPassword = 'admin123';

(async () => {
    console.log(`🔧 Resetting Supabase Auth password for: ${email}`);

    // 1. Find the user ID in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('❌ Error listing users:', listError.message);
        return;
    }

    const adminUser = users.find(u => u.email === email);

    if (!adminUser) {
        console.error('❌ User not found in Supabase Auth! Creating it...');
        // Create if missing
        const { data, error } = await supabase.auth.admin.createUser({
            email: email,
            password: newPassword,
            email_confirm: true
        });
        if (error) console.error('❌ Creation failed:', error.message);
        else console.log('✅ Created new admin user in Auth:', data.user.id);
        return;
    }

    console.log('✅ Found User ID:', adminUser.id);

    // 2. Update Password
    const { data, error } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: newPassword }
    );

    if (error) {
        console.error('❌ Failed to update password:', error.message);
    } else {
        console.log('✅ Password successfully updated to: admin123');
        console.log('👉 Try logging in now!');
    }
})();
