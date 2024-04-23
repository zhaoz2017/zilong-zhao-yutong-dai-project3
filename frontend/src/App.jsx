import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react'
import axios from 'axios'
import { AuthProvider } from './AuthContext';
import Navbar from './Navbar';
import Home from './Home'; 
import './App.css'

function App() {

  return (
    <>
        <Navbar />
        <Home />
    </>
  );

}

export default App
