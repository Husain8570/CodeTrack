import React from 'react'
import Card from '../components/Card'
import { GiProgression } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';


function Home() {

  const navigate=useNavigate();
  return (
    <div className='bg-gray-800 min-h-screen  text-white'>
      
      <h1 className='text-center pt-7 font-bold text-4xl'>Codeforces Profile Analyser</h1>
   
      <Card/>
      <h1 className='text-center pt-7 font-bold text-4xl'>Track your coding progress</h1>
      <div className='w-full flex justify-center mt-4'><button className='hover:text-3xl border-2 border-white m-auto px-4 py-1 rounded-md text-2xl flex gap-1 items-center cursor-pointer' onClick={()=>{navigate('/problemtracker')}}>Problem Tracker<GiProgression /></button></div>
    </div>
  )
}

export default Home