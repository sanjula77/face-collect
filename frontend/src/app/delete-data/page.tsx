"use client";

import DataDeletionForm from "@/components/DataDeletionForm";

export default function DeleteDataPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
            {/* Mobile-First Header */}
            <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Delete My Data</h1>
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
                <DataDeletionForm />
            </main>
        </div>
    );
}
