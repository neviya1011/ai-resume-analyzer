import React from 'react'
import Navbar from './Navbar'
import logout from '../../assets/images/logout.png'
import { usePuterStore } from "../../store/lib/puterstore";

const HeroSection = () => {
  const {
    auth: { signOut },
  } = usePuterStore();

  return (
    <div className="relative">
      <img src={logout} className='w-[30px] absolute right-0 top-3'
      onClick={signOut}/>

      <div className="flex flex-col items-center">
        <Navbar />

        <div className="flex flex-col items-center p-[10px]">
          <h1 className="font-bold text-4xl w-[450px] text-center mt-5">
            Track Your Applications & Resume Ratings
          </h1>

          <h3 className="p-2 mt-4">
            Review your submissions and check AI-powered feedback
          </h3>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;