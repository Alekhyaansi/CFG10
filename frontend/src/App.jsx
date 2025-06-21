
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from"./pages/admin/adminDashboard"; 
// Assuming this is the correct import path
const Dashboard = () => <h2>Welcome to Dashboard</h2>; // temp placeholder

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
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


    </Routes>
  );
};

export default App;
