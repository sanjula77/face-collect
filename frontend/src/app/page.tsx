"use client";

import { useState, useRef } from "react";
import MobileNavbar from "@/components/MobileNavbar";
import LandingSection from "@/components/LandingSection";
import StepNavigation from "@/components/StepNavigation";
import MobileConsentForm from "@/components/MobileConsentForm";
import ConfirmationScreen from "@/components/ConfirmationScreen";
import IntegratedFaceCapture from "@/components/IntegratedFaceCapture";
import type { ConsentData } from "@/components/MobileConsentForm";
import type { IntegratedCaptureResult } from "@/components/IntegratedFaceCapture";

/**
 * Mobile-First Face Collection App
 * 
 * Features:
 * - Step-by-step guided flow
 * - Mobile-optimized design
 * - Smooth navigation
 * - Progress tracking
 * - Clean, minimal UI
 */

type AppStep = "landing" | "consent" | "face_capture" | "confirmation";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("landing");
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const [captureResult, setCaptureResult] = useState<IntegratedCaptureResult | null>(null);

  const consentSectionRef = useRef<HTMLDivElement>(null);
  const faceCaptureSectionRef = useRef<HTMLDivElement>(null);
  const confirmationSectionRef = useRef<HTMLDivElement>(null);

  const steps = ["Consent", "Data Collection", "Face Capture", "Complete"];

  const getCurrentStepNumber = () => {
    switch (currentStep) {
      case "landing": return 0;
      case "consent": return 1;
      case "face_capture": return 2;
      case "confirmation": return 3;
      default: return 0;
    }
  };

  const handleStartCollection = () => {
    setCurrentStep("consent");
    setTimeout(() => {
      consentSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleConsentSubmit = (consent: ConsentData) => {
    setConsentData(consent);
    setCurrentStep("face_capture");
    setTimeout(() => {
      faceCaptureSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleConsentCancel = () => {
    setCurrentStep("landing");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleFaceCaptureComplete = (result: IntegratedCaptureResult) => {
    setCaptureResult(result);
    setCurrentStep("confirmation");
    setTimeout(() => {
      confirmationSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleStartNew = () => {
    setCurrentStep("landing");
    setConsentData(null);
    setCaptureResult(null);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleViewAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNavbar />

      {/* Landing Section */}
      {currentStep === "landing" && (
        <LandingSection onStartCollection={handleStartCollection} />
      )}

      {/* Step Navigation - Show when not on landing */}
      {currentStep !== "landing" && (
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-md mx-auto">
            <StepNavigation
              currentStep={getCurrentStepNumber()}
              totalSteps={steps.length}
              steps={steps}
            />
          </div>
        </div>
      )}

      {/* Consent Section */}
      {currentStep === "consent" && (
        <div ref={consentSectionRef} className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto">
            <MobileConsentForm
              onSubmit={handleConsentSubmit}
              onCancel={handleConsentCancel}
            />
          </div>
        </div>
      )}

      {/* Face Capture Section */}
      {currentStep === "face_capture" && (
        <div ref={faceCaptureSectionRef} className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="max-w-md mx-auto">
            <IntegratedFaceCapture
              onComplete={handleFaceCaptureComplete}
              onError={(error) => {
                console.error('Face capture error:', error);
              }}
            />
          </div>
        </div>
      )}

      {/* Confirmation Section */}
      {currentStep === "confirmation" && (
        <div ref={confirmationSectionRef} className="min-h-screen bg-gray-50 px-4 py-8">
          <div className="max-w-md mx-auto">
            <ConfirmationScreen
              userName={captureResult?.userData?.name}
              imageCount={captureResult?.captureResults?.length || 0}
              onStartNew={handleStartNew}
              onViewAdmin={handleViewAdmin}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900">Face Collect</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Advancing AI research through secure, ethical data collection
          </p>
          <div className="flex justify-center space-x-4 text-xs">
            <a href="/privacy" className="text-gray-400 hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="/delete-data" className="text-gray-400 hover:text-gray-600 transition-colors">
              Delete Data
            </a>
            <a href="mailto:privacy@facecollect.com" className="text-gray-400 hover:text-gray-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}