import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Compare from './pages/Compare';
import Problem from './pages/Problem';
import Tag from './pages/Tag';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Header from './components/Header';
import ProblemTracker from './pages/ProblemTracker';
import User from './pages/User';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function App() {
  const [islogin, setlogin] = useState(false);

  async function isauth() {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) return; // No token, user is not logged in

    const url = `${SERVER_URL}/api/auth`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Attach token in Authorization header
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (data.success) {
      setlogin(true);
    }
  }

  useEffect(() => {
    isauth();
  }, []);

  return (
    <div>
      <Header islogin={islogin} setlogin={setlogin} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile/:handle' element={<Profile />} />
        <Route path='/compare' element={<Compare />} />
        <Route path='/signup' element={<Signup setlogin={setlogin} />} />
        <Route path='/login' element={<Login setlogin={setlogin} />} />
        <Route path='/problemGraph/:handle' element={<Problem />} />
        <Route path='/problemtracker' element={<ProblemTracker />} />
        <Route path='/tagGraph/:handle' element={<Tag />} />
        <Route path='/user' element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
