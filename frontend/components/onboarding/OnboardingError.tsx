import React from 'react';

interface OnboardingErrorProps {
  error: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const OnboardingError: React.FC<OnboardingErrorProps> = ({
  error,
  onRetry,
  onCancel
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md w-full p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-dark mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-medium mb-6">
          {error}
        </p>

        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-gray-200 text-dark py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
