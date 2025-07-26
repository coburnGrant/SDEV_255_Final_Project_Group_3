import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './routes/Home'
import Courses from './routes/Courses'
import AddCourse from './routes/AddCourse'
import ProtectedRoute from './routes/ProtectedRoute'

import CourseDetails from './components/course/CourseDetails'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'
import EditCourse from './components/course/EditCourse'
import Login from './routes/Login'
import Register from './routes/Register'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={ <Register />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/add-course" element={
                <ProtectedRoute>
                  <AddCourse />
                </ProtectedRoute>
              } />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/courses/:courseId/edit" element={
                <ProtectedRoute>
                  <EditCourse />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
