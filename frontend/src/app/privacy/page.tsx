"use client";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Mobile-First Header */}
            <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Privacy Policy</h1>
                        </div>
                        <a
                            href="/"
                            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Back to App
                        </a>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-md mx-auto px-4 py-6">
                {/* Last Updated Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-blue-800">
                            Last updated: {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Section 1: Introduction */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Introduction</h2>
                    </div>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                        <p>
                            Face Collect ("we," "our," or "us") is committed to protecting your privacy and personal information.
                            This Privacy Policy explains how we collect, use, store, and protect your data when you use our
                            face data collection application.
                        </p>
                        <p>
                            By using our application, you consent to the data practices described in this policy.
                        </p>
                    </div>
                </div>

                {/* Section 2: Information We Collect */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Information We Collect</h2>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Full name</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Age</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Gender (optional)</span>
                            </div>
                        </div>
                    </div>

                    {/* Biometric Data */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <h3 className="text-base font-semibold text-gray-800">Biometric Data</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Face images (5 poses: center, left, right, up, down)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Facial recognition data</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Image metadata (dimensions, capture time, quality scores)</span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Information */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            <h3 className="text-base font-semibold text-gray-800">Technical Information</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Device information (browser, operating system)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">IP address (anonymized)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Session data</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-gray-700 text-sm">Usage analytics</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: How We Use Your Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">How We Use Your Information</h2>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm">We use your information for the following purposes:</p>
                    <div className="space-y-3">
                        <div className="bg-indigo-50 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <div>
                                    <span className="font-semibold text-indigo-800 text-sm">AI Research:</span>
                                    <span className="text-gray-700 text-sm ml-1">Training and improving facial recognition algorithms</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <div>
                                    <span className="font-semibold text-indigo-800 text-sm">Academic Studies:</span>
                                    <span className="text-gray-700 text-sm ml-1">Supporting research in computer vision and AI</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <span className="font-semibold text-indigo-800 text-sm">Technology Development:</span>
                                    <span className="text-gray-700 text-sm ml-1">Improving face recognition technology</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Points Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Key Points
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-blue-800">Personal data is anonymized before sharing</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-blue-800">Data stored securely with encryption</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-blue-800">You can request data deletion anytime</span>
                        </div>
                        <div className="flex items-start space-x-2">
                            <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-blue-800">Used only for AI research and development</span>
                        </div>
                    </div>
                </div>

                {/* Your Rights */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Your Rights</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-semibold text-gray-800 text-sm">Access & Download</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="font-semibold text-gray-800 text-sm">Correct Information</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="font-semibold text-gray-800 text-sm">Delete Data</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Legal */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Contact & Legal</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">Questions or Concerns?</h4>
                            <a
                                href="mailto:privacy@facecollect.com"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                privacy@facecollect.com
                            </a>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">Age Requirement</h4>
                            <p className="text-gray-700 text-sm">Must be 18+ or have parental consent</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-800 text-sm mb-2">Data Retention</h4>
                            <p className="text-gray-700 text-sm">Up to 5 years for research purposes</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-white font-semibold">GDPR & CCPA Compliant</span>
                    </div>
                    <p className="text-blue-100 text-sm">
                        This Privacy Policy is compliant with international privacy laws
                    </p>
                </div>
            </main>
        </div>
    );
}
