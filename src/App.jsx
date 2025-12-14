import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TasksPage from './pages/TaskPage'


import QuickLogin from './pages/QuickLogin';

function App() {
  const [count, setCount] = useState(0)
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  return (
    <>
    <QuickLogin onSuccess={() => setLoggedIn(true)} />
      <TasksPage/>
    </>
  )
}

export default App
