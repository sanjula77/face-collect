"use client";

import { useRef, useState, useEffect } from "react";
import { loadModels, detectFace } from "@/lib/faceApi";

export default function CameraCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<string>("");

  useEffect(() => {
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detection = await detectFace(videoRef.current);

    if (!detection) {
      setFaceStatus("❌ No face detected. Try again.");
      return;
    }

    const box = detection.detection.box;
    if (box.width < 100 || box.height < 100) {
      setFaceStatus("⚠️ Face too small. Move closer.");
      return;
    }

    setFaceStatus("✅ Face detected!");

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    const dataUrl = canvasRef.current.toDataURL("image/png");
    setImageData(dataUrl);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={videoRef} className="rounded-lg shadow" />
      <canvas ref={canvasRef} className="hidden" />
      {imageData && (
        <img
          src={imageData}
          alt="Captured"
          className="w-48 h-48 rounded-lg shadow border"
        />
      )}

      <p className="text-sm">{faceStatus}</p>

      <div className="flex gap-2">
        <button
          onClick={startCamera}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start Camera
        </button>
        <button
          onClick={capturePhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Capture
        </button>
      </div>
    </div>
  );
}
