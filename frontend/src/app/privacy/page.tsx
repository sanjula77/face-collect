"use client";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                        </div>
                        <a
                            href="/"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to App
                        </a>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-600 mb-8">
                            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                Face Collect ("we," "our," or "us") is committed to protecting your privacy and personal information.
                                This Privacy Policy explains how we collect, use, store, and protect your data when you use our
                                face data collection application.
                            </p>
                            <p className="text-gray-700">
                                By using our application, you consent to the data practices described in this policy.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Full name</li>
                                <li>Age</li>
                                <li>Gender (optional)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Biometric Data</h3>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Face images (5 poses: center, left, right, up, down)</li>
                                <li>Facial recognition data</li>
                                <li>Image metadata (dimensions, capture time, quality scores)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Technical Information</h3>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Device information (browser, operating system)</li>
                                <li>IP address (anonymized)</li>
                                <li>Session data</li>
                                <li>Usage analytics</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>

                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>AI Research:</strong> Training and improving facial recognition algorithms</li>
                                <li><strong>Academic Studies:</strong> Supporting research in computer vision and AI</li>
                                <li><strong>Technology Development:</strong> Improving face recognition technology</li>
                                <li><strong>Data Analysis:</strong> Understanding demographic patterns and usage</li>
                                <li><strong>Quality Assurance:</strong> Ensuring data accuracy and system performance</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                            <p className="text-gray-700 mb-4">We may share your data with:</p>

                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Research Partners:</strong> Academic institutions and research organizations</li>
                                <li><strong>AI Development Teams:</strong> Technical teams working on facial recognition</li>
                                <li><strong>Service Providers:</strong> Third-party services that help us operate our platform</li>
                            </ul>

                            <p className="text-gray-700 mb-4">
                                <strong>Important:</strong> Personal identifiers (names, ages) are anonymized before sharing.
                                Only facial recognition data and demographic information (without personal identifiers) are shared.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Storage and Security</h2>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Storage</h3>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Data is stored in secure, encrypted databases</li>
                                <li>We use industry-standard security measures</li>
                                <li>Access is restricted to authorized personnel only</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Retention</h3>
                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li>Data is retained for up to 5 years for research purposes</li>
                                <li>You can request deletion at any time</li>
                                <li>Anonymized data may be retained longer for research</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 mb-4">You have the following rights regarding your data:</p>

                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your data</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                                <li><strong>Deletion:</strong> Request deletion of your data</li>
                                <li><strong>Portability:</strong> Request data in a portable format</li>
                                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                            </ul>

                            <p className="text-gray-700">
                                To exercise these rights, contact us at{" "}
                                <a href="mailto:privacy@facecollect.com" className="text-blue-600 hover:underline">
                                    privacy@facecollect.com
                                </a>
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Age Restrictions</h2>
                            <p className="text-gray-700 mb-4">
                                Our application is intended for users 18 years and older. If you are under 18,
                                you must have parental consent to participate.
                            </p>
                            <p className="text-gray-700">
                                We do not knowingly collect data from children under 13 without parental consent.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Transfers</h2>
                            <p className="text-gray-700">
                                Your data may be transferred to and processed in countries other than your own.
                                We ensure appropriate safeguards are in place to protect your data during such transfers.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                            <p className="text-gray-700">
                                We may update this Privacy Policy from time to time. We will notify you of any
                                significant changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy or our data practices, please contact us:
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">
                                    <strong>Email:</strong>{" "}
                                    <a href="mailto:privacy@facecollect.com" className="text-blue-600 hover:underline">
                                        privacy@facecollect.com
                                    </a>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Data Protection Officer:</strong> privacy@facecollect.com
                                </p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Legal Basis</h2>
                            <p className="text-gray-700 mb-4">
                                Our legal basis for processing your data includes:
                            </p>

                            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                                <li><strong>Consent:</strong> You have given explicit consent for data processing</li>
                                <li><strong>Legitimate Interest:</strong> For research and development purposes</li>
                                <li><strong>Research:</strong> For scientific research in the public interest</li>
                            </ul>
                        </section>

                        <div className="border-t pt-8 mt-8">
                            <p className="text-sm text-gray-500 text-center">
                                This Privacy Policy is compliant with GDPR, CCPA, and other applicable privacy laws.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
