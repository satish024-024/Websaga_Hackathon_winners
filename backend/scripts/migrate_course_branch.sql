-- ============================================
-- Course-Branch Many-to-Many Migration
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- STEP 1: Create the junction table
CREATE TABLE IF NOT EXISTS course_branch_mappings (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    program_branch_id BIGINT REFERENCES program_branch_mappings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, program_branch_id)
);

-- STEP 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_branch_course_id 
    ON course_branch_mappings(course_id);

CREATE INDEX IF NOT EXISTS idx_course_branch_program_branch_id 
    ON course_branch_mappings(program_branch_id);

-- STEP 3: Migrate existing data
-- Copy all course-program_branch relationships to the new table
INSERT INTO course_branch_mappings (course_id, program_branch_id)
SELECT id, program_branch_id 
FROM courses 
WHERE program_branch_id IS NOT NULL
ON CONFLICT (course_id, program_branch_id) DO NOTHING;

-- STEP 4: Verify migration
-- Check how many mappings were created
SELECT COUNT(*) as total_mappings FROM course_branch_mappings;

-- View a sample of the mappings
SELECT 
    cbm.id,
    c.course_code,
    c.course_name,
    b.code as branch_code,
    b.name as branch_name
FROM course_branch_mappings cbm
JOIN courses c ON c.id = cbm.course_id
JOIN program_branch_mappings pbm ON pbm.id = cbm.program_branch_id
JOIN branches b ON b.id = pbm.branch_id
LIMIT 10;

-- STEP 5: Remove old column (ONLY after verifying migration is successful)
-- ⚠️ CAUTION: This will permanently remove the program_branch_id column
-- Uncomment the line below only when you're ready:

-- ALTER TABLE courses DROP COLUMN IF EXISTS program_branch_id;

-- ============================================
-- Migration Complete!
-- ============================================
-- Next: Restart your backend server
-- ============================================
