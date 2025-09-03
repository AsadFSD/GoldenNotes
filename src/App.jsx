import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";  
import Notes from "./pages/Notes"; 
import About from "./pages/About";  
import './App.css'
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/notes" element={<Notes />} />
        <Route path="/about" element={<About />} />  
      </Routes>
    </Router>
  );
}

export default App;
