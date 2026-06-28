import React from "react";
import { useLottie } from "lottie-react";
import Analyze from "../../assets/images/Document OCR Scan.json";

const AnalyzeLoader = ({ analysisStep }) => {
  const options = {
    animationData: Analyze,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <div className="flex flex-col items-center min-h-0">
      <p className="text-gray-600 text-[18px] mt-10">
        {analysisStep}
      </p>

      <div className="w-[300px] h-[300px]">
        {View}
      </div>
    </div>
  );
};

export default AnalyzeLoader;