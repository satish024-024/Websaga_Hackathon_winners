const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const ADMIN_EMAIL = 'admin@websaga.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_ID = '790ad850-be5d-4686-95d1-7d487220f25b'; // From debug output

(async () => {
    console.log(`Starting fix for ${ADMIN_EMAIL}...`);

    try {
        // 1. Delete from Supabase Auth
        console.log('1. Deleting from Supabase Auth...');
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(ADMIN_ID);
        if (deleteAuthError) {
            console.log('   Warning: Could not delete from Auth (maybe already gone):', deleteAuthError.message);
        } else {
            console.log('   ✓ Deleted from Auth');
        }

        // 2. Delete from public.users table
        console.log('2. Deleting from public.users table...');
        const { error: deleteDbError } = await supabase.from('users').delete().eq('email', ADMIN_EMAIL);
        if (deleteDbError) {
            console.log('   Warning: Could not delete from DB:', deleteDbError.message);
        } else {
            console.log('   ✓ Deleted from DB');
        }

        // 3. Create fresh Admin User
        console.log('3. Creating fresh Admin User...');
        const { data: authData, error: createAuthError } = await supabase.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: {
                full_name: 'System Administrator',
                role: 'admin'
            }
        });

        if (createAuthError) {
            console.error('   ✗ Failed to create Auth user:', createAuthError.message);
            return;
        }
        console.log('   ✓ Created in Auth with ID:', authData.user.id);

        // 4. Insert into public.users
        console.log('4. Inserting into public.users...');
        const { error: insertError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                email: ADMIN_EMAIL,
                password_hash: 'managed_by_supabase_auth',
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true
            }]);

        if (insertError) {
            console.error('   ✗ Failed to insert into DB:', insertError.message);
            return;
        }
        console.log('   ✓ Inserted into DB');

        console.log('\nSUCCESS! Admin user reset completely.');
        console.log('Login Credentials:');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
})();
