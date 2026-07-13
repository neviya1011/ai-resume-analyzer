import React, { useEffect, useState } from "react";
import { useLottie } from "lottie-react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import HeroSection from "./components/HomePage/HeroSection";
import Cards from "./components/HomePage/Cards";
import Auth from "./Routes/Auth";
import Upload from "./Routes/Upload";
import ResumeReview from "./components/UploadPage/ResumeReview";
import { usePuterStore } from "./store/lib/puterstore";
import loadingAnimation from "./assets/Images/content.json";
import Build from "./Routes/Build";

const LoadingResumes = () => {
  const options = {
    animationData: loadingAnimation,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div>
      <HeroSection hasResumes={false} showCreateButton={false} />

      <div className="flex flex-col items-center min-h-0">
        <div className="w-[300px] h-[300px]">{View}</div>
      </div>
    </div>
  );
};

const ResumeReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const imageUrl = location.state?.imageUrl;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Resume data not found.
      </div>
    );
  }

  return (
    <ResumeReview
      result={result}
      imageUrl={imageUrl}
      onBack={() => navigate("/")}
    />
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { kv, fs } = usePuterStore();

  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const items = await kv.list("resume:*", true);

        if (!items || !items.length) {
          setResumes([]);
          return;
        }

        const parsedResumes = await Promise.all(
          items.map(async (item) => {
            const key = item.key;
            const value = item.value;

            const data = typeof value === "string" ? JSON.parse(value) : value;

            let imageUrl = "";

            if (data.imagePath) {
              const imageFile = await fs.read(data.imagePath);
              imageUrl = URL.createObjectURL(imageFile);
            }

            return {
              key: key,
              company: data.companyName,
              role: data.jobTitle,
              img: imageUrl,
              score: data.feedback?.overallScore || 0,
              result: data,
            };
          })
        );

        setResumes(parsedResumes);
      } catch (error) {
        console.log("Failed to load resumes:", error);
        setResumes([]);
      } finally {
        setIsLoadingResumes(false);
      }
    };

    loadResumes();
  }, [kv, fs]);

  const handleDeleteResume = async (resumeToDelete) => {
    try {
      console.log("Resume to delete:", resumeToDelete);
      console.log("Key to delete:", resumeToDelete.key);

      if (!resumeToDelete.key) {
        alert("No key found for this resume.");
        return;
      }

      await window.puter.kv.del(resumeToDelete.key);

      setResumes((prev) =>
        prev.filter((resume) => resume.key !== resumeToDelete.key)
      );

      console.log("Deleted successfully");
    } catch (error) {
      console.log("Failed to delete resume:", error);
      alert("Could not delete the resume.");
    }
};

  if (isLoadingResumes) {
    return <LoadingResumes />;
  }

  return (
    <div>
      <HeroSection hasResumes={resumes.length > 0} />

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center mt-8">
          <p className="text-gray-600 text-lg text-center w-[420px]">
            No resumes found. Upload your first resume to get feedback.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-20 justify-items-center mt-10">
          {resumes.map((elem, index) => (
            <Cards
              key={elem.key || index}
              company={elem.company}
              role={elem.role}
              img={elem.img}
              score={elem.score}
              onDelete={() => handleDeleteResume(elem)}
              onClick={() =>
                navigate("/resume-review", {
                  state: {
                    result: elem.result,
                    imageUrl: elem.img,
                  },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const {
    isLoading,
    auth: { isAuthenticated },
  } = usePuterStore();

  const localUserLoggedIn = localStorage.getItem("resumindLoggedIn") === "true";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated && !localUserLoggedIn) {
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

      <Route
        path="/resume-review"
        element={
          <ProtectedRoute>
            <ResumeReviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Build"
        element={
          <ProtectedRoute>
            <Build />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;