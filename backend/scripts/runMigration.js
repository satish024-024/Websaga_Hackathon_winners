const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    console.log('🚀 Running Faculty QP System Migration...\n');

    try {
        // Read the SQL file
        const sql = fs.readFileSync('./migrations/faculty_qp_system.sql', 'utf8');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(s => s.trim().length > 0 && !s.trim().startsWith('--'));

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i].trim();
            if (!stmt) continue;

            console.log(`Executing statement ${i + 1}/${statements.length}...`);

            // Use raw SQL via query
            const { error } = await supabase.rpc('exec', { sql: stmt });

            if (error) {
                console.error(`❌ Error on statement ${i + 1}:`, error.message);
                console.log('\n⚠️  Please run the migration manually in Supabase SQL Editor');
                console.log('📄 File: backend/migrations/faculty_qp_system.sql\n');
                process.exit(1);
            }
        }

        console.log('\n✅ Migration completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Refresh your browser');
        console.log('2. Login as faculty');
        console.log('3. Click "My Question Papers"\n');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n📋 Manual Migration Required:');
        console.log('1. Go to Supabase Dashboard → SQL Editor');
        console.log('2. Open: backend/migrations/faculty_qp_system.sql');
        console.log('3. Copy and paste the SQL');
        console.log('4. Click Run\n');
    }
})();
