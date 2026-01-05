const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const email = 'admin@websaga.com';
const password = 'admin123';

(async () => {
    console.log(`🔍 Debugging login for: ${email}`);

    // 1. Fetch user
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error('❌ Database Error:', error.message);
        return;
    }

    if (!user) {
        console.error('❌ User not found in database!');
        return;
    }

    console.log('✅ User found:', user.email);
    console.log('   Role:', user.role);
    console.log('   Stored Hash:', user.password_hash);

    // 2. Compare Password
    console.log('\n🔐 Testing password comparison...');
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
        console.log('✅ PASSWORD MATCH SUCCESS! Login should work.');
    } else {
        console.error('❌ PASSWORD MISMATCH! The stored hash does not match "admin123".');

        // Try creating a new hash to see why
        const newHash = await bcrypt.hash(password, 10);
        console.log('   New Hash would be:', newHash);
    }
})();
