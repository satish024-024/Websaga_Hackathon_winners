require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupInitialData() {
    console.log('🔧 Setting up initial academic data...\n');

    // 1. Programs
    const programs = [
        { name: 'Bachelor of Technology', code: 'B.Tech' },
        { name: 'Master of Technology', code: 'M.Tech' }
    ];

    for (const prog of programs) {
        const { error } = await supabase.from('programs').insert([prog]);
        if (error && !error.message.includes('duplicate')) {
            console.log(`Program ${prog.code}:`, error.message);
        } else {
            console.log(`✅ Program: ${prog.code}`);
        }
    }

    // 2. Branches
    const branches = [
        { name: 'Computer Science Engineering', code: 'CSE' },
        { name: 'Electronics and Communication Engineering', code: 'ECE' },
        { name: 'Electrical and Electronics Engineering', code: 'EEE' },
        { name: 'Mechanical Engineering', code: 'MECH' }
    ];

    for (const branch of branches) {
        const { error } = await supabase.from('branches').insert([branch]);
        if (error && !error.message.includes('duplicate')) {
            console.log(`Branch ${branch.code}:`, error.message);
        } else {
            console.log(`✅ Branch: ${branch.code}`);
        }
    }

    // 3. Regulations
    const regulations = [
        { name: 'AR23' },
        { name: 'AR21' },
        { name: 'AR20' }
    ];

    for (const reg of regulations) {
        const { error } = await supabase.from('regulations').insert([reg]);
        if (error && !error.message.includes('duplicate')) {
            console.log(`Regulation ${reg.name}:`, error.message);
        } else {
            console.log(`✅ Regulation: ${reg.name}`);
        }
    }

    // 4. Create Program-Branch Mappings
    console.log('\n📎 Creating Program-Branch Mappings...');

    const { data: btechData } = await supabase
        .from('programs')
        .select('id')
        .eq('code', 'B.Tech')
        .single();

    const { data: branchesData } = await supabase
        .from('branches')
        .select('id,code');

    if (btechData && branchesData) {
        for (const branch of branchesData) {
            const { error } = await supabase
                .from('program_branch_mappings')
                .insert([{
                    program_id: btechData.id,
                    branch_id: branch.id
                }]);

            if (error && !error.message.includes('duplicate')) {
                console.log(`  Mapping B.Tech-${branch.code}:`, error.message);
            } else {
                console.log(`  ✅ B.Tech - ${branch.code}`);
            }
        }
    }

    console.log('\n✨ Initial setup complete!');
    console.log('\nYou can now:');
    console.log('1. Go to http://localhost:5173/admin/adminPanel/websaga/courses');
    console.log('2. Add courses using the form');
}

setupInitialData();
