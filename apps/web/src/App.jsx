import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Role dashboards
import SystemAdminDashboard from "./pages/dashboards/SystemAdminDashboard";
import UniversityAdminDashboard from "./pages/dashboards/UniversityAdminDashboard";
import RecruiterDashboard from "./pages/dashboards/RecruiterDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ModuleManagerDashboard from "./pages/dashboards/ModuleManagerDashboard";
import ModuleOperatorDashboard from "./pages/dashboards/ModuleOperatorDashboard";

// Module feature pages
import AssignRolePage from "./pages/module/AssignRolePage";
import SubmitQuestionPage from "./pages/module/SubmitQuestionPage";
import ReviewQueuePage from "./pages/module/ReviewQueuePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Any authenticated user ──────────────────────────── */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ── Role dashboards ─────────────────────────────────── */}
          <Route
            path="/dashboard/system-admin"
            element={
              <ProtectedRoute allowedRoles={["SYSTEM_ADMIN"]}>
                <SystemAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/university-admin"
            element={
              <ProtectedRoute allowedRoles={["UNIVERSITY_ADMIN"]}>
                <UniversityAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/recruiter"
            element={
              <ProtectedRoute allowedRoles={["RECRUITER"]}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/module-manager"
            element={
              <ProtectedRoute allowedRoles={["MODULE_MANAGER"]}>
                <ModuleManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/module-operator"
            element={
              <ProtectedRoute allowedRoles={["MODULE_OPERATOR"]}>
                <ModuleOperatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Module feature pages ─────────────────────────────── */}

          {/* Assign Module Managers — UniAdmin or SysAdmin only */}
          <Route
            path="/module/assign-manager"
            element={
              <ProtectedRoute allowedRoles={["UNIVERSITY_ADMIN", "SYSTEM_ADMIN"]}>
                <AssignRolePage mode="manager" />
              </ProtectedRoute>
            }
          />

          {/* Assign Module Operators — Module Manager only */}
          <Route
            path="/module/assign-operator"
            element={
              <ProtectedRoute allowedRoles={["MODULE_MANAGER"]}>
                <AssignRolePage mode="operator" />
              </ProtectedRoute>
            }
          />

          {/* Submit a question — Manager or Operator */}
          <Route
            path="/module/submit-question"
            element={
              <ProtectedRoute allowedRoles={["MODULE_MANAGER", "MODULE_OPERATOR"]}>
                <SubmitQuestionPage />
              </ProtectedRoute>
            }
          />

          {/* Review queue — Module Manager only */}
          <Route
            path="/module/review"
            element={
              <ProtectedRoute allowedRoles={["MODULE_MANAGER"]}>
                <ReviewQueuePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;