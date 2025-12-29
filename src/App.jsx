import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TaskPage'
import TaskDetailPage from './pages/TaskDetailPage'
import CreateTaskPage from './pages/CreateTaskPage'
import EditTaskPage from './pages/EditTaskPage'
import KanbanPage from './pages/KanbanPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import { useAuth } from './context/AuthContext'
import ProjectsPage from "./pages/ProjectsPage"
import ProjectDetailPage from "./pages/ProjectDetailPage"
import AddMemberForm from "./components/projects/AddMemberForm"
import AdminRoute from "./routes/AdminRoute.jsx"
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";


function App() {
    const { user, loading, isAuthenticated } = useAuth()

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <Routes>
            {/* Public route */}
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? user?.Role === 'admin'
                            ? <Navigate to="/admin/dashboard" replace />
                            : <Navigate to="/dashboard" replace />
                        : <LoginPage />
                }
            />

            {/* Protected routes with Layout */}
            <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                {/* Main routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/create" element={<CreateTaskPage />} />
                <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />}/>
                <Route path="/tasks/create" element={<CreateTaskPage />} />
                <Route path="/projects/:id/add-members" element={<AddMemberForm />} />

                {/* Default redirect - kiểm tra role */}
                <Route
                    path="/"
                    element={
                        user?.Role === 'admin'
                            ? <Navigate to="/admin/dashboard" replace />
                            : <Navigate to="/dashboard" replace />
                    }
                />
            </Route>

            {/* Admin routes - Sử dụng AdminRoute component có sẵn */}
            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />

                </Route>

            </Route>

            {/* 404 - redirect về trang phù hợp với role */}
            <Route
                path="*"
                element={
                    isAuthenticated
                        ? user?.Role === 'admin'
                            ? <Navigate to="/admin/dashboard" replace />
                            : <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />
        </Routes>
    )
}

export default App