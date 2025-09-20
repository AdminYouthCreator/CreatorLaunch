import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ################## ----- ONBOARDING WELCOME PROPS ----- ##################
// Props interface for the welcome screen component
// Handles navigation callback and personalized greeting
// ####################################################################
interface OnboardingWelcomeProps {
  onNext: () => void;
  userName?: string;
}

// ################## ----- ONBOARDING WELCOME COMPONENT ----- ##################
// Initial welcome screen for the onboarding process
// Provides overview and starts the user setup journey
// ####################################################################
export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  onNext,
  userName = 'there'
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-dark mb-2">
            Welcome{userName !== 'there' ? `, ${userName}` : ', Demo User'}!
          </h1>
          
          <p className="text-medium text-lg mb-6">
            Let's set up your brand and get your store ready to launch.
          </p>
          
          <div className="text-left bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-dark mb-2">
              What we'll set up:
            </p>
            <ul className="text-sm text-medium space-y-1">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                Your unique store URL
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                Brand description
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span>
                Logo upload
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onNext}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Let's Get Started
          </button>
          
          <p className="text-xs text-medium">
            This will only take a few minutes
          </p>
        </div>
      </div>
    </div>
  );
};
