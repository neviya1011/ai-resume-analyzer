import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HeroSection from "./components/HomePage/HeroSection";
import Cards from "./components/HomePage/Cards";
import Auth from "./Routes/Auth";
import { usePuterStore } from "./store/lib/puterstore";
import Upload from "./Routes/Upload";

import resume1 from "./assets/images/resume1.webp";
import resume2 from "./assets/images/resume2.webp";
import resume3 from "./assets/images/resume3.webp";

const Home = () => {
  const resumes = [
    {
      company: "Google",
      role: "Frontend Developer",
      img: resume1,
      score: 90,
    },
    {
      company: "Microsoft",
      role: "Cloud Engineer",
      img: resume2,
      score: 85,
    },
    {
      company: "Apple",
      role: "iOS Developer",
      img: resume3,
      score: 75,
    },
  ];

  return (
    <div>
      <HeroSection />

      <div className="grid grid-cols-3 gap-20 justify-items-center mt-10">
        {resumes.map((elem, index) => (
          <Cards
            key={index}
            company={elem.company}
            role={elem.role}
            img={elem.img}
            score={elem.score}
          />
        ))}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const {
    isLoading,
    auth: { isAuthenticated },
  } = usePuterStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  const init = usePuterStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;