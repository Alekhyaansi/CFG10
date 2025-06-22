
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from"./pages/admin/adminDashboard"; 
import WQCDashboard from "./pages/wqc/WQCDashboard";
import CourseDetails from "./pages/wqc/CourseDetails";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import CreateAssessment from "./pages/trainer/CreateAssessment";
import TrainerAssessments from "./pages/trainer/TrainerAssessments";  
import TrainerCourseQuestions from "./pages/trainer/TrainerCourseQuestions";
import Home from "./pages/Home";

// Assuming this is the correct import path
const Dashboard = () => <h2>Welcome to Dashboard</h2>; // temp placeholder

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/wqc-dashboard" element={
          <ProtectedRoute allowedRoles={['WQC']}>
            <WQCDashboard />
          </ProtectedRoute>
        }/>
      <Route path="/wqc/course-detail/:id" element={
          <ProtectedRoute allowedRoles={['WQC']}>
            <CourseDetails />
          </ProtectedRoute>
        }/>

      <Route path="/trainer-dashboard" element={
          <ProtectedRoute allowedRoles={['Trainer']}>
            <TrainerDashboard />
          </ProtectedRoute>
        }/>

      <Route path="/trainer/create-assessment" element={
        <ProtectedRoute allowedRoles={['Trainer']}>
          <CreateAssessment />
        </ProtectedRoute>
      } />

      <Route path="/trainer/assessments" element={
  <ProtectedRoute allowedRoles={['Trainer']}>
    <TrainerAssessments />
  </ProtectedRoute>
} />
      <Route path="/trainer/course/questions" element={
  <ProtectedRoute allowedRoles={['Trainer']}>
    <TrainerCourseQuestions />
  </ProtectedRoute>
} />


    </Routes>
  );
};

export default App;
