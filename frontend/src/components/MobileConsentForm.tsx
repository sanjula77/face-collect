"use client";

import { useState } from "react";

/**
 * MobileConsentForm: Mobile-first, compact consent form
 * 
 * Features:
 * - Compact card design
 * - Mobile-optimized touch targets
 * - Simplified layout
 * - Better visual hierarchy
 * - Button at bottom of form content
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

export interface MobileConsentFormProps {
    onSubmit: (consent: ConsentData) => void;
    onCancel?: () => void;
    className?: string;
}

export default function MobileConsentForm({
    onSubmit,
    onCancel,
    className = "",
}: MobileConsentFormProps) {
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
            title: "I agree to provide my face images and basic details",
            description: "We'll collect 5 face poses and your name, age, and gender"
        },
        {
            key: 'dataUsage' as keyof ConsentData,
            title: "I agree my data may be used for AI training and research",
            description: "Your data helps improve facial recognition technology"
        },
        {
            key: 'dataRetention' as keyof ConsentData,
            title: "I agree my data may be stored securely for up to 5 years",
            description: "Data is encrypted and stored safely for research purposes"
        },
        {
            key: 'dataSharing' as keyof ConsentData,
            title: "I agree my data may be shared with trusted research partners (anonymized)",
            description: "Personal identifiers are removed before sharing"
        },
        {
            key: 'rightToDelete' as keyof ConsentData,
            title: "I understand I can request deletion of my data at any time",
            description: "You have full control over your personal information"
        },
        {
            key: 'ageVerification' as keyof ConsentData,
            title: "I confirm I am 18+ or have parental consent",
            description: "You must be 18 or older to participate in this study"
        },
        {
            key: 'privacyPolicy' as keyof ConsentData,
            title: "I have read and agree to the Privacy Policy & Terms",
            description: "Please review our privacy policy before continuing"
        }
    ];

    return (
        <div className={`w-full ${className}`}>
            {/* Header */}
            <div className="text-center mb-6 px-4 pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-4 shadow-lg">
                    <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2 tracking-tight">
                    Data Collection Consent
                </h2>
                <p className="text-sm text-gray-600">
                    Please review and agree to our data collection practices
                </p>
            </div>

            {/* Consent Form */}
            <form onSubmit={handleSubmit} className="px-4 pb-8">
                {/* Consent Items */}
                <div className="space-y-3">
                    {consentItems.map((item) => (
                        <div
                            key={item.key}
                            className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 ${consent[item.key]
                                ? 'border-blue-200 bg-blue-50/50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <label className="flex items-start space-x-3 cursor-pointer">
                                {/* Custom Checkbox */}
                                <div className="relative flex-shrink-0 mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={consent[item.key]}
                                        onChange={() => handleConsentChange(item.key)}
                                        className="sr-only"
                                        aria-describedby={`${item.key}-description`}
                                    />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${consent[item.key]
                                        ? 'bg-blue-600 border-blue-600'
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
                                    <p className="text-sm font-medium text-gray-900 leading-tight mb-1">
                                        {item.title}
                                    </p>
                                    <p id={`${item.key}-description`} className="text-xs text-gray-500 leading-tight">
                                        {item.description}
                                    </p>
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

                {/* Footer Info */}
                <div className="text-center mt-6 mb-6">
                    <p className="text-xs text-gray-500">
                        Questions? Contact us at{" "}
                        <a
                            href="mailto:privacy@facecollect.com"
                            className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                            privacy@facecollect.com
                        </a>
                    </p>
                </div>

                {/* Buttons at bottom of form */}
                <div className="space-y-3">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!allConsentsGiven || isSubmitting}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 transform active:scale-95 ${allConsentsGiven && !isSubmitting
                            ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}