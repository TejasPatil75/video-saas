"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react'

function VideoUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const router = useRouter()
    const MAX_FILE_SIZE = 100 * 1024 * 1024;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setFile(selectedFile);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File size is too large (Max 100MB)")
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const timestamp = Math.round((new Date).getTime() / 1000);
            const paramsToSign = { folder: "video-uploads", timestamp: timestamp };
            const signatureResponse = await axios.post("/api/sign-upload", { paramsToSign });
            const { signature, apikey } = signatureResponse.data;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apikey);
            formData.append("timestamp", String(timestamp));
            formData.append("signature", signature);
            formData.append("folder", "video-uploads");

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

            const uploadResponse = await axios.post(uploadUrl, formData, {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    setUploadProgress(percent);
                }
            });

            const { public_id, bytes, duration } = uploadResponse.data;

            await axios.post("/api/video-upload", {
                title,
                description,
                publicId: public_id,
                originalSize: file.size,
                compressedSize: bytes,
                duration
            });

            toast.success("Video uploaded successfully!");
            router.push("/home");

        } catch (error) {
            console.error(error);
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Upload Video</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">Share your content with the world.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* File Drop Zone (Simulated) */}
                <div className={`
                    relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all
                    ${file ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900"}
                `}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                    />
                    {file ? (
                        <div className="flex flex-col items-center">
                            <FileVideo className="w-12 h-12 text-indigo-500 mb-3" />
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-zinc-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                            <UploadCloud className="w-12 h-12 text-zinc-400 mb-3" />
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Drag and drop or click to browse</p>
                            <p className="text-xs text-zinc-500 mt-2">MP4, MOV up to 100MB</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Project Demo v1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-32"
                            placeholder="What is this video about?"
                        />
                    </div>
                </div>

                {isUploading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-zinc-500">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out" 
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isUploading ? "Processing..." : "Publish Video"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default VideoUpload