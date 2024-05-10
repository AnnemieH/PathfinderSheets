import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './assets/Navbar'
import Home from './assets/Pages/Home'
import EditBuff from './assets/Pages/EditBuff'
import AddNew from './assets/Pages/AddNew'
import Character from './assets/Pages/Character'

function App() {

  return (
    // <>
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/characters" element={<Character />} />
        <Route path="/edit" element={<EditBuff />} />
        <Route path="/new" element={<AddNew />} />
      </Routes>
    </Router>
  )
}

export default App
