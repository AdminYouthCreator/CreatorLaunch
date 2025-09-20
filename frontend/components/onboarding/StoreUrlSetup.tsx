import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';

// ################## ----- STORE URL SETUP PROPS INTERFACE ----- ##################
// Props interface for the store URL setup component
// Handles navigation and initial data passing
// ############################################################################
interface StoreUrlSetupProps {
  onNext: (brandName: string) => void;
  onBack: () => void;
  initialBrandName?: string;
}

// ################## ----- STORE URL SETUP COMPONENT ----- ##################
// Component for setting up custom store URL during onboarding
// Validates brand name and checks availability in real-time
// ########################################################################
export const StoreUrlSetup: React.FC<StoreUrlSetupProps> = ({
  onNext,
  onBack,
  initialBrandName = ''
}) => {
  const { checkBrandNameAvailability } = useOnboarding();
  const [brandName, setBrandName] = useState(initialBrandName);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  // ################## ----- DEBOUNCED AVAILABILITY CHECK ----- ##################
  // Effect to validate and check brand name availability
  // Runs validation first, then checks availability with API
  // ##########################################################################
  useEffect(() => {
    if (!brandName.trim()) {
      setIsAvailable(null);
      setError('');
      return;
    }

    // Validate brand name format - only letters, numbers, and hyphens allowed
    const brandNamePattern = /^[a-zA-Z0-9-]+$/;
    if (!brandNamePattern.test(brandName)) {
      setError('Brand name can only contain letters, numbers, and hyphens');
      setIsAvailable(false);
      return;
    }

    // Check minimum length requirement
    if (brandName.length < 3) {
      setError('Brand name must be at least 3 characters long');
      setIsAvailable(false);
      return;
    }

    // Check maximum length requirement
    if (brandName.length > 20) {
      setError('Brand name must be less than 20 characters');
      setIsAvailable(false);
      return;
    }

    // Debounce the availability check to avoid excessive API calls
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      setError('');
      
      try {
        const available = await checkBrandNameAvailability(brandName);
        setIsAvailable(available);
        if (!available) {
          setError('Sorry, that name is already taken.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to check availability. Please try again.');
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [brandName]);

  // ################## ----- FORM SUBMISSION HANDLER ----- ##################
  // Handles form submission and validates before proceeding
  // Only allows submission if brand name is available and valid
  // ######################################################################
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && brandName.trim() && !error) {
      onNext(brandName.trim());
    }
  };

  // ################## ----- BRAND NAME INPUT HANDLER ----- ##################
  // Handles input changes and sanitizes the brand name
  // Converts to lowercase and removes invalid characters
  // ######################################################################
  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    setBrandName(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="text-medium hover:text-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-medium">Step 1 of 3</span>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            Reserve Your Store URL
          </h2>
          
          <p className="text-medium">
            Choose a unique name for your store. This will be your web address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left font-bold mb-3 text-dark">
              Your Store URL
            </label>
            
            <div className="relative">
              <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-colors ${
                error ? 'border-red-500' : isAvailable === true ? 'border-green-500' : 'border-gray-300 focus-within:border-primary'
              }`}>
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={brandName}
                    onChange={handleBrandNameChange}
                    placeholder="your-brand-name"
                    className="w-full px-4 py-3 pr-10 focus:outline-none bg-light text-dark"
                    style={{ fontSize: '16px' }}
                    maxLength={20}
                  />
                  
                  {/* Status indicator inside input */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {isChecking && (
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {!isChecking && isAvailable === true && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {!isChecking && isAvailable === false && error && (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="px-4 py-3 bg-gray-100 text-medium border-l">
                  .youthcreatorlaunch.org
                </span>
              </div>
            </div>
            
            {/* Helper text */}
            <p className="mt-2 text-xs text-medium">
              Use only letters, numbers, and hyphens. 3-20 characters.
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  <svg className="w-4 h-4 inline mr-2 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            {/* Success message */}
            {isAvailable === true && !error && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  <svg className="w-4 h-4 inline mr-2 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Great! This name is available.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 text-dark py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={!isAvailable || isChecking || !!error}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isChecking ? 'Checking...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
