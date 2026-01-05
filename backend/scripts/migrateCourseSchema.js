const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function migrateCourseSchema() {
    console.log('🚀 Starting Course-Branch Schema Migration...\n');

    // Step 1: Create course_branch_mappings table
    console.log('Step 1: Creating course_branch_mappings table...');
    console.log('⚠️  Please run this SQL in your Supabase SQL Editor:\n');

    const createTableSQL = `
-- Create course_branch_mappings junction table
CREATE TABLE IF NOT EXISTS course_branch_mappings (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    program_branch_id BIGINT REFERENCES program_branch_mappings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, program_branch_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_course_branch_course_id ON course_branch_mappings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_branch_program_branch_id ON course_branch_mappings(program_branch_id);
`;

    console.log(createTableSQL);
    console.log('\n✅ After running the SQL above, press Enter to continue...');

    // Wait for user confirmation
    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });

    // Step 2: Migrate existing data
    console.log('\nStep 2: Migrating existing course-branch relationships...');
    const { data: existingCourses, error: fetchError } = await supabase
        .from('courses')
        .select('id, program_branch_id')
        .not('program_branch_id', 'is', null);

    if (fetchError) {
        console.error('❌ Error fetching courses:', fetchError.message);
        return;
    }

    console.log(`Found ${existingCourses?.length || 0} courses to migrate`);

    // Insert into course_branch_mappings
    if (existingCourses && existingCourses.length > 0) {
        const mappings = existingCourses.map(course => ({
            course_id: course.id,
            program_branch_id: course.program_branch_id
        }));

        const { error: insertError } = await supabase
            .from('course_branch_mappings')
            .insert(mappings);

        if (insertError) {
            console.error('❌ Error inserting mappings:', insertError.message);
            return;
        }
        console.log(`✅ Migrated ${mappings.length} course-branch mappings\n`);
    }

    // Step 3: Remove program_branch_id column
    console.log('Step 3: Removing program_branch_id from courses table...');
    console.log('⚠️  Please run this SQL in Supabase SQL Editor:\n');

    const alterTableSQL = `ALTER TABLE courses DROP COLUMN IF EXISTS program_branch_id;`;
    console.log(alterTableSQL);
    console.log('\n');

    console.log('🎉 Migration script completed!');
    console.log('\nNext steps:');
    console.log('1. Run the SQL statements above in Supabase SQL Editor');
    console.log('2. The backend APIs have been updated to use course_branch_mappings');
    console.log('3. You can now add the same course to multiple branches without duplicates!\n');
}

// Run migration
migrateCourseSchema().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
