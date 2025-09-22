"use client";

import { useState, useRef, useCallback } from "react";
import { loadModels, detectFace } from "@/lib/faceApi";
import { createUser, createCaptureSession, updateCaptureSession, saveFaceImage } from "@/lib/database";
import UserDataForm from "./UserDataForm";
import EasyFaceCapture from "./EasyFaceCapture";
import type { UserData } from "./UserDataForm";
import type { EasyCaptureResult } from "./EasyFaceCapture";

/**
 * IntegratedFaceCapture: Complete user data collection and face capture flow
 * 
 * Features:
 * - User data collection form
 * - Face capture with database storage
 * - Professional workflow
 * - Error handling and validation
 * - Progress tracking
 */

// ============================================================================
// TYPES
// ============================================================================

export type CaptureFlowStep = "user_data" | "face_capture" | "processing" | "completed" | "error";

export interface IntegratedCaptureResult {
  userId: string;
  sessionId: string;
  userData: UserData;
  captureResults: EasyCaptureResult[];
  success: boolean;
  error?: string;
}

export interface IntegratedFaceCaptureProps {
  onComplete?: (result: IntegratedCaptureResult) => void;
  onError?: (error: string) => void;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function IntegratedFaceCapture({
  onComplete,
  onError,
  className = "",
}: IntegratedFaceCaptureProps) {

  // State
  const [currentStep, setCurrentStep] = useState<CaptureFlowStep>("user_data");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [captureResults, setCaptureResults] = useState<EasyCaptureResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    message: ""
  });

  // Refs
  const userIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleUserDataSubmit = useCallback(async (data: UserData) => {
    try {
      setIsProcessing(true);
      setError(null);
      setProgress({ current: 1, total: 2, message: "Preparing face capture..." });

      // Store user data temporarily (not saved to DB yet)
      setUserData(data);

      setProgress({ current: 2, total: 2, message: "Ready for face capture!" });

      // Move to face capture step
      setTimeout(() => {
        setCurrentStep("face_capture");
        setIsProcessing(false);
      }, 1000);

    } catch (error) {
      console.error("Error preparing face capture:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to prepare face capture";
      setError(errorMessage);
      setIsProcessing(false);
      onError?.(errorMessage);
    }
  }, [onError]);

  const handleFaceCaptureComplete = useCallback(async (results: EasyCaptureResult[]) => {
    if (!userData) {
      setError("Missing user data");
      return;
    }

    try {
      setIsProcessing(true);
      setCurrentStep("processing");
      setCaptureResults(results);
      setProgress({ current: 0, total: results.length + 4, message: "Creating user record..." });

      // Create user in database
      const user = await createUser({
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
      });

      userIdRef.current = user.id;

      setProgress({ current: 1, total: results.length + 4, message: "Creating capture session..." });

      // Create capture session
      const session = await createCaptureSession(user.id, {
        device_info: navigator.userAgent,
        browser_info: `${navigator.platform} - ${navigator.language}`,
        started_at: new Date().toISOString()
      });

      sessionIdRef.current = session.id;

      setProgress({ current: 2, total: results.length + 4, message: "Processing captured images..." });

      let successfulImages = 0;
      let failedImages = 0;

      // Process each captured image
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        setProgress({
          current: i + 3,
          total: results.length + 4,
          message: `Saving ${result.step} image...`
        });

        try {
          // Extract image dimensions from base64 data
          const img = new Image();
          img.src = result.imageData;

          await new Promise((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = reject;
          });

          // Save image to database
          await saveFaceImage({
            userId: userIdRef.current,
            sessionId: sessionIdRef.current,
            step: result.step,
            imageData: result.imageData,
            imageUrl: result.imageData, // Using base64 as URL for now
            width: img.width,
            height: img.height,
            metadata: {
              face_detected: true,
              confidence_score: 0.95, // High confidence for manual capture
              processing_time: Date.now() - result.timestamp
            }
          });

          successfulImages++;
        } catch (imageError) {
          console.error(`Error saving ${result.step} image:`, imageError);
          failedImages++;
        }
      }

      setProgress({
        current: results.length + 3,
        total: results.length + 4,
        message: "Updating session status..."
      });

      // Update capture session
      await updateCaptureSession(sessionIdRef.current, {
        status: successfulImages > 0 ? "completed" : "failed",
        completed_at: new Date().toISOString(),
        total_images: results.length,
        successful_images: successfulImages,
        failed_images: failedImages
      });

      setProgress({
        current: results.length + 4,
        total: results.length + 4,
        message: "Capture completed successfully!"
      });

      // Complete the process
      setTimeout(() => {
        setCurrentStep("completed");
        setIsProcessing(false);

        const finalResult: IntegratedCaptureResult = {
          userId: userIdRef.current!,
          sessionId: sessionIdRef.current!,
          userData,
          captureResults: results,
          success: successfulImages > 0,
          error: failedImages > 0 ? `${failedImages} images failed to save` : undefined
        };

        onComplete?.(finalResult);
      }, 1000);

    } catch (error) {
      console.error("Error processing capture results:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process capture results";
      setError(errorMessage);
      setIsProcessing(false);
      setCurrentStep("error");
      onError?.(errorMessage);
    }
  }, [userData, onComplete, onError]);

  const handleFaceCaptureError = useCallback((error: string) => {
    setError(error);
    setCurrentStep("error");
    onError?.(error);
  }, [onError]);

  const handleReset = useCallback(() => {
    setCurrentStep("user_data");
    setUserData(null);
    setCaptureResults([]);
    setIsProcessing(false);
    setError(null);
    setProgress({ current: 0, total: 0, message: "" });
    userIdRef.current = null;
    sessionIdRef.current = null;
  }, []);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStepTitle = () => {
    switch (currentStep) {
      case "user_data":
        return "📝 User Information";
      case "face_capture":
        return "📸 Face Capture";
      case "processing":
        return "⚙️ Processing";
      case "completed":
        return "✅ Completed";
      case "error":
        return "❌ Error";
      default:
        return "Face Collection";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "user_data":
        return "Please provide your information to begin the face capture process.";
      case "face_capture":
        return "Follow the instructions to capture your face from different angles.";
      case "processing":
        return progress.message;
      case "completed":
        return "Your face data has been successfully collected and stored.";
      case "error":
        return error || "An error occurred during the process.";
      default:
        return "";
    }
  };

  const getProgressPercentage = () => {
    if (progress.total === 0) return 0;
    return (progress.current / progress.total) * 100;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="heading-2 mb-4">
          {getStepTitle()}
        </h1>
        <p className="text-body max-w-2xl mx-auto">
          {getStepDescription()}
        </p>
      </div>

      {/* Progress Bar */}
      {(currentStep === "processing" || currentStep === "completed") && (
        <div className="mb-8">
          <div className="progress-bar mb-3">
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-600">
            <span>{progress.current} of {progress.total}</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="">
        {currentStep === "user_data" && (
          <UserDataForm
            onSubmit={handleUserDataSubmit}
            isLoading={isProcessing}
          />
        )}

        {currentStep === "face_capture" && (
          <div>
            <div className="bg-blue-50 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-1">
                    User: {userData?.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Age: {userData?.age} • Gender: {userData?.gender}
                  </p>
                </div>
              </div>
            </div>

            <EasyFaceCapture
              onCaptureComplete={handleFaceCaptureComplete}
              onError={handleFaceCaptureError}
            />
          </div>
        )}

        {currentStep === "processing" && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6 shadow-lg">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="heading-3 mb-4">
              Processing Your Data
            </h3>
            <p className="text-body max-w-md mx-auto">
              Please wait while we securely save your information and images to our database...
            </p>
          </div>
        )}

        {currentStep === "completed" && (
          <div className="px-4 py-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Face Collection Complete!
              </h3>
              <p className="text-base text-gray-600">
                Your data has been securely saved to our database
              </p>
            </div>

            {/* Process Steps - Clean Timeline */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">1</div>
                  <span className="text-xs font-medium text-gray-600">User Info</span>
                </div>
                <div className="w-8 h-0.5 bg-green-200"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">2</div>
                  <span className="text-xs font-medium text-gray-600">Face Capture</span>
                </div>
                <div className="w-8 h-0.5 bg-green-200"></div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">3</div>
                  <span className="text-xs font-medium text-gray-600">Saved</span>
                </div>
              </div>
            </div>

            {/* Results Summary - Clean List */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Collection Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{userData?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-semibold text-gray-900">{captureResults.length} captured</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">✓ Complete</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleReset}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start New Collection
                </span>
              </button>

              <a
                href="/admin"
                className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Admin Panel
              </a>
            </div>
          </div>
        )}

        {currentStep === "error" && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl mb-8 shadow-lg">
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="heading-3 mb-4">
              Error Occurred
            </h3>
            <p className="text-body mb-8 max-w-md mx-auto">
              {error || "An unexpected error occurred during the process."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleReset}
                className="btn-primary group"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </span>
              </button>
              <a
                href="/admin"
                className="btn-secondary group"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Admin Panel
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Types are already exported above
