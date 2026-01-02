const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

(async () => {
    console.log('📝 Adding MCQ support to questions table...\n');

    try {
        // Execute raw SQL to add MCQ columns
        const { error } = await supabase.rpc('exec_sql', {
            sql: `
                ALTER TABLE questions 
                ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'descriptive',
                ADD COLUMN IF NOT EXISTS option_a TEXT,
                ADD COLUMN IF NOT EXISTS option_b TEXT,
                ADD COLUMN IF NOT EXISTS option_c TEXT,
                ADD COLUMN IF NOT EXISTS option_d TEXT,
                ADD COLUMN IF NOT EXISTS correct_option TEXT;
            `
        });

        if (error) {
            console.error('❌ Migration failed:', error.message);
            console.log('\n⚠️  Please run this SQL manually in your Supabase SQL Editor:');
            console.log(`
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'descriptive',
ADD COLUMN IF NOT EXISTS option_a TEXT,
ADD COLUMN IF NOT EXISTS option_b TEXT,
ADD COLUMN IF NOT EXISTS option_c TEXT,
ADD COLUMN IF NOT EXISTS option_d TEXT,
ADD COLUMN IF NOT EXISTS correct_option TEXT;
            `);
        } else {
            console.log('✅ MCQ support added successfully!');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        console.log('\n⚠️  Please run this SQL manually in your Supabase SQL Editor:');
        console.log(`
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'descriptive',
ADD COLUMN IF NOT EXISTS option_a TEXT,
ADD COLUMN IF NOT EXISTS option_b TEXT,
ADD COLUMN IF NOT EXISTS option_c TEXT,
ADD COLUMN IF NOT EXISTS option_d TEXT,
ADD COLUMN IF NOT EXISTS correct_option TEXT;
        `);
    }
})();
