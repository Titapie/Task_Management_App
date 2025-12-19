import { useState } from 'react'
import './App.css'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TasksPage from './pages/TaskPage'
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import QuickLogin from './pages/QuickLogin';
import KanbanPage from './pages/KanbanPage';
import DashboardPage from "./pages/DashboardPage";

function App() {
    const [count, setCount] = useState(0)
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    return (
        <BrowserRouter>
            <QuickLogin onSuccess={() => {}} />
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/create" element={<CreateTaskPage />} />
                <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/kanban" element={<KanbanPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
