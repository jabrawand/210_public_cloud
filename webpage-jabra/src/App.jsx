import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'
import Signup from './components/Signup'
import Raceplan from './components/Raceplan'

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/raceplan" element={<Raceplan />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App