import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './assets/Navbar'
import Home from './assets/Pages/Home'
import EditBuff from './assets/Pages/EditBuff'
import AddNew from './assets/Pages/AddNew'

function App() {

  return (
    // <>
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="edit" element={<EditBuff />} />
        <Route path="new" element={<AddNew />} />
      </Routes>
    </Router>
      /*{ <ClassList />
    </> }*/
  )
}

export default App
