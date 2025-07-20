import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Courses from './pages/Courses'
import AddCourse from './pages/AddCourse'
import CourseDetails from './components/course/CourseDetails'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'
import EditCourse from './components/course/EditCourse'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/add-course" element={<AddCourse />} />
              <Route path="/courses/:courseId" element={<CourseDetails />} />
              <Route path="/courses/:courseId/edit" element={<EditCourse />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
