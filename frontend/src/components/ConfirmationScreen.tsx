"use client";

/**
 * ConfirmationScreen: Clean completion screen
 * 
 * Features:
 * - Success confirmation
 * - Clean, minimal design
 * - Mobile-optimized layout
 * - Action buttons
 */

export interface ConfirmationScreenProps {
    userName?: string;
    imageCount?: number;
    onStartNew?: () => void;
    onViewAdmin?: () => void;
    className?: string;
}

export default function ConfirmationScreen({
    userName,
    imageCount = 0,
    onStartNew,
    onViewAdmin,
    className = ""
}: ConfirmationScreenProps) {
    return (
        <div className={`w-full max-w-md mx-auto px-4 py-8 ${className}`}>
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-4 shadow-lg">
                    <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2 tracking-tight">
                    Collection Complete!
                </h2>
                <p className="text-base text-gray-600">
                    Your data has been securely saved
                </p>
            </div>

            {/* Process Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-center space-x-6">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">1</div>
                        <span className="text-xs font-medium text-gray-600">Consent</span>
                    </div>
                    <div className="w-6 h-0.5 bg-green-200"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">2</div>
                        <span className="text-xs font-medium text-gray-600">Capture</span>
                    </div>
                    <div className="w-6 h-0.5 bg-green-200"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">3</div>
                        <span className="text-xs font-medium text-gray-600">Saved</span>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Summary</h3>
                <div className="space-y-3">
                    {userName && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold text-gray-900">{userName}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Images:</span>
                        <span className="font-semibold text-gray-900">{imageCount} captured</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-green-600">✓ Complete</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {onStartNew && (
                    <button
                        onClick={onStartNew}
                        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Start New Collection
                        </span>
                    </button>
                )}

                {onViewAdmin && (
                    <button
                        onClick={onViewAdmin}
                        className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                    >
                        <span className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Admin Panel
                        </span>
                    </button>
                )}
            </div>

            {/* Footer Note */}
            <div className="text-center mt-6">
                <p className="text-xs text-gray-500">
                    Thank you for contributing to AI research!
                </p>
            </div>
        </div>
    );
}
