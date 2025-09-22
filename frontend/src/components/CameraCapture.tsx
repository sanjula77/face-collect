"use client";

import { useRef, useState, useEffect } from "react";
import { loadModels, detectFace } from "@/lib/faceApi";
import { supabase } from "@/lib/supabaseClient";

interface CameraCaptureProps {
  onImageCaptured?: (imageUrl: string) => void;
}

export default function CameraCapture({ onImageCaptured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Check if we're on HTTPS or localhost
      if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        setError("Camera access requires HTTPS. Please use a secure connection or localhost.");
        setFaceStatus("HTTPS required for camera access");
        return;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera access is not supported in this browser. Please use a modern browser.");
        setFaceStatus("Camera not supported");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
        setFaceStatus("Camera is active - Position your face in the frame");
      }
    } catch (err: unknown) {
      console.error(err);
      
      let errorMessage = "Camera access denied or not available. Please check your permissions.";
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = "Camera access denied. Please allow camera permissions and try again.";
        } else if (err.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (err.name === 'NotReadableError') {
          errorMessage = "Camera is already in use by another application. Please close other camera apps and try again.";
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = "Camera constraints could not be satisfied. Please try with different settings.";
        } else if (err.name === 'SecurityError') {
          errorMessage = "Camera access blocked due to security restrictions. Please use HTTPS or localhost.";
        }
      }
      
      setError(errorMessage);
      setFaceStatus("Camera access failed");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setFaceStatus("");
      setImageData(null);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsLoading(true);
    setError(null);
    setFaceStatus("Detecting face...");

    try {
      const detection = await detectFace(videoRef.current);

      if (!detection) {
        setFaceStatus("No face detected. Please ensure your face is clearly visible and try again.");
        setError("No face detected in the image. Please position your face clearly in the camera frame.");
        return;
      }

      const box = detection.detection.box;
      if (box.width < 100 || box.height < 100) {
        setFaceStatus("Face too small. Please move closer to the camera.");
        setError("Face is too small. Please move closer to the camera for better detection.");
        return;
      }

      setFaceStatus("Face detected! Processing...");

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      const dataUrl = canvasRef.current.toDataURL("image/png");
      setImageData(dataUrl);

      // Convert base64 → Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Upload to Supabase
      const fileName = `capture-${Date.now()}.png`;
      const { data, error } = await supabase.storage
        .from("faces")
        .upload(fileName, blob, {
          contentType: "image/png",
        });

      if (error) {
        console.error("Upload error:", error);
        if (error.message.includes("row-level security")) {
          setFaceStatus("Permission denied. Check Supabase RLS policies.");
          setError("Upload failed due to permission restrictions.");
        } else {
          setFaceStatus("Upload failed: " + error.message);
          setError("Failed to upload image. Please try again.");
        }
        return;
      }

      setFaceStatus("Face captured and uploaded successfully!");
      setError(null);
      
      // Notify parent component with the uploaded file URL
      if (onImageCaptured && data?.path) {
        const { data: publicUrl } = supabase.storage
          .from("faces")
          .getPublicUrl(data.path);
        onImageCaptured(publicUrl.publicUrl);
      }
    } catch (err) {
      console.error("Capture error:", err);
      setError("An error occurred during face detection. Please try again.");
      setFaceStatus("Error during face detection");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return (
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      );
    }
    if (faceStatus.includes("successfully")) {
      return (
        <svg className="w-5 h-5 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (faceStatus.includes("detected") && !faceStatus.includes("No face")) {
      return (
        <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    }
    if (faceStatus.includes("Camera is active")) {
      return (
        <svg className="w-5 h-5 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6">
      {/* Camera Display */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300">
        <video 
          ref={videoRef} 
          className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          playsInline
          muted
          aria-label="Camera feed for face capture"
        />
        {!isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center text-gray-400">
              <div className="w-20 h-20 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <p className="text-sm font-semibold">Camera not started</p>
              <p className="text-xs text-gray-500 mt-1">Click &quot;Start Camera&quot; to begin</p>
            </div>
          </div>
        )}
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 flex items-center space-x-4 shadow-2xl animate-scale-in">
              <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold text-gray-800">Processing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Captured Image Display */}
      {imageData && (
        <div className="text-center animate-fade-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Captured Image</h3>
          <div className="relative inline-block group">
            <img
              src={imageData}
              alt="Captured face"
              className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      {faceStatus && (
        <div className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 ${
          faceStatus.includes("successfully") 
            ? "bg-green-50 text-green-800 border border-green-200 animate-fade-in" 
            : faceStatus.includes("denied") || faceStatus.includes("failed")
            ? "bg-red-50 text-red-800 border border-red-200 animate-shake"
            : faceStatus.includes("small") || faceStatus.includes("detected")
            ? "bg-amber-50 text-amber-800 border border-amber-200"
            : "bg-blue-50 text-blue-800 border border-blue-200"
        }`}>
          {getStatusIcon()}
          <p className="text-sm font-semibold">{faceStatus}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-4 animate-shake">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isCameraActive ? (
          <button
            onClick={startCamera}
            disabled={isLoading}
            className="group flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 focus:ring-4 focus:ring-green-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            aria-label="Start camera for face capture"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Starting...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Start Camera
              </span>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              disabled={isLoading}
              className="group flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Capture photo with face detection"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Capturing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture Photo
                </span>
              )}
            </button>
            <button
              onClick={stopCamera}
              disabled={isLoading}
              className="group flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 focus:ring-4 focus:ring-gray-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Stop camera"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Camera
              </span>
            </button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
        <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Instructions:
        </h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
            Ensure good lighting on your face
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
            Look directly at the camera
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
            Keep your face centered in the frame
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
            Remove glasses or hats if possible
          </li>
        </ul>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}