const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    console.log('🌱 Seeding plugin data...\n');

    try {
        // 1. Seed Bloom Levels
        console.log('1. Seeding Bloom Levels...');
        const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

        for (const bl of bloomLevels) {
            const { error } = await supabase.from('bloom_levels').insert([{ name: bl }]);
            if (error && !error.message.includes('duplicate')) {
                console.log(`   ✗ Error inserting ${bl}:`, error.message);
            } else if (!error) {
                console.log(`   ✓ Added: ${bl}`);
            }
        }

        // 2. Seed Difficulty Levels
        console.log('\n2. Seeding Difficulty Levels...');
        const difficultyLevels = ['Easy', 'Moderate', 'Hard'];

        for (const dl of difficultyLevels) {
            const { error } = await supabase.from('difficulty_levels').insert([{ name: dl }]);
            if (error && !error.message.includes('duplicate')) {
                console.log(`   ✗ Error inserting ${dl}:`, error.message);
            } else if (!error) {
                console.log(`   ✓ Added: ${dl}`);
            }
        }

        // 3. Units should already exist (seeded by schema), but let's verify
        console.log('\n3. Checking Units...');
        const { data: units } = await supabase.from('units').select('*');
        if (units && units.length > 0) {
            console.log(`   ✓ Found ${units.length} units already seeded`);
        } else {
            console.log('   ⚠ No units found, seeding...');
            for (let i = 1; i <= 5; i++) {
                await supabase.from('units').insert([{ name: `Unit-${i}`, unit_number: i }]);
                console.log(`   ✓ Added: Unit ${i}`);
            }
        }

        console.log('\n✅ Plugin data seeding complete!');
        console.log('\nYou can now use the dropdowns in QP Generator!');
        console.log('Note: Course Outcomes need to be added per course via the Question Bank page.');

    } catch (err) {
        console.error('\n❌ Unexpected error:', err);
    }
})();
