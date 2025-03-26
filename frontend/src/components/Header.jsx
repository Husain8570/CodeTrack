import React from 'react';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Header({ islogin, setlogin }) {
  const navigate = useNavigate();

  async function logoutHandler() {
    const url = `${SERVER_URL}/api/auth/logout`;
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) {
      setlogin(false);
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(url, {
  
        headers: {
          'Authorization': `Bearer ${token}` // Attach token in Authorization header
        }
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("authToken"); // Clear token from storage
        setlogin(false);
        navigate('/login');
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <div className='bg-black text-white flex justify-around items-center flex-col sm:flex-row'>
      <div className='italic font-serif text-3xl font-semibold p-3 cursor-pointer' onClick={() => navigate('/')}>
        CodeTrack
      </div>
      <div className='flex gap-2 items-center'>
        {!islogin && (
          <button className='bg-red-500 px-4 py-1 rounded-md text-xl cursor-pointer hover:bg-red-600' onClick={() => navigate('/signup')}>
            Sign up
          </button>
        )}
        {islogin ? (
          <button className='bg-blue-500 px-4 py-1 rounded-md text-xl cursor-pointer hover:bg-blue-600' onClick={logoutHandler}>
            Logout
          </button>
        ) : (
          <button className='bg-blue-500 px-4 py-1 rounded-md text-xl cursor-pointer hover:bg-blue-600' onClick={() => navigate('/login')}>
            Login
          </button>
        )}
        {islogin && (
          <button className='bg-red-500 px-4 py-1 rounded-md text-xl cursor-pointer hover:bg-red-600' onClick={() => navigate('/user')}>
            Progress
          </button>
        )}
        {islogin && (
          <img src='profile.png' className='h-13 cursor-pointer' onClick={() => navigate('/user')} alt="Profile" />
        )}
      </div>
    </div>
  );
}

export default Header;
