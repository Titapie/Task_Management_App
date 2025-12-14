import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TasksPage from './pages/TaskPage'
import CreateTaskPage from './pages/CreateTaskPage';
import EditTaskPage from './pages/EditTaskPage';
import TaskDetailPage from './pages/TaskDetailPage';
import QuickLogin from './pages/QuickLogin';

function App() {
  const [count, setCount] = useState(0)
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  return (
    <BrowserRouter>
      <QuickLogin onSuccess={() => {}} />
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/create" element={<CreateTaskPage />} />
        <Route path="/tasks/edit/:id" element={<EditTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
