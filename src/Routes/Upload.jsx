import React, { useState } from "react";
import Navbar from "../components/HomePage/Navbar";
import uploadedImg from "../assets/images/upload.png"
import { usePuterStore } from "../store/lib/puterstore";
import { useNavigate } from "react-router-dom";

const Upload = () => {
    const { fs, kv, ai } = usePuterStore();

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!companyName || !jobTitle || !jobDescription || !file) {
        alert("Please fill all fields and upload a resume.");
        return;
        }

        setIsAnalyzing(true);

        try {
        const formData = {
            companyName,
            jobTitle,
            jobDescription,
            file,
        };

        console.log(formData);

        const uploadedFiles = await fs.upload([file]);
        const uploadedFile = uploadedFiles[0];

        const metadata = {
            companyName,
            jobTitle,
            jobDescription,
            fileName: file.name,
            filePath: uploadedFile.path,
            uploadedAt: new Date().toISOString(),
        };

        await kv.set(`resume:${Date.now()}`, JSON.stringify(metadata));

        const response = await ai.feedback(
            uploadedFile.path,
            `Analyze this resume for the job title "${jobTitle}" at "${companyName}". Job description: ${jobDescription}. Give an ATS score and improvement tips.`
        );

        console.log("AI Feedback:", response);
        alert("Resume analyzed successfully!");
        } catch (error) {
        console.log(error);
        alert("Something went wrong while analyzing the resume.");
        } finally {
        setIsAnalyzing(false);
        }
    };

    return (
        <div className="upload flex items-center flex-col">
            <div>
                <div className="bg-white w-170 rounded-2xl p-[10px]">
                    <div className="flex justify-between items-baseline">
                    <h1 className="font-bold">RESUMIND</h1>

                    <div className="flex gap-2">
                        <button
                        onClick={() => navigate("/")}
                        className="bg-[rgb(98,109,210)] rounded-2xl px-3 py-1 text-[rgb(220,224,250)] text-xs"
                        >
                        Home
                        </button>

                    </div>
                    </div>
                </div>
            </div>

        <div className="flex flex-col items-center mt-16">
            <h1 className="font-bold text-4xl text-center w-[550px]">
            Smart feedback for your dream job
            </h1>

            <p className="mt-5 text-gray-600 text-[20px]">
            Drop your resume for an ATS score and improvement tips
            </p>

            <form onSubmit={handleSubmit} className="w-[600px] mt-10 flex flex-col gap-5">
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
                    src= {uploadedImg}
                    alt="Upload"
                    className="w-10 h-10 object-contain mb-3"
                    />

                    <h2 className="text-gray-600">Click to upload the files</h2>

                    {file && (
                    <span className="text-xs text-gray-500">
                        {file.name}
                    </span>
                    )}

                    <input
                    type="file"
                    accept=".pdf,.doc,.docx"
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
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
            </form>
        </div>
        </div>
    );
};

export default Upload;