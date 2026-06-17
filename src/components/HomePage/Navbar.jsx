import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className='bg-white min-w-170 rounded-2xl p-[10px]'>
        <div className='flex justify-between items-baseline'>
            <h1 className='font-bold'>RESUMIND</h1>
            <button className='bg-[rgb(98,109,210)] rounded-2xl px-3 py-1 text-[rgb(220,224,250)] text-xs'>Upload Resume</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
