import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePuterStore } from "../store/lib/puterstore";


const Auth = () => {
  
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    auth: { isAuthenticated, signIn },
  } = usePuterStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="font-bold text-4xl">Welcome to Resumind</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={signIn}
        disabled={isLoading}
        className="bg-[rgb(98,109,210)] rounded-2xl px-5 py-2 text-white"
      >
        {isLoading ? "Loading..." : "Login with Puter"}
      </button>
    </div>
  );
};

export default Auth;