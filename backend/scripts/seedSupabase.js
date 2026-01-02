require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Seeding Supabase...');

    // 1. Create Admin User
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('admin123', salt);

    const { error: userError } = await supabase
        .from('users')
        .insert([{
            email: 'admin@websaga.com',
            password_hash,
            full_name: 'System Admin',
            role: 'admin'
        }]);

    if (userError) {
        console.log('Note: Admin user might already exist:', userError.message);
    } else {
        console.log('✅ Admin user created: admin@websaga.com / admin123');
    }

    // 2. Create Sample Program (B.Tech)
    const { data: progData, error: progError } = await supabase
        .from('programs')
        .insert([{ name: 'Bachelor of Technology', code: 'B.Tech' }])
        .select();

    if (progError) {
        console.log('Note: Program might exist:', progError.message);
    } else {
        console.log('✅ Program created: B.Tech');
    }

    // 3. Create Sample Branch (CSE)
    const { data: branchData, error: branchError } = await supabase
        .from('branches')
        .insert([{ name: 'Computer Science', code: 'CSE' }])
        .select();

    if (branchError) {
        console.log('Note: Branch might exist:', branchError.message);
    } else {
        console.log('✅ Branch created: CSE');
    }

    // 4. Create Sample Regulation (AR23)
    const { error: regError } = await supabase
        .from('regulations')
        .insert([{ name: 'AR23' }]);

    if (regError) {
        console.log('Note: Regulation might exist:', regError.message);
    } else {
        console.log('✅ Regulation created: AR23');
    }

    // 5. Create Bloom Levels (if not exists)
    // Already done in SQL schema, but good to check access
    const { count } = await supabase
        .from('bloom_levels')
        .select('*', { count: 'exact', head: true });

    console.log(`ℹ️ Bloom levels found: ${count}`);

    console.log('✨ Seeding complete!');
}

seed();
