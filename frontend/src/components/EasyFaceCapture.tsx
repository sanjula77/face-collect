"use client";

import { useRef, useState, useCallback } from "react";
import { loadModels, detectFace } from "@/lib/faceApi";

/**
 * EasyFaceCapture: Manual capture approach - much more reliable!
 * 
 * Instead of trying to detect poses automatically, we let the user
 * manually capture each pose when they're ready. This is much more
 * reliable and user-friendly.
 */

// ============================================================================
// TYPES
// ============================================================================

export type CaptureStep = "Center" | "Left" | "Right" | "Up" | "Down";
export type CaptureStatus = "idle" | "camera_starting" | "camera_ready" | "capturing" | "completed" | "error";

export interface EasyCaptureResult {
  step: CaptureStep;
  imageData: string;
  timestamp: number;
}

export interface EasyFaceCaptureProps {
  onCaptureComplete?: (results: EasyCaptureResult[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EasyFaceCapture({
  onCaptureComplete,
  onError,
  className = "",
}: EasyFaceCaptureProps) {

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [state, setState] = useState({
    status: "idle" as CaptureStatus,
    currentStep: 0,
    capturedResults: [] as EasyCaptureResult[],
    errorMessage: null as string | null,
    isAnimating: false,
    faceDetected: false,
  });

  // Step definitions
  const CAPTURE_STEPS: CaptureStep[] = ["Center", "Left", "Right", "Up", "Down"];

  // ============================================================================
  // CAMERA FUNCTIONS
  // ============================================================================

  const startCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, status: "camera_starting", errorMessage: null }));

      // Check if we're on HTTPS or localhost
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      if (!isSecure) {
        throw new Error("Camera requires HTTPS. Please use https:// or localhost");
      }

      // Get camera stream with mobile-optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15, max: 30 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState(prev => ({ ...prev, status: "camera_ready" }));
    } catch (error) {
      console.error("Camera error:", error);

      let errorMessage = "Failed to access camera. ";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += "Please allow camera permissions and try again.";
        } else if (error.name === 'NotFoundError') {
          errorMessage += "No camera found on this device.";
        } else if (error.message.includes('HTTPS')) {
          errorMessage += "Camera requires HTTPS. Please use https:// or localhost.";
        } else {
          errorMessage += error.message;
        }
      }

      setState(prev => ({
        ...prev,
        status: "error",
        errorMessage
      }));

      onError?.(errorMessage);
    }
  }, [onError]);

  const startCapture = useCallback(async () => {
    if (state.status !== "camera_ready") {
      setState(prev => ({ ...prev, errorMessage: "Please start camera first" }));
      return;
    }

    // Load face detection models
    await loadModels();

    setState(prev => ({
      ...prev,
      status: "capturing",
      currentStep: 0,
      capturedResults: [],
      errorMessage: null,
    }));
  }, [state.status]);

  const resetCapture = useCallback(() => {
    setState({
      status: "idle",
      currentStep: 0,
      capturedResults: [],
      errorMessage: null,
      isAnimating: false,
      faceDetected: false,
    });
  }, []);

  // ============================================================================
  // CAPTURE FUNCTIONS
  // ============================================================================

  const captureCurrentPose = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || state.status !== "capturing") {
      return;
    }

    try {
      // Check if face is detected
      const detection = await detectFace(videoRef.current);
      if (!detection) {
        setState(prev => ({
          ...prev,
          errorMessage: "No face detected. Please position your face in the camera and try again.",
        }));
        return;
      }

      const currentStep = CAPTURE_STEPS[state.currentStep];
      console.log(`🎯 Capturing ${currentStep}`);

      // Trigger capture animation
      setState(prev => ({ ...prev, isAnimating: true }));
      setTimeout(() => setState(prev => ({ ...prev, isAnimating: false })), 500);

      // Capture image
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/png");

      // Create capture result
      const captureResult: EasyCaptureResult = {
        step: currentStep,
        imageData,
        timestamp: Date.now(),
      };

      // Update state
      setState(prev => ({
        ...prev,
        capturedResults: [...prev.capturedResults, captureResult],
        currentStep: prev.currentStep + 1,
        errorMessage: null,
      }));

      // Check if all steps completed
      if (state.currentStep + 1 >= CAPTURE_STEPS.length) {
        console.log("✅ All steps completed!");
        setState(prev => ({ ...prev, status: "completed" }));
        onCaptureComplete?.(state.capturedResults.concat(captureResult));
      } else {
        const nextStep = CAPTURE_STEPS[state.currentStep + 1];
        console.log(`⏳ Next step: ${nextStep}`);
        setState(prev => ({
          ...prev,
          errorMessage: `Great! Now move to: ${nextStep} position`,
        }));
      }

    } catch (error) {
      console.error("Capture error:", error);
      setState(prev => ({ ...prev, errorMessage: "Capture failed. Please try again." }));
    }
  }, [state.status, state.currentStep, state.capturedResults, onCaptureComplete]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusMessage = () => {
    switch (state.status) {
      case "idle":
        return "Click 'Start Camera' to begin";
      case "camera_starting":
        return "Starting camera...";
      case "camera_ready":
        return "Camera ready. Click 'Start Capture' to begin";
      case "capturing":
        if (state.errorMessage) return state.errorMessage;
        return `Step ${state.currentStep + 1} of ${CAPTURE_STEPS.length}: ${CAPTURE_STEPS[state.currentStep]}`;
      case "completed":
        return "Capture completed successfully!";
      case "error":
        return state.errorMessage || "An error occurred";
      default:
        return "";
    }
  };

  const getProgressPercentage = () => {
    return (state.currentStep / CAPTURE_STEPS.length) * 100;
  };

  const getStepIcon = (step: CaptureStep) => {
    switch (step) {
      case "Center":
        return "👁️";
      case "Left":
        return "👈";
      case "Right":
        return "👉";
      case "Up":
        return "👆";
      case "Down":
        return "👇";
      default:
        return "👤";
    }
  };

  const getStepInstructions = (step: CaptureStep) => {
    switch (step) {
      case "Center":
        return "Look straight ahead at the camera";
      case "Left":
        return "Turn your head to the LEFT";
      case "Right":
        return "Turn your head to the RIGHT";
      case "Up":
        return "Look UP (tilt your head up)";
      case "Down":
        return "Look DOWN (tilt your head down)";
      default:
        return "Position your face correctly";
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`flex flex-col items-center space-y-8 w-full max-w-2xl mx-auto ${className}`}>
      {/* Main Video Container */}
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Current Step Overlay */}
        {state.status === "capturing" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${state.isAnimating
              ? "border-emerald-500 bg-emerald-500/30 scale-125 shadow-2xl"
              : "border-blue-500 bg-blue-500/20 scale-100 shadow-xl"
              }`}>
              <span className="text-white text-2xl md:text-3xl font-bold">
                {getStepIcon(CAPTURE_STEPS[state.currentStep])}
              </span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {state.status === "capturing" && (
          <div className="absolute top-6 left-6 right-6">
            <div className="progress-bar bg-white/20">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="text-white text-sm mt-2 text-center font-semibold">
              Step {state.currentStep + 1} of {CAPTURE_STEPS.length}
            </div>
          </div>
        )}

        {/* Status overlay */}
        {state.status === "camera_ready" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-emerald-500/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Camera Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {state.status === "capturing" && (
        <div className="status-info w-full">
          <div className="text-center">
            <h3 className="heading-4 mb-3 text-blue-800">
              {getStepIcon(CAPTURE_STEPS[state.currentStep])} {CAPTURE_STEPS[state.currentStep]}
            </h3>
            <p className="text-body text-blue-700 mb-2">
              {getStepInstructions(CAPTURE_STEPS[state.currentStep])}
            </p>
            <p className="text-caption text-blue-600">
              When ready, click "Capture" below
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col gap-4 w-full">
        {state.status === "idle" && (
          <button
            onClick={startCamera}
            className="btn-success w-full group"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Start Camera
            </span>
          </button>
        )}

        {state.status === "camera_ready" && (
          <button
            onClick={startCapture}
            className="btn-primary w-full group"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Face Capture
            </span>
          </button>
        )}

        {state.status === "capturing" && (
          <div className="flex gap-4">
            <button
              onClick={captureCurrentPose}
              className="btn-success flex-1 group"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capture {CAPTURE_STEPS[state.currentStep]}
              </span>
            </button>
            <button
              onClick={resetCapture}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
        )}

        {state.status === "completed" && (
          <button
            onClick={resetCapture}
            className="btn-primary w-full group"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start New Capture
            </span>
          </button>
        )}

        {state.status === "error" && (
          <div className="flex gap-4">
            <button
              onClick={startCamera}
              className="btn-success flex-1 group"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
            </button>
            <button
              onClick={resetCapture}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="text-center min-h-[3rem]">
        <p className={`text-base font-semibold ${state.status === "error" ? "text-red-600" :
          state.status === "completed" ? "text-emerald-600" :
            state.status === "camera_ready" ? "text-emerald-600" :
              "text-gray-700"
          }`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Captured Results Preview */}
      {state.capturedResults.length > 0 && (
        <div className="w-full">
          <h3 className="heading-4 mb-6 text-center">Captured Steps</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {state.capturedResults.map((result, index) => (
              <div key={index} className="bg-white rounded-xl p-3 text-center group hover:scale-105 transition-transform duration-300 shadow-sm">
                <img
                  src={result.imageData}
                  alt={`Step ${index + 1}: ${result.step}`}
                  className="w-full h-24 md:h-32 object-cover rounded-2xl mb-3 shadow-md"
                />
                <div className="text-caption">
                  <p className="font-semibold text-gray-800">{result.step}</p>
                  <p className="text-gray-500">Step {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Types are already exported above
