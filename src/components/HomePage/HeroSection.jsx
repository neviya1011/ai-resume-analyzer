import React from 'react'
import Navbar from './Navbar'

const HeroSection = () => {
  return (
    <div className='flex flex-col items-center'>
      < Navbar />
      <div className="flex flex-col items-center p-[10px]">
        <h1 className='font-bold text-4xl w-[450px] text-center mt-5'>Track Your Applications & Resume Ratings </h1>
        <h3 className='p-2 mt-4'>Review your submissions and check AI- powered feedback</h3>
      </div>
    </div>
  )
}

export default HeroSection

