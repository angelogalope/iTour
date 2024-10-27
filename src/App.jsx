import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Preloader from './pages/components/Preloader'
import Languages from './pages/Languages';
import Features from './pages/Features';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Languages/>}/>
        <Route path='/features' element={<Features/>}/>
      </Routes>
    </Router>
  )
}

export default App
