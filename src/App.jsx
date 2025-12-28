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
import QuickLogin from './pages/QuickLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import { useAuth } from './context/AuthContext'


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
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <QuickLogin />}
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

                {/* Admin route */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

export default App