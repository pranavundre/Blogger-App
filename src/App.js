import React from 'react';
import HomePage from './HomePage.js';
import AddBlog from './AddBlog.js';
import ReadBlog from './ReadBlog.js';
import BlogEdit from './EditBlog.js';
import SignIn from './Signup.js';
import './css/AddBlog.css';
import './css/ReadBlog.css';
import './css/EditBlog.css';
import './css/Signup.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div >
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage/>} />
                <Route exact path="/signin" element={<SignIn/>} />
                <Route path="/add" element={<AddBlog/>} />
                <Route path="/show/:id" element={<ReadBlog/>} />
                <Route path="/edit/:id" element={<BlogEdit/>} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
