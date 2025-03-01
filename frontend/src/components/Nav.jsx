import React from 'react'
import { Link } from 'react-router-dom'
function Nav({handle}) {
  return (
    <div className='bg-black text-white w-full h-15 flex justify-center gap-x-7 items-center text-xl '>
        <Link to={`/problemGraph/${handle}`} className='hover:text-blue-500'>View problem graph</Link>
        <Link to={`/tagGraph/${handle}`} className='hover:text-blue-500'>View tag graph</Link>
        <Link to={'/compare'} className='hover:text-blue-500'>Compare profiles</Link>
    </div>
  )
}

export default Nav

