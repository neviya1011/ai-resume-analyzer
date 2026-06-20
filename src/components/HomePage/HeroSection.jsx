import React from 'react'
import Navbar from './Navbar'
import { usePuterStore } from "../../store/lib/puterstore";

const HeroSection = () => {
  const {
    auth: { signOut },
  } = usePuterStore();

  return (
    <div className="relative">
      <button
        onClick={signOut}
        className="absolute top-1 right-4 bg-red-500 rounded-2xl px-3 py-2 text-white text-xs"
      >
        Logout
      </button>

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