"use client";

/**
 * StepNavigation: Mobile-first step indicator
 * 
 * Features:
 * - Clean progress indicator
 * - Mobile-optimized design
 * - Accessible navigation
 * - Smooth animations
 */

export interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
    className?: string;
}

export default function StepNavigation({
    currentStep,
    totalSteps,
    steps,
    className = ""
}: StepNavigationProps) {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className={`w-full ${className}`}>
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Step {currentStep} of {totalSteps}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isPending = stepNumber > currentStep;

                    return (
                        <div key={stepNumber} className="flex flex-col items-center flex-1">
                            {/* Step Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isCompleted
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : isCurrent
                                            ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`text-xs font-medium mt-2 text-center leading-tight ${isCurrent
                                        ? 'text-blue-600'
                                        : isCompleted
                                            ? 'text-emerald-600'
                                            : 'text-gray-500'
                                    }`}
                            >
                                {step}
                            </span>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                                        }`}
                                    style={{
                                        transform: 'translateX(50%)',
                                        width: 'calc(100% - 2rem)'
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
