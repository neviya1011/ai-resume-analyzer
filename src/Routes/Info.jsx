import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";

import img1 from "../assets/images/info1.png";
import img2 from "../assets/images/info2.png";
import img3 from "../assets/images/info3.png";

const sections = [
  {
    image: img1,
    title: "Structure Your Content. Automatically Aligned.",
    description:
      "Focus on entering your key achievements and skills. Our smart editor automatically organizes and perfectly aligns your content, so you never have to waste time on manual formatting.",
    buttonText: "Format My Content Now",
  },
  {
    image: img2,
    title: "Instantly Benchmark Your Resume",
    description:
      "Get a real-time AI-powered resume score based on industry standards and key skill matching. Identify strengths, and actionable improvements.",
    buttonText: "Check My Score Now",
  },
  {
    image: img3,
    title: "Take Your Resume Anywhere. Download in Perfect Format.",
    description:
      "Your professional resume is complete. Export in industry-accepted formats, share directly, or print high-quality copies. Your next opportunity is just a click away.",
    buttonText: "Download My Resume",
  },
];

const DISTANCE = 120;
const MOBILE_QUERY = "(max-width: 767px)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handleChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};

const InfoSection = ({ data, index, isFirst }) => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isImageLeft = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yRaw = useTransform(scrollYProgress, [0, 0.5, 1], [DISTANCE, 0, -DISTANCE]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const xImageDesktop = useTransform(scrollYProgress, (p) => {
    const sideDir = isImageLeft ? -1 : 1;
    return sideDir * DISTANCE * Math.abs(1 - 2 * p);
  });
  const xContentDesktop = useTransform(scrollYProgress, (p) => {
    const sideDir = isImageLeft ? 1 : -1;
    return sideDir * DISTANCE * Math.abs(1 - 2 * p);
  });

  const y = isMobile ? 0 : yRaw;
  const opacity = isMobile ? 1 : opacityRaw;
  const xImage = isMobile ? 0 : xImageDesktop;
  const xContent = isMobile ? 0 : xContentDesktop;

  const imageBlock = (
    <motion.div
      style={{ x: xImage, y, opacity }}
      className="w-full md:w-1/2 flex justify-center"
    >
      <div className="relative w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] bg-pink-200 rounded-2xl shadow-lg flex items-center justify-center">
        <motion.img
          src={data.image}
          alt={data.title}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[130px] sm:w-[230px] md:w-[280px] object-contain"
        />
      </div>
    </motion.div>
  );

  const contentBlock = (
    <motion.div
      style={{ x: xContent, y, opacity }}
      className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-3 sm:gap-4"
    >
      <h2 className="font-bold text-xl sm:text-2xl md:text-4xl">{data.title}</h2>
      <p className="text-gray-600 text-xs sm:text-sm md:text-lg max-w-xs sm:max-w-sm md:max-w-md">
        {data.description}
      </p>
      <button
        onClick={() => navigate("/auth")}
        className="mt-1 sm:mt-2 bg-black text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl font-semibold"
      >
        {data.buttonText}
      </button>
    </motion.div>
  );

  const orderedBlocks = isMobile
    ? [imageBlock, contentBlock]
    : isImageLeft
    ? [imageBlock, contentBlock]
    : [contentBlock, imageBlock];

  return (
    <section
      ref={ref}
      className={`info min-h-screen w-full flex items-center justify-center overflow-x-hidden px-4 sm:px-10 md:px-16 ${
        isFirst ? "pt-16 sm:pt-20" : ""
      }`}
    >
      <div
        className={`w-full max-w-5xl flex items-center gap-6 sm:gap-10 md:gap-16 ${
          isMobile ? "flex-col" : "flex-row"
        }`}
      >
        {orderedBlocks[0]}
        {orderedBlocks[1]}
      </div>
    </section>
  );
};

const Info = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 bg-pink-200/80 backdrop-blur-md shadow-sm">
        <div className="w-16 sm:w-20" />

        <h1 className="font-bold text-lg sm:text-xl md:text-2xl tracking-widest">
          RESUMIND
        </h1>

        <button
          onClick={() => navigate("/auth")}
          className="border border-black text-black px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded-xl sm:rounded-2xl font-semibold hover:bg-black hover:text-white active:scale-95 transition"
        >
          Login
        </button>
      </header>

      {sections.map((data, index) => (
        <InfoSection key={index} data={data} index={index} isFirst={index === 0} />
      ))}
    </div>
  );
};

export default Info;