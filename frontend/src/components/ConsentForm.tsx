"use client";

import { useState } from "react";

/**
 * ConsentForm: Professional, mobile-first consent collection
 * 
 * Features:
 * - Clean, modern card-based design
 * - Mobile-optimized touch targets
 * - Smooth animations and transitions
 * - Accessibility compliant
 * - Professional styling with Tailwind CSS
 */

export interface ConsentData {
    dataCollection: boolean;
    dataUsage: boolean;
    dataRetention: boolean;
    dataSharing: boolean;
    rightToDelete: boolean;
    ageVerification: boolean;
    privacyPolicy: boolean;
}

export interface ConsentFormProps {
    onSubmit: (consent: ConsentData) => void;
    onCancel?: () => void;
    className?: string;
}

export default function ConsentForm({
    onSubmit,
    onCancel,
    className = "",
}: ConsentFormProps) {
    const [consent, setConsent] = useState<ConsentData>({
        dataCollection: false,
        dataUsage: false,
        dataRetention: false,
        dataSharing: false,
        rightToDelete: false,
        ageVerification: false,
        privacyPolicy: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleConsentChange = (field: keyof ConsentData) => {
        setConsent(prev => ({ ...prev, [field]: !prev[field] }));
        setShowError(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Check if all required consents are given
        const allConsentsGiven = Object.values(consent).every(value => value === true);

        if (!allConsentsGiven) {
            setShowError(true);
            setIsSubmitting(false);
            return;
        }

        try {
            onSubmit(consent);
        } catch (error) {
            console.error("Error submitting consent:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const allConsentsGiven = Object.values(consent).every(value => value === true);

    const consentItems = [
        {
            key: 'dataCollection' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            title: "I agree to provide my face images and basic details.",
            description: "We'll collect 5 face poses and your name, age, and gender."
        },
        {
            key: 'dataUsage' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            title: "I agree my data may be used for AI training and research.",
            description: "Your data helps improve facial recognition technology."
        },
        {
            key: 'dataRetention' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "I agree my data may be stored securely for up to 5 years.",
            description: "Data is encrypted and stored safely for research purposes."
        },
        {
            key: 'dataSharing' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: "I agree my data may be shared with trusted research partners (anonymized).",
            description: "Personal identifiers are removed before sharing."
        },
        {
            key: 'rightToDelete' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            title: "I understand I can request deletion of my data at any time.",
            description: "You have full control over your personal information."
        },
        {
            key: 'ageVerification' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            title: "I confirm I am 18+ or have parental consent.",
            description: "You must be 18 or older to participate in this study."
        },
        {
            key: 'privacyPolicy' as keyof ConsentData,
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "I have read and agree to the Privacy Policy & Terms.",
            description: "Please review our privacy policy before continuing."
        }
    ];

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Data Collection Consent
                </h2>
                <p className="text-sm text-gray-600">
                    Please review and agree to our data collection practices
                </p>
            </div>

            {/* Consent Form */}
            <form onSubmit={handleSubmit} className="pb-24">
                {/* Consent Items */}
                <div className="space-y-3">
                    {consentItems.map((item) => (
                        <div
                            key={item.key}
                            className="consent-card bg-gray-50 rounded-lg border-2 border-gray-200 py-2.5 px-3 hover:border-indigo-200 hover:bg-white transition-all duration-200 shadow-sm"
                            style={{
                                backgroundColor: '#f9fafb',
                                borderColor: '#e5e7eb',
                                borderRadius: '0.5rem',
                                padding: '0.625rem 0.75rem'
                            }}
                        >
                            <label className="flex items-center space-x-3 cursor-pointer">
                                {/* Custom Checkbox */}
                                <div className="relative flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={consent[item.key]}
                                        onChange={() => handleConsentChange(item.key)}
                                        className="sr-only"
                                        aria-describedby={`${item.key}-description`}
                                    />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${consent[item.key]
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-white border-gray-300'
                                        }`}>
                                        {consent[item.key] && (
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start space-x-2">
                                        <div className="flex-shrink-0 mt-0.5">
                                            <div className="w-4 h-4 text-indigo-600">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 leading-tight">
                                                {item.title}
                                            </p>
                                            <p id={`${item.key}-description`} className="text-xs text-gray-500 mt-0.5 leading-tight">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Error Message */}
                {showError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-medium text-red-800">
                                Please agree to all items to continue
                            </p>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={!allConsentsGiven || isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 ${allConsentsGiven && !isSubmitting
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Continue to Data Collection
                            </span>
                        )}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium text-xs hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 mt-2"
                        >
                            Cancel
                        </button>
                    )}

                    {/* Footer Info */}
                    <div className="text-center mt-4">
                        <p className="text-xs text-gray-500">
                            Questions? Contact us at{" "}
                            <a
                                href="mailto:privacy@facecollect.com"
                                className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                            >
                                privacy@facecollect.com
                            </a>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}