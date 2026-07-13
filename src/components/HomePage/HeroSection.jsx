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
    <div className="relative">

      <img
        src={logout}
        alt="Logout"
        className="w-[30px] absolute right-0 top-3 cursor-pointer"
        onClick={handleLogout}
      />

      <div className="flex flex-col items-center">
        <Navbar />

        <div className="flex flex-col items-center p-[10px]">
          <h1 className="font-bold text-4xl w-[450px] text-center mt-5">
            Track Your Applications & Resume Ratings
          </h1>

          <h3 className="p-2 mt-4">
            Review your submissions and check AI-powered feedback
          </h3>

          {showCreateButton && (
            <div ref={buttonRef} className="mt-5 will-change-transform">
              <button className="bg-purple-500 p-3 rounded-2xl text-2xl font-bold text-white"
              onClick={() => navigate("/Build")}>
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