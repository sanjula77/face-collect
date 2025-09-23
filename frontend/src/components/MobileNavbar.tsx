"use client";

import { useState } from "react";

/**
 * MobileNavbar: Minimal, mobile-first navigation bar
 * 
 * Features:
 * - Clean, lightweight design
 * - Mobile-optimized touch targets
 * - Simple logo + menu icon
 * - Responsive behavior
 * - Accessibility compliant
 */

export interface MobileNavbarProps {
    className?: string;
}

export default function MobileNavbar({ className = "" }: MobileNavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-gray-900">Face Collect</span>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <svg
                            className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
                        <div className="px-4 py-3 space-y-2">
                            <a
                                href="/privacy"
                                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="/admin"
                                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin Panel
                            </a>
                            <a
                                href="/delete-data"
                                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Delete My Data
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
