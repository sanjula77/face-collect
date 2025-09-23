"use client";

import { useState } from "react";
import IntegratedFaceCapture from "@/components/IntegratedFaceCapture";
import ConsentForm, { ConsentData } from "@/components/ConsentForm";

export default function Home() {
  const [hasConsent, setHasConsent] = useState(false);
  const [consentData, setConsentData] = useState<ConsentData | null>(null);

  const handleConsentSubmit = (consent: ConsentData) => {
    setConsentData(consent);
    setHasConsent(true);
  };

  const handleConsentCancel = () => {
    setHasConsent(false);
    setConsentData(null);
  };
  return (
    <div className="min-h-screen">
      {/* Professional Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Face Collect</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Professional Data Collection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow"></div>
                <span className="text-xs font-medium text-emerald-700">System Online</span>
              </div>
              <a
                href="/privacy"
                className="btn-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
              >
                Privacy
              </a>
              <a
                href="/admin"
                className="btn-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        <div className="container-custom relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Hero Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-fade-in">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="heading-1 mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Professional Face Data Collection
              </span>
            </h1>

            <p className="text-body max-w-3xl mx-auto mb-8 animate-slide-up">
              Experience our advanced guided face enrollment system with intelligent pose detection and anti-spoofing protection.
              Follow our intuitive step-by-step process to capture your face data securely and accurately.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-12 animate-slide-up">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 rounded-full shadow-md">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 rounded-full shadow-md">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">Fast & Easy</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 rounded-full shadow-md">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-semibold text-gray-700">AI-Powered</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="animate-scale-in">
              <button
                onClick={() => document.getElementById('capture-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary btn-lg group"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Face Collection
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Capture Flow */}
      <section id="capture-section" className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="card-elevated">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="heading-3 mb-3">Complete Face Collection</h2>
                <p className="text-body">Professional data collection with secure database storage</p>
              </div>
              {!hasConsent ? (
                <ConsentForm
                  onSubmit={handleConsentSubmit}
                  onCancel={handleConsentCancel}
                />
              ) : (
                <IntegratedFaceCapture
                  onComplete={(result) => {
                    console.log('Complete capture process finished:', result);
                  }}
                  onError={(error) => {
                    console.error('Capture process error:', error);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview Section */}
      <section className="section-padding bg-white/30 backdrop-blur-sm">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">How It Works</h2>
              <p className="text-body max-w-2xl mx-auto">
                Our streamlined process makes face data collection simple, secure, and professional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card-interactive text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="heading-4 mb-3">User Information</h3>
                <p className="text-body">Provide your name, age, and gender details securely</p>
              </div>

              <div className="card-interactive text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="heading-4 mb-3">Face Capture</h3>
                <p className="text-body">Capture 5 poses: Center, Left, Right, Up, Down</p>
              </div>

              <div className="card-interactive text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h3 className="heading-4 mb-3">Secure Storage</h3>
                <p className="text-body">All data automatically saved to encrypted database</p>
              </div>

              <div className="card-interactive text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="heading-4 mb-3">Completion</h3>
                <p className="text-body">Receive confirmation and access admin panel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container-custom py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold">Face Collect</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
              Advancing AI research through secure, ethical, and professional data collection.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-full">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-medium text-gray-300">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium text-gray-300">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-full">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm font-medium text-gray-300">AI-Powered</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="/delete-data"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Delete My Data
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="mailto:privacy@facecollect.com"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Contact Privacy
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              &copy; 2024 Face Collect. All rights reserved. Built with privacy and security in mind.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}