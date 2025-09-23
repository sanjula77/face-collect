"use client";

/**
 * LandingSection: Clean, mobile-first landing section
 * 
 * Features:
 * - Minimal, focused design
 * - Clear call-to-action
 * - Mobile-optimized layout
 * - Smooth animations
 */

export interface LandingSectionProps {
    onStartCollection: () => void;
    className?: string;
}

export default function LandingSection({ onStartCollection, className = "" }: LandingSectionProps) {
    return (
        <section className={`min-h-screen flex items-center justify-center px-4 pt-2 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${className}`}>
            <div className="max-w-2xl mx-auto text-center">
                {/* Hero Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-pulse">
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4 leading-tight tracking-tight">
                    Face Data Collection
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Help advance AI research by contributing your face data securely and ethically.
                </p>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-24">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/80 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Secure & Private</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/80 rounded-full shadow-sm">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Quick & Easy</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onStartCollection}
                    className="w-full max-w-sm mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95"
                >
                    <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start Face Collection
                    </span>
                </button>

                {/* Footer Note */}
                <p className="text-sm text-gray-500 mt-6">
                    Takes about 2-3 minutes • Your data is protected
                </p>
            </div>
        </section>
    );
}
