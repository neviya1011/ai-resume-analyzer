
import React from 'react'
import Navbar from './Navbar'
import { useNavigate } from "react-router-dom";
import logout from "../../assets/images/logout.png";
import { usePuterStore } from "../../store/lib/puterstore";

const HeroSection = () => {
  const navigate = useNavigate();

  const {
    auth: { signOut },
  } = usePuterStore();

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
        </div>
      </div>
    </div>
  );
};

export default HeroSection;