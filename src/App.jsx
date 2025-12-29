import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import TaskPage from "./pages/TaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import EditTaskPage from "./pages/EditTaskPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import KanbanPage from "./pages/KanbanPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";

// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProjectsPage from "./pages/admin/AdminProjectsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />

      {/* Protected routes with Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/tasks/create" element={<CreateTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/tasks/:id/edit" element={<EditTaskPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/projects" element={<AdminProjectsPage />} />
            <Route path="/admin/tasks" element={<AdminTasksPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
