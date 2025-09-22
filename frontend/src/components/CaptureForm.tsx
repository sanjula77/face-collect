"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CaptureForm({ fileUrl }: { fileUrl: string | null }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    consent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.age && (Number(formData.age) < 1 || Number(formData.age) > 120)) {
      newErrors.age = "Age must be between 1 and 120";
    }

    if (!formData.consent) {
      newErrors.consent = "You must give consent to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      setStatus({ type: 'error', message: 'Please fix the errors below' });
      return;
    }

    if (!fileUrl) {
      setStatus({ type: 'error', message: 'No image captured yet. Please capture a photo first.' });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("face_metadata").insert([
        {
          name: formData.name.trim(),
          age: formData.age ? Number(formData.age) : null,
          gender: formData.gender || null,
          consent: formData.consent,
          file_url: fileUrl,
        },
      ]);

      if (error) {
        console.error(error);
        setStatus({ type: 'error', message: 'Failed to save data. Please try again.' });
      } else {
        setStatus({ type: 'success', message: 'Data saved successfully!' });
        // Reset form
        setFormData({ name: "", age: "", gender: "", consent: false });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="form-name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="form-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md ${
              errors.name ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            required
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600 mt-1 animate-shake">{errors.name}</p>
          )}
        </div>

        {/* Age Field */}
        <div>
          <label htmlFor="form-age" className="block text-sm font-semibold text-gray-700 mb-2">
            Age (Optional)
          </label>
          <input
            type="number"
            id="form-age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md ${
              errors.age ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your age"
            min="1"
            max="120"
            aria-describedby={errors.age ? "age-error" : undefined}
          />
          {errors.age && (
            <p id="age-error" className="text-sm text-red-600 mt-1 animate-shake">{errors.age}</p>
          )}
        </div>

        {/* Gender Field */}
        <div>
          <label htmlFor="form-gender" className="block text-sm font-semibold text-gray-700 mb-2">
            Gender (Optional)
          </label>
          <select
            id="form-gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
            aria-describedby={errors.gender ? "gender-error" : undefined}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p id="gender-error" className="text-sm text-red-600 mt-1 animate-shake">{errors.gender}</p>
          )}
        </div>

        {/* Consent Field */}
        <div>
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="form-consent"
              name="consent"
              checked={formData.consent}
              onChange={handleInputChange}
              className={`mt-1 h-5 w-5 text-blue-600 focus:ring-4 focus:ring-blue-500/50 border-gray-300 rounded-lg transition-all duration-300 ${
                errors.consent ? 'border-red-500 focus:ring-red-500/50' : ''
              }`}
              required
              aria-describedby={errors.consent ? "consent-error" : undefined}
            />
            <label htmlFor="form-consent" className="text-sm text-gray-700 leading-relaxed">
              I consent to my data being collected for face recognition research purposes. 
              This data will be used securely and in accordance with privacy regulations. *
            </label>
          </div>
          {errors.consent && (
            <p id="consent-error" className="text-sm text-red-600 mt-2 animate-shake">{errors.consent}</p>
          )}
        </div>

        {/* Status Message */}
        {status && (
          <div className={`p-4 rounded-xl transition-all duration-300 animate-fade-in ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-start space-x-3">
              {status.type === 'success' && (
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status.type === 'error' && (
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {status.type === 'info' && (
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {status.type === 'success' ? 'Success' : status.type === 'error' ? 'Error' : 'Info'}
                </p>
                <p className="text-sm mt-1">{status.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !fileUrl}
          className="group w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Information
            </span>
          )}
        </button>

        {/* File URL Status */}
        {!fileUrl && (
          <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">No Image Captured</p>
                <p className="text-sm text-amber-700 mt-1">
                  Please capture a photo using the camera before submitting your information.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}