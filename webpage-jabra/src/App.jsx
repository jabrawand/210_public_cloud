import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'
import Signup from './components/Signup'
import Raceplan from './components/Raceplan'
import Activities from './components/Activities'
import ActivityDetails from './components/ActivityDetails'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/raceplan" element={<Raceplan />} />
            <Route path="/activities" element={<Activities />} />
            <Route
              path="/activities/:id"
              element={
                <ProtectedRoute>
                  <ActivityDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App