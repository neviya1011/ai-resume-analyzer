import React, { useState } from "react";
import Score from "../HomePage/Score";

const sections = [
    { key: "toneAndStyle", label: "Tone & Style" },
    { key: "content", label: "Content" },
    { key: "structure", label: "Structure" },
    { key: "skills", label: "Skills" },
    ];

    const ResumeReview = ({ result, imageUrl, onBack }) => {
    const [openSection, setOpenSection] = useState("content");

    const feedback = result.feedback;

    return (
        <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center mb-8 lg:mb-20">
            <button
                onClick={onBack}
                className="absolute left-0 text-xs sm:text-sm bg-purple-300 px-2.5 py-2 sm:px-3 sm:py-3 rounded-2xl"
            >
                Back to Homepage
            </button>

            <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-center px-16 sm:px-20">Resume Review</h1>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="flex justify-center">
            <div className="w-full max-w-[600px] aspect-[3/4] lg:h-[800px] bg-white rounded-xl shadow-lg overflow-hidden border">
                <img
                src={imageUrl}
                alt="Resume preview"
                className="w-full h-full object-contain"
                />
            </div>
            </div>

            <div>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 mb-5">
                <div className="flex items-center gap-4 sm:gap-5 mb-5">
                <Score score={feedback.overallScore} />

                <div>
                    <h2 className="font-bold text-lg sm:text-xl">Your Resume Score</h2>
                    <p className="text-sm text-gray-500">
                    This score is calculated based on the resume analysis below.
                    </p>
                </div>
                </div>

                {sections.map((section) => (
                <div
                    key={section.key}
                    className="flex justify-between border-t py-4"
                >
                    <span className="font-medium">{section.label}</span>
                    <span className="font-semibold">
                    {feedback[section.key]?.score}/100
                    </span>
                </div>
                ))}
            </div>

            <div className="bg-green-50 rounded-xl shadow-md p-4 sm:p-5 mb-5">
                <h2 className="font-bold text-lg sm:text-xl mb-3">
                ATS Score - {feedback.ATS?.score}/100
                </h2>

                <p className="font-semibold mb-2">Great Job!</p>

                <p className="text-sm text-gray-600 mb-4">
                This score represents how well your resume may perform in
                Applicant Tracking Systems.
                </p>

                <ul className="text-sm flex flex-col gap-2">
                {feedback.ATS?.tips?.map((tip, index) => (
                    <li
                    key={index}
                    className={index === 0 ? "text-green-700" : "text-yellow-700"}
                    >
                    {index === 0 ? "✓" : "⚠"} {tip}
                    </li>
                ))}
                </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md">
                {sections.map((section) => {
                const data = feedback[section.key];
                const isOpen = openSection === section.key;

                return (
                    <div key={section.key} className="border-b">
                    <button
                        onClick={() =>
                        setOpenSection(isOpen ? "" : section.key)
                        }
                        className="w-full flex justify-between items-center gap-2 px-4 sm:px-5 py-4"
                    >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-semibold truncate">{section.label}</span>
                        <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            {data?.score}/100
                        </span>
                        </div>

                        <span className="shrink-0">{isOpen ? "⌃" : "⌄"}</span>
                    </button>

                    {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 flex flex-col gap-3">
                        {data?.tips?.map((tip, index) => (
                            <div
                            key={index}
                            className={
                                index === 0
                                ? "bg-green-50 text-green-800 p-4 rounded-lg text-sm"
                                : "bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm"
                            }
                            >
                            <p className="font-semibold mb-1">
                                {index === 0 ? "Good point" : "Suggestion"}
                            </p>
                            <p>{tip}</p>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        </div>
    );
};

export default ResumeReview;
