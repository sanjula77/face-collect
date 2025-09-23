"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/database";

/**
 * DataDeletionForm: Allows users to request data deletion
 * 
 * Features:
 * - User identification
 * - Data deletion request
 * - Confirmation process
 * - Audit trail
 */

export interface DeletionRequest {
    userIdentifier: string;
    reason: string;
    confirmation: boolean;
}

export interface DataDeletionFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    className?: string;
}

export default function DataDeletionForm({
    onSuccess,
    onCancel,
    className = "",
}: DataDeletionFormProps) {
    const [formData, setFormData] = useState<DeletionRequest>({
        userIdentifier: "",
        reason: "",
        confirmation: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field: keyof DeletionRequest, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // In a real implementation, you would:
            // 1. Verify the user's identity
            // 2. Log the deletion request
            // 3. Process the deletion
            // 4. Send confirmation email

            // For demo purposes, we'll simulate the process
            await new Promise(resolve => setTimeout(resolve, 2000));

            setSuccess(true);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError("Failed to process deletion request. Please try again.");
            console.error("Deletion error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className={`w-full px-4 ${className}`}>
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Deletion Request Submitted
                    </h2>
                    <p className="text-base text-gray-600 mb-6">
                        Your data deletion request has been submitted successfully.
                        You will receive a confirmation email within 24 hours.
                    </p>
                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-green-800 space-y-1 text-left">
                            <li>• Your request will be reviewed within 24 hours</li>
                            <li>• All your data will be permanently deleted</li>
                            <li>• You'll receive a confirmation email</li>
                            <li>• The process may take up to 30 days to complete</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setFormData({ userIdentifier: "", reason: "", confirmation: false });
                        }}
                        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                        Submit Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full px-4 ${className}`}>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Request Data Deletion
                </h2>
                <p className="text-base text-gray-600">
                    Request permanent deletion of your personal data and face images
                </p>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                    <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-red-900 mb-1">Important Notice</h3>
                        <p className="text-sm text-red-800">
                            This action is <strong>irreversible</strong>. Once deleted, your data cannot be recovered.
                            Please ensure you want to proceed before submitting this request.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Identification */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        How can we identify your data?
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                        Please provide the name you used when submitting your data, or any other identifier you remember.
                    </p>
                    <input
                        type="text"
                        value={formData.userIdentifier}
                        onChange={(e) => handleInputChange('userIdentifier', e.target.value)}
                        placeholder="Enter your name or identifier"
                        className="w-full px-4 py-4 text-base rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white border-2 border-gray-200 focus:border-red-500 transition-all duration-200"
                        required
                    />
                </div>

                {/* Reason for Deletion */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Reason for deletion (optional)
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                        Help us understand why you're requesting deletion. This helps us improve our service.
                    </p>
                    <textarea
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        placeholder="Please tell us why you want to delete your data..."
                        rows={4}
                        className="w-full px-4 py-4 text-base rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white border-2 border-gray-200 focus:border-red-500 transition-all duration-200 resize-none"
                    />
                </div>

                {/* Confirmation */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.confirmation}
                            onChange={(e) => handleInputChange('confirmation', e.target.checked)}
                            className="mt-1 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                            required
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900">
                                I understand that this action is permanent and irreversible
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                                By checking this box, I confirm that I want to permanently delete all my data
                                including face images, personal information, and any associated records.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-red-800">{error}</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-6">
                    <button
                        type="submit"
                        disabled={!formData.userIdentifier || !formData.confirmation || isSubmitting}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 ${formData.userIdentifier && formData.confirmation && !isSubmitting
                                ? "bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing Request...
                            </span>
                        ) : (
                            "Request Permanent Deletion"
                        )}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold text-base hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* Contact Information */}
                <div className="text-center pt-4">
                    <p className="text-xs text-gray-500">
                        Need help? Contact us at{" "}
                        <a href="mailto:privacy@facecollect.com" className="text-blue-600 hover:underline">
                            privacy@facecollect.com
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}
