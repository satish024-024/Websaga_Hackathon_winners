-- Add MCQ support to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'descriptive',
ADD COLUMN IF NOT EXISTS option_a TEXT,
ADD COLUMN IF NOT EXISTS option_b TEXT,
ADD COLUMN IF NOT EXISTS option_c TEXT,
ADD COLUMN IF NOT EXISTS option_d TEXT,
ADD COLUMN IF NOT EXISTS correct_option TEXT;
