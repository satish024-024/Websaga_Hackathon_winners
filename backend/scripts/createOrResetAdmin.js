const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    console.log('🔧 Creating Admin User...\n');

    const adminData = {
        email: 'admin@websaga.com',
        password: 'admin123',
        full_name: 'System Administrator',
        role: 'admin'
    };

    try {
        // Hash password
        const password_hash = await bcrypt.hash(adminData.password, 10);

        // Insert admin
        const { data, error } = await supabase
            .from('users')
            .insert([{
                email: adminData.email,
                password_hash: password_hash,
                full_name: adminData.full_name,
                role: adminData.role,
                is_active: true
            }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                console.log('⚠️  Admin already exists');

                // Update password instead
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ password_hash })
                    .eq('email', adminData.email);

                if (updateError) {
                    console.error('❌ Failed to update password:', updateError.message);
                } else {
                    console.log('✅ Admin password updated to: admin123');
                }
            } else {
                console.error('❌ Error:', error.message);
            }
        } else {
            console.log('✅ Admin created successfully!');
            console.log('\n📧 Email:', adminData.email);
            console.log('🔑 Password:', adminData.password);
            console.log('\nYou can now login with these credentials!\n');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
