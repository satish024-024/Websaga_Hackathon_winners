# WEBSAGA Academic ERP - Question Paper Generation System

## 🚀 Project Overview
WEBSAGA is a comprehensive Academic ERP solution designed specifically for **GMR Institute of Technology**. The core capability of this system is an intelligent **Question Paper Generator** that automates the process of creating exam papers based on strict academic criteria (Bloom's Taxonomy, Course Outcomes, Difficulty Levels).

This project has been re-architected to use **Supabase (PostgreSQL)** for robust data management, replacing the legacy MongoDB system.

---

## 🏗️ Architecture
The project follows a modern **Client-Server Architecture**:

- **Frontend (Client)**: A Single Page Application (SPA) built with React.js that provides an interactive UI for Admins and Faculty.
- **Backend (Server)**: A RESTful API built with Node.js & Express that handles business logic, algorithmic question selection, and authentication.
- **Database (Cloud)**: **Supabase** (PostgreSQL) is the relational database storing all academic data (Programs, Courses, Questions, Users).

### Data Flow
1. **User Action**: Admin selects criteria (e.g., "Give me 2 questions of 10 marks for Unit 1").
2. **API Request**: Frontend sends a POST request to `/api/qp/select-random`.
3. **Logic Layer**: Backend algorithmic logic shuffles and filters questions from the database.
4. **Database Query**: Supabase executes optimized SQL queries to fetch matching records.
5. **Response**: The selected questions are returned and rendered as a formatted PDF-ready exam paper.

### Routing Architecture
The application uses **React Router v6** with nested routes for modular navigation:

- **Student Routes**: `/student/:id/attendance`, `/student/:id/details`
- **Teacher Routes**: `/teacher/:id/courses`, `/teacher/:id/courses/course/:courseId/subjects`
- **Admin Routes**: All admin pages use a shared `AdminLayout` wrapper at `/admin/adminPanel`:
  - Dashboard: `/admin/adminPanel` (default)
  - Programs & Branches: `/admin/adminPanel/websaga/programs`
  - Regulations: `/admin/adminPanel/websaga/regulations`
  - Courses: `/admin/adminPanel/websaga/courses`
  - Faculty: `/admin/adminPanel/websaga/faculty`
  - Question Bank: `/admin/adminPanel/websaga/questions`
  - QP Generator: `/admin/adminPanel/websaga/qp-generator`

This pattern enables:
✅ Shared navigation/header across all admin pages  
✅ Consistent layout without code duplication  
✅ Easier state management and authentication checks

---

## 💻 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: TailwindCSS (for modern, responsive UI)
- **State Management**: Redux Toolkit (for user session management)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, Body-Parser
- **Security**: BCrypt (Password Hashing), JWT (JSON Web Tokens)

### Database & Cloud
- **Platform**: **Supabase**
- **Type**: PostgreSQL (Relational Database)
- **Features Used**: 
  - Relational Tables (Foreign Keys for data integrity)
  - Row Level Security (RLS) capable
  - Real-time subscriptions (future scope)

---

## 🔑 Key Features
1. **Academic Structure Management**:
   - Manage Programs (B.Tech, M.Tech)
   - Manage Branches (CSE, ECE, etc.)
   - Manage Regulations (AR21, AR23) & Courses

2. **Question Bank**:
   - Add questions with detailed metadata:
     - **Bloom's Level** (Remember, Understand, Apply...)
     - **Difficulty** (Easy, Medium, Hard)
     - **Course Outcome (CO)** Mapping
     - **Marks** & **Units**

3. **User Management**:
   - Role-Based Access Control (Admin, Faculty, Student)
   - Secure Login with auto-generated passwords for faculty

4. **🎯 Intelligent QP Generator**:
   - **Step-by-step Wizard**: Select Program -> Course -> Pattern.
   - **Pattern Configuration**: Define exactly how many questions of what marks you need.
   - **Randomization**: Ensures different questions are picked every time.
   - **Preview & Print**: Generates a professional exam paper layout with GMRIT branding.

---

## 📂 Project Structure

```
websaga/
├── backend/
│   ├── config/
│   │   └── supabaseClient.js    # Supabase connection setup
│   ├── controller/
│   │   ├── adminControllerSupabase.js  # Admin CRUD operations
│   │   ├── authControllerSupabase.js   # Login & user creation
│   │   └── qpControllerSupabase.js     # Question Paper logic
│   ├── routes/
│   │   └── supabaseRoutes.js    # API endpoint definitions
│   ├── middleware/
│   │   ├── Auth.js              # JWT authentication middleware
│   │   └── multer.js            # File upload handler
│   ├── utils/
│   │   ├── cloudinary.js        # Image upload service
│   │   └── academicYear.js      # Academic year utilities
│   └── index.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── Store.js         # Redux store configuration
    │   ├── features/            # Redux slices (user state)
    │   ├── assets/              # Static assets (GMRIT logo, images)
    │   ├── components/          # Reusable UI components (Navbar, etc.)
    │   ├── Pages/
    │   │   ├── Common/          # Login, ForgetPassword, UpdatePass
    │   │   ├── Student/         # Attendance, StudentDetails
    │   │   ├── Teacher/         # Courses, Subjects, MarkAttendance
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx        # Shared admin layout wrapper
    │   │       ├── AdminDashboard.jsx     # Admin dashboard homepage
    │   │       ├── ProgramsBranches.jsx   # Programs & Branches management
    │   │       ├── Regulations.jsx        # Regulations management
    │   │       ├── ManageCoursesSupabase.jsx  # Course CRUD
    │   │       ├── ManageFaculty.jsx      # Faculty management
    │   │       ├── QuestionBank.jsx       # Question repository
    │   │       └── QPGenerator.jsx        # Question Paper generation
    │   ├── constants/
    │   │   └── baseUrl.js       # API base URL configuration
    │   ├── main.jsx             # React Router & App entry point
    │   └── index.css            # Global Tailwind styles
    ├── vite.config.js           # Vite build configuration
    └── tailwind.config.js       # Tailwind CSS customization
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env file with SUPABASE_URL, SUPABASE_KEY, JWT_SECRET, PORT
   npm start
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Access**:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:4000`

---

---

## 🔐 Environment Configuration

### Backend (.env file)
Create a `.env` file in the `backend/` directory with:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=4000

# Email Service (Optional - for OTP/Password Reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend
Update `frontend/src/constants/baseUrl.js`:
```javascript
export const BASE_URL = "http://localhost:4000";
```

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/create-user` - Create new user

### Admin Management
- `POST /api/admin/programs` - Create program
- `GET /api/admin/programs` - Fetch all programs
- `POST /api/admin/branches` - Create branch
- `GET /api/admin/branches` - Fetch all branches
- `POST /api/admin/regulations` - Create regulation
- `GET /api/admin/regulations` - Fetch all regulations
- `POST /api/admin/pb-mapping` - Map program-branch
- `GET /api/admin/pb-mapping` - Get mappings
- `POST /api/admin/courses` - Create course
- `GET /api/admin/courses` - Fetch all courses

### Question Paper System
- `GET /api/plugins` - Get QP plugins/configurations
- `POST /api/course-outcomes` - Create course outcome
- `GET /api/course-outcomes` - Get all outcomes
- `POST /api/questions` - Add question
- `GET /api/questions` - Fetch questions
- `POST /api/qp/select-random` - Generate random question paper

---

## 📊 Database Schema

The PostgreSQL database on Supabase includes these main tables:

- **users** - Admin, Faculty, Student accounts
- **programs** - B.Tech, M.Tech programs
- **branches** - CSE, ECE, Mechanical, etc.
- **regulations** - AR21, AR23, AR24
- **program_branch_mapping** - Program-Branch relationships
- **courses** - Course details (code, name, credits)
- **course_outcomes** - CO1, CO2... learning outcomes
- **questions** - Question bank with metadata
- **faculty** - Faculty profiles and assignments

All tables use foreign keys to maintain referential integrity.

---

**Developed for GMR Institute of Technology**
