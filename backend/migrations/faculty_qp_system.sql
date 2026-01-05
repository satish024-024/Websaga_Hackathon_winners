-- Faculty Question Paper Management System - Database Migration

-- 1. Create QP Status ENUM
CREATE TYPE qp_status AS ENUM (
  'draft',
  'submitted', 
  'approved',
  'rejected',
  'published'
);

-- 2. Create Set Type ENUM
CREATE TYPE set_type AS ENUM ('A', 'B', 'C', 'D');

-- 3. Faculty Course Allocations Table
CREATE TABLE IF NOT EXISTS faculty_course_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  allocated_by UUID REFERENCES users(id), -- Admin who allocated
  allocated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(faculty_id, course_id, academic_year)
);

-- 4. Alter existing question_papers table to add workflow fields
ALTER TABLE question_papers 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS status qp_status DEFAULT 'published',
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS review_comments TEXT,
ADD COLUMN IF NOT EXISTS total_marks INTEGER,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 180,
ADD COLUMN IF NOT EXISTS instructions TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Question Paper Sets Table
CREATE TABLE IF NOT EXISTS question_paper_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qp_id UUID REFERENCES question_papers(id) ON DELETE CASCADE,
  set_type set_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(qp_id, set_type)
);

-- 6. Question Paper Questions Junction Table
CREATE TABLE IF NOT EXISTS question_paper_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qp_set_id UUID REFERENCES question_paper_sets(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  question_number INTEGER NOT NULL, -- Order in the paper
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(qp_set_id, question_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_faculty_allocations_faculty ON faculty_course_allocations(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_allocations_course ON faculty_course_allocations(course_id);
CREATE INDEX IF NOT EXISTS idx_qp_status ON question_papers(status);
CREATE INDEX IF NOT EXISTS idx_qp_created_by ON question_papers(created_by);
CREATE INDEX IF NOT EXISTS idx_qp_sets_qp ON question_paper_sets(qp_id);
CREATE INDEX IF NOT EXISTS idx_qpq_set ON question_paper_questions(qp_set_id);
