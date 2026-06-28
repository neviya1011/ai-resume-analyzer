import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadedImg from "../assets/images/upload.png";
import homeButton from "../assets/images/home.png";
import AnalyzeLoader from "../components/UploadPage/AnalyzeLoader";
import { convertPdfFirstPageToImage } from "../utils/pdfToImage";
import { usePuterStore } from "../store/lib/puterstore";

const Upload = () => {
    const navigate = useNavigate();

    const { fs, kv, ai } = usePuterStore();

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [analysisStep, setAnalysisStep] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!companyName || !jobTitle || !jobDescription || !file) {
        alert("Please fill all fields and upload a resume.");
        return;
        }

        setIsAnalyzing(true);
        setAnalysisComplete(false);
        setAnalysisStep("Uploading the file...");

        try {
        const uploadedResult = await fs.upload(file);

        const uploadedFile = Array.isArray(uploadedResult)
            ? uploadedResult[0]
            : uploadedResult;

        const filePath = uploadedFile?.path;

        if (!filePath) {
            throw new Error("Upload worked, but file path was not found.");
        }

        console.log("Uploaded PDF:", uploadedFile);

        setAnalysisStep("Converting the file...");

        const { imageFile, imageUrl } = await convertPdfFirstPageToImage(file);

        console.log("Converted image file:", imageFile);
        console.log("Converted image preview:", imageUrl);

        setAnalysisStep("Uploading the image...");

        const uploadedImageResult = await fs.upload(imageFile);

        const uploadedImage = Array.isArray(uploadedImageResult)
            ? uploadedImageResult[0]
            : uploadedImageResult;

        const imagePath = uploadedImage?.path;

        console.log("Uploaded image:", uploadedImage);

        setAnalysisStep("Preparing data...");

        const metadata = {
            companyName,
            jobTitle,
            jobDescription,
            fileName: file.name,
            filePath,
            imagePath,
            uploadedAt: new Date().toISOString(),
        };

        console.log("Prepared metadata:", metadata);

        setAnalysisStep("Analyzing...");

        const response = await ai.feedback(
            filePath,
            `
    Analyze the uploaded resume for this job.

    Company: ${companyName}
    Job title: ${jobTitle}
    Job description:
    ${jobDescription}

    Evaluate the actual resume content. Do not use example scores. Calculate the scores based only on the uploaded resume and job description.

    Return ONLY valid JSON. Do not include markdown or explanation.

    Use this exact structure, but fill every score and tip based on the uploaded resume:

    {
    "overallScore": number,
    "ATS": {
        "score": number,
        "tips": [
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume"
        ]
    },
    "content": {
        "score": number,
        "tips": [
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume"
        ]
    },
    "skills": {
        "score": number,
        "tips": [
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume"
        ]
    },
    "structure": {
        "score": number,
        "tips": [
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume"
        ]
    },
    "toneAndStyle": {
        "score": number,
        "tips": [
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume",
        "specific tip based on resume"
        ]
    }
    }
    `
        );

        const aiText = response?.message?.content || response?.toString?.() || response;
        const feedback = JSON.parse(aiText);

        const finalResult = {
            companyName,
            jobTitle,
            jobDescription,
            resumePath: filePath,
            imagePath,
            feedback,
        };

        console.log("Final Resume Analysis:", finalResult);

        await kv.set(`resume:${Date.now()}`, JSON.stringify(finalResult));

        setAnalysisComplete(true);
        setAnalysisStep("Analysis complete, redirecting ...");
        } catch (error) {
        console.log("Analyze Error:", error);
        alert(error.message || "Something went wrong while analyzing the resume.");

        setIsAnalyzing(false);
        setAnalysisComplete(false);
        setAnalysisStep("");
        }
    };

    if (isAnalyzing) {
        return (
        <div className="upload w-full flex flex-col items-center overflow-hidden relative pt-5">
            <img
            src={homeButton}
            alt="Home"
            className="w-[25px] absolute left-10 top-6 cursor-pointer"
            onClick={() => navigate("/")}
            />

            <div className="bg-white w-170 rounded-2xl p-[10px] shrink-0">
            <div className="flex items-center px-2">
                <h1 className="font-bold">RESUMIND</h1>
            </div>
            </div>

            <div className="flex-1 min-h-0 w-full flex flex-col items-center mt-10">
            <h1 className="font-bold text-4xl text-center w-[550px] mb-1 shrink-0">
                Smart feedback for your dream job
            </h1>

            <AnalyzeLoader
                analysisComplete={analysisComplete}
                analysisStep={analysisStep}
            />
            </div>
        </div>
        );
    }

    return (
        <div className="upload min-h-screen flex items-center flex-col relative pt-4">
        <img
            src={homeButton}
            alt="Home"
            className="w-[25px] absolute left-10 top-6 cursor-pointer"
            onClick={() => navigate("/")}
        />

        <div>
            <div className="bg-white w-170 rounded-2xl p-[10px]">
            <div className="flex items-center px-2">
                <h1 className="font-bold">RESUMIND</h1>
            </div>
            </div>
        </div>

        <div className="flex flex-col items-center mt-10">
            <h1 className="font-bold text-4xl text-center w-[550px]">
            Smart feedback for your dream job
            </h1>

            <p className="mt-5 text-gray-600 text-[20px]">
            Drop your resume for an ATS score and improvement tips
            </p>

            <form
            onSubmit={handleSubmit}
            className="w-[600px] mt-10 flex flex-col gap-5"
            >
            <div>
                <label className="text-sm text-gray-600">Company Name</label>
                <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="w-full mt-2 p-3 rounded-xl bg-white outline-none"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Job Title</label>
                <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="w-full mt-2 p-3 rounded-xl bg-white outline-none"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Job Description</label>
                <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Job Description"
                className="w-full mt-2 p-3 rounded-xl bg-white outline-none h-32 resize-none"
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Upload Resume</label>

                <label className="uploadFile w-full mt-2 p-3 h-[150px] rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-300">
                <img
                    src={uploadedImg}
                    alt="Upload"
                    className="w-10 h-10 object-contain mb-3"
                />

                <h1 className="text-sm font-semibold text-gray-700">
                    Upload your resume
                </h1>

                {file && (
                    <span className="text-xs text-gray-500 mt-2">{file.name}</span>
                )}

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                />
                </label>
            </div>

            <button
                type="submit"
                disabled={isAnalyzing}
                className="bg-[rgb(98,109,210)] text-white rounded-2xl py-3 text-sm"
            >
                Analyze Resume
            </button>
            </form>
        </div>
        </div>
    );
};

export default Upload;