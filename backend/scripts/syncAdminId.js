const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const email = 'admin@websaga.com';

(async () => {
    console.log(`🔧 Syncing User ID for: ${email}`);

    // 1. Get Auth ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const authUser = users.find(u => u.email === email);

    if (!authUser) {
        console.error('❌ User not found in Supabase Auth');
        return;
    }
    console.log('✅ Auth ID:', authUser.id);

    // 2. Check Users Table
    const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (!dbUser) {
        console.error('❌ User not found in Users table');
        return;
    }
    console.log('Checking Users Table ID:', dbUser.id);

    if (dbUser.id !== authUser.id) {
        console.log('⚠️  IDs Mismatch! Syncing...');

        // Update ID in users table
        const { error: updateError } = await supabase
            .from('users')
            .update({ id: authUser.id })
            .eq('email', email);

        if (updateError) {
            console.error('❌ Failed to update ID:', updateError.message);
        } else {
            console.log('✅ ID Synced Successfully!');
        }
    } else {
        console.log('✅ IDs already match!');
    }
})();
