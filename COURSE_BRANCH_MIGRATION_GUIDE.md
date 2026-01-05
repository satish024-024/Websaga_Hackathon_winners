# Course-Branch Many-to-Many Migration Guide

## Problem Summary
Previously, when you wanted to add the same subject (e.g., "Database Management Systems") to multiple branches (CSE and ECE), you had to create duplicate course records. This was because the `courses` table had a direct `program_branch_id` foreign key, creating a one-to-many relationship.

## Solution
We've implemented a **many-to-many relationship** between courses and branches using a junction table called `course_branch_mappings`. Now:
- One course can be mapped to multiple branches
- No duplicate subject records needed
- Better data integrity and easier management

---

## Migration Steps

### Step 1: Run SQL in Supabase

1. Go to your Supabase Dashboard → SQL Editor
2. Run the following SQL to create the junction table:

```sql
-- Create course_branch_mappings junction table
CREATE TABLE IF NOT EXISTS course_branch_mappings (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE,
    program_branch_id BIGINT REFERENCES program_branch_mappings(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(course_id, program_branch_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_course_branch_course_id ON course_branch_mappings(course_id);
CREATE INDEX IF NOT EXISTS idx_course_branch_program_branch_id ON course_branch_mappings(program_branch_id);
```

### Step 2: Migrate Existing Data

Run the migration script to copy existing course-branch relationships:

```bash
cd backend
node scripts/migrateCourseSchema.js
```

This script will:
- Check your existing courses
- Create mappings in the new `course_branch_mappings` table
- Guide you through removing the old `program_branch_id` column

### Step 3: Remove Old Column

After the data migration completes, run this SQL in Supabase:

```sql
ALTER TABLE courses DROP COLUMN IF EXISTS program_branch_id;
```

### Step 4: Restart Your Backend

```bash
# In the backend directory
npm start
```

---

## Updated API Usage

### Creating a Course (New Way)

**Before (Old):**
```javascript
POST /api/admin/courses
{
  "course_name": "Database Management Systems",
  "course_code": "CS301",
  "program_branch_id": 1,  // Only ONE branch
  "regulation_id": 1,
  "year": 3,
  "semester": 5,
  "course_type": "core",
  "credits": 4
}
```

**After (New):**
```javascript
POST /api/admin/courses
{
  "course_name": "Database Management Systems",
  "course_code": "CS301",
  "program_branch_ids": [1, 2, 3],  // MULTIPLE branches!
  "regulation_id": 1,
  "year": 3,
  "semester": 5,
  "course_type": "core",
  "credits": 4
}
```

### Getting Courses

```javascript
// Get all courses with their branch mappings
GET /api/admin/courses

// Filter courses by a specific program-branch
GET /api/admin/courses?program_branch_id=1
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "course_name": "Database Management Systems",
      "course_code": "CS301",
      "year": 3,
      "semester": 5,
      "course_type": "core",
      "credits": 4,
      "regulation": {
        "name": "R23"
      },
      "course_branches": [
        {
          "id": 1,
          "program_branch": {
            "id": 1,
            "program": { "name": "B.Tech", "code": "BTECH" },
            "branch": { "name": "Computer Science", "code": "CSE" }
          }
        },
        {
          "id": 2,
          "program_branch": {
            "id": 2,
            "program": { "name": "B.Tech", "code": "BTECH" },
            "branch": { "name": "Electronics", "code": "ECE" }
          }
        }
      ]
    }
  ]
}
```

### Adding Branches to Existing Course

```javascript
POST /api/admin/course-branch-mapping
{
  "course_id": 1,
  "program_branch_ids": [4, 5]  // Add more branches
}
```

### Removing a Branch from Course

```javascript
DELETE /api/admin/course-branch-mapping
{
  "course_id": 1,
  "program_branch_id": 2  // Remove one branch
}
```

---

## Benefits

✅ **No Duplicates**: Same subject can be shared across branches  
✅ **Easier Updates**: Change course details once, applies to all branches  
✅ **Better Data Integrity**: Consistent course information  
✅ **Flexible Management**: Add/remove branches from courses anytime  
✅ **Question Bank**: Questions linked to course apply to all its branches  

---

## Database Schema

```
┌─────────────┐         ┌──────────────────────┐         ┌────────────────────────┐
│  courses    │         │ course_branch_       │         │ program_branch_        │
│             │────────<│ mappings             │>────────│ mappings               │
│ id          │         │                      │         │                        │
│ course_name │         │ course_id (FK)       │         │ id                     │
│ course_code │         │ program_branch_id(FK)│         │ program_id (FK)        │
│ year        │         │                      │         │ branch_id (FK)         │
│ semester    │         └──────────────────────┘         └────────────────────────┘
│ ...         │
└─────────────┘
```

---

## Frontend Updates Needed

You'll need to update your course creation forms to allow selecting **multiple branches**. Example:

```jsx
// Instead of single select
<select name="program_branch_id">
  <option value="1">CSE</option>
  <option value="2">ECE</option>
</select>

// Use multi-select or checkboxes
<div>
  <label>
    <input type="checkbox" value="1" /> CSE
  </label>
  <label>
    <input type="checkbox" value="2" /> ECE
  </label>
  <label>
    <input type="checkbox" value="3" /> EEE
  </label>
</div>
```

---

## Troubleshooting

**Issue**: Migration script fails
- **Solution**: Make sure you've created the `course_branch_mappings` table first in Supabase SQL Editor

**Issue**: Foreign key constraint errors
- **Solution**: Ensure your `program_branch_mappings` table exists and has the IDs you're trying to use

**Issue**: Cannot drop `program_branch_id` column
- **Solution**: Make sure all data has been migrated to `course_branch_mappings` first

---

## Need Help?

If you encounter any issues during migration, check:
1. Supabase logs for detailed error messages
2. Backend console for API errors
3. Verify table structure matches the schema above

**Revert Changes**: If needed, you can restore from Supabase's automatic backups in the Database → Backups section.
