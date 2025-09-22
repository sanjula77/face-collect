"use client";

import { useState } from "react";

/**
 * UserDataForm: Professional user data collection form
 * 
 * Features:
 * - Clean, modern form design
 * - Input validation
 * - Professional styling
 * - Accessibility support
 */

// ============================================================================
// TYPES
// ============================================================================

export interface UserData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface UserDataFormProps {
  onSubmit: (data: UserData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UserDataForm({
  onSubmit,
  onCancel,
  isLoading = false,
  className = "",
}: UserDataFormProps) {

  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: 0,
    gender: "prefer_not_to_say",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserData, boolean>>>({});

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateField = (field: keyof UserData, value: any): string | null => {
    switch (field) {
      case "name":
        if (!value || value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        if (value.trim().length > 50) {
          return "Name must be less than 50 characters";
        }
        break;
      case "age":
        if (!value || value < 1 || value > 120) {
          return "Age must be between 1 and 120";
        }
        break;
    }
    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Required fields
    const requiredFields: (keyof UserData)[] = ["name", "age"];

    for (const field of requiredFields) {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }


    setErrors(newErrors);
    return isValid;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof UserData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      age: 0,
      gender: "prefer_not_to_say",
    });
    setErrors({});
    setTouched({});
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getFieldError = (field: keyof UserData) => {
    return touched[field] ? errors[field] : null;
  };

  const isFieldInvalid = (field: keyof UserData) => {
    return touched[field] && errors[field];
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`w-full px-4 ${className}`}>
      {/* Mobile-First Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          User Information
        </h2>
        <p className="text-base text-gray-600">
          Tell us a bit about yourself to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={`w-full px-4 py-4 text-base rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isFieldInvalid("name")
              ? "bg-red-50 border-2 border-red-200 focus:ring-red-500"
              : "bg-white border-2 border-gray-200 focus:border-blue-500"
              }`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {getFieldError("name") && (
            <p className="text-sm text-red-600">{getFieldError("name")}</p>
          )}
        </div>

        {/* Age Field */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-semibold text-gray-800">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="age"
            min="1"
            max="120"
            value={formData.age || ""}
            onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
            onBlur={() => handleBlur("age")}
            className={`w-full px-4 py-4 text-base rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isFieldInvalid("age")
              ? "bg-red-50 border-2 border-red-200 focus:ring-red-500"
              : "bg-white border-2 border-gray-200 focus:border-blue-500"
              }`}
            placeholder="Enter your age"
            disabled={isLoading}
          />
          {getFieldError("age") && (
            <p className="text-sm text-red-600">{getFieldError("age")}</p>
          )}
        </div>

        {/* Gender Field */}
        <div className="space-y-2">
          <label htmlFor="gender" className="block text-sm font-semibold text-gray-800">
            Gender
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-4 py-4 text-base rounded-xl bg-white border-2 border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option value="prefer_not_to_say">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>


        {/* Action Buttons */}
        <div className="pt-6 space-y-4">
          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                Start Face Capture
              </span>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Types are already exported above
