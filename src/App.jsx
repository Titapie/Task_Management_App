import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from './pages/TaskPage'
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import QuickLogin from './pages/QuickLogin'; // Đảm bảo import đúng
import KanbanPage from './pages/KanbanPage';
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPage from "./pages/admin/AdminPage.jsx";

// Component PrivateRoute để bảo vệ route
const PrivateRoute = ({ children, requireAdmin = false }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to="/quick-login" replace />;
    }

    // Kiểm tra nếu cần quyền admin
    if (requireAdmin) {
        try {
            // Tạo helper function để check admin (tránh circular dependency)
            const isAdmin = () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) return false;
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.Role === 'admin';
                } catch {
                    return false;
                }
            };

            if (!isAdmin()) {
                return <Navigate to="/quick-login" replace />;
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            return <Navigate to="/quick-login" replace />;
        }
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/quick-login" element={
                    <QuickLogin onSuccess={() => {}} />
                } />

                {/* User routes (cần đăng nhập) */}
                <Route path="/" element={
                    <PrivateRoute>
                        <QuickLogin />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                } />
                <Route path="/tasks" element={
                    <PrivateRoute>
                        <TasksPage />
                    </PrivateRoute>
                } />
                <Route path="/tasks/create" element={
                    <PrivateRoute>
                        <CreateTaskPage />
                    </PrivateRoute>
                } />
                <Route path="/tasks/edit/:id" element={
                    <PrivateRoute>
                        <EditTaskPage />
                    </PrivateRoute>
                } />
                <Route path="/tasks/:id" element={
                    <PrivateRoute>
                        <TaskDetailPage />
                    </PrivateRoute>
                } />
                <Route path="/kanban" element={
                    <PrivateRoute>
                        <KanbanPage />
                    </PrivateRoute>
                } />
                <Route path="/projects" element={
                    <PrivateRoute>
                        <ProjectsPage />
                    </PrivateRoute>
                } />
                <Route path="/projects/:id" element={
                    <PrivateRoute>
                        <ProjectDetailPage />
                    </PrivateRoute>
                } />
                <Route path="/projects/:projectId/tasks/create" element={
                    <PrivateRoute>
                        <CreateTaskPage />
                    </PrivateRoute>
                } />

                {/* Admin routes (cần quyền admin) */}
                <Route path="/admin" element={<AdminPage />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />

                    {/* Dashboard page */}
                    <Route path="dashboard" element={<AdminDashboard />} />

                    {/* Users page */}
                    <Route path="users" element={<AdminUsersPage />} />
                </Route>

                {/* Other routes... */}
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/login" element={<QuickLogin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App