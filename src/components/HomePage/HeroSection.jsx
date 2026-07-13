import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from "react-router-dom";
import logout from "../../assets/images/logout.png";
import { usePuterStore } from "../../store/lib/puterstore";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const HeroSection = ({ showCreateButton = true }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const {
    auth: { signOut },
  } = usePuterStore();

  useEffect(() => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      y: -8,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      force3D: true,
    });
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("resumindLoggedIn");

    await signOut();

    navigate("/auth");
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">

      <div className="relative flex justify-center items-center w-full">
        <div className="w-full max-w-[min(680px,calc(100%-80px))]">
          <Navbar />
        </div>

        <img
          src={logout}
          alt="Logout"
          className="w-[24px] cursor-pointer absolute right-0 top-1/2 -translate-y-1/2"
          onClick={handleLogout}
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center p-[10px] w-full">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl w-full max-w-[450px] text-center mt-5">
            Track Your Applications & Resume Ratings
          </h1>

          <h3 className="p-2 mt-4 text-sm sm:text-base text-center">
            Review your submissions and check AI-powered feedback
          </h3>

          {showCreateButton && (
            <div ref={buttonRef} className="mt-5 will-change-transform">
              <button
                className="bg-purple-500 px-5 py-2 sm:p-3 rounded-2xl text-base sm:text-xl md:text-2xl font-bold text-white"
                onClick={() => navigate("/Build")}
              >
                Create Your Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;