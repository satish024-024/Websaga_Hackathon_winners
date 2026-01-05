import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./app/Store";
import Layout from "./Layout";
import Login from "./Pages/Common/Login";
import Attendance from "./Pages/Student/Attendance";
import Courses from "./Pages/Teacher/Courses";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ManageCoursesSupabase from "./Pages/admin/ManageCoursesSupabase";
import ProgramsBranches from "./Pages/admin/ProgramsBranches";
import Regulations from "./Pages/admin/Regulations";
import ManageFaculty from "./Pages/admin/ManageFaculty";
import QuestionBank from "./Pages/admin/QuestionBank";
import QPGenerator from "./Pages/admin/QPGenerator";
import Unauth from "./Pages/admin/Unauth";
import FacultyCourseAllocation from "./Pages/admin/FacultyCourseAllocation";
import FacultyLayout from "./Pages/faculty/FacultyLayout";
import FacultyDashboard from "./Pages/faculty/FacultyDashboard";
import MyCourses from "./Pages/faculty/MyCourses";
import CourseDetails from "./Pages/faculty/CourseDetails";
import MyQuestionPapers from "./Pages/faculty/MyQuestionPapers";




import StudentDetails from "./Pages/Student/StudentDetails";
import UpdateStudentdDetails from "./Pages/Student/UpdateStudentdDetails";
import UpdatePass from "./Pages/Common/UpdatePass";
import Subjects from "./Pages/Teacher/Subjects";
import MarkAttendance from "./Pages/Teacher/MarkAttendance";
import TeacherDetails from "./Pages/Teacher/TeacherDetails";
import ForgetPass from "./Pages/Common/ForgetPassword/ForgetPass";
import VerifyOtp from "./Pages/Common/ForgetPassword/VerifyOtp";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* home route */}
      <Route index element={<Login />} />
      {/* student routes */}
      <Route path="student/:id">
        <Route path="attendance" element={<Attendance />} />
        <Route path="details" element={<StudentDetails />} />
        <Route path="updateDetails" element={<UpdateStudentdDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* teacher routes */}
      <Route path="teacher/:id">
        <Route path="courses" element={<Courses />} />
        <Route
          path="courses/course/:courseId/subjects"
          element={<Subjects />}
        />
        <Route
          path="courses/course/:courseId/subjects/subject/:subId/markAttendance"
          element={<MarkAttendance />}
        />
        <Route path="details" element={<TeacherDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* admin routes with layout */}
      <Route path="admin/adminPanel" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="websaga/courses" element={<ManageCoursesSupabase />} />
        <Route path="websaga/programs" element={<ProgramsBranches />} />
        <Route path="websaga/regulations" element={<Regulations />} />
        <Route path="websaga/faculty" element={<ManageFaculty />} />
        <Route path="faculty-allocation" element={<FacultyCourseAllocation />} />
        <Route path="websaga/questions" element={<QuestionBank />} />
        <Route path="websaga/qp-generator" element={<QPGenerator />} />
      </Route>
      {/* faculty routes */}
      <Route path="faculty" element={<FacultyLayout />}>
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="course/:courseId" element={<CourseDetails />} />
        <Route path="my-qp" element={<MyQuestionPapers />} />
        <Route path="questions" element={<QuestionBank />} />
      </Route>
      {/* unauthorized */}
      <Route path="/unauthorized" element={<Unauth />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      bodyClassName="toastBody"
    />
  </Provider>
);
