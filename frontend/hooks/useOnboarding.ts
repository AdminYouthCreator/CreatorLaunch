import { useState } from 'react';
import { brandAPI, uploadAPI } from '../utils/api';

// ################## ----- ONBOARDING DATA INTERFACE ----- ##################
// Main data structure for the onboarding flow
// Captures all the essential info we need from users during setup
// #########################################################################
export interface OnboardingData {
  brandName: string;
  description: string;
  logoFile?: File;
  designLater?: boolean;
}

// ################## ----- ONBOARDING RESPONSE INTERFACE ----- ##################
// Response structure for onboarding API calls
// Handles both success and error cases consistently
// #############################################################################
export interface OnboardingResponse {
  success: boolean;
  storeUrl?: string;
  message?: string;
  error?: string;
}

// ################## ----- ONBOARDING HOOK ----- ##################
// Main hook that handles all onboarding functionality
// Manages the entire user setup process from start to finish
// ################################################################
export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ################## ----- BRAND NAME AVAILABILITY CHECKER ----- ##################
  // Function to check if a brand name is already taken
  // Uses real API to check brand name availability
  // ##############################################################################
  const checkBrandNameAvailability = async (brandName: string): Promise<boolean> => {
    try {
      setError(null);
      
      // Generate store URL from brand name
      const storeUrl = brandName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const response = await brandAPI.checkStoreUrl(storeUrl);
      return response.available;
    } catch (error: any) {
      console.error('Brand name check failed:', error);
      setError(error.message || 'Failed to check brand name availability');
      return false;
    }
  };

  // ################## ----- SUBMIT ONBOARDING DATA ----- ##################
  // Handles the final submission of all onboarding data
  // Process the form data and create the user's store
  // ################################################################
  const submitOnboardingData = async (data: OnboardingData): Promise<OnboardingResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate store URL from brand name
      const storeUrl = data.brandName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Create brand first
      const brandData = {
        name: data.brandName,
        description: data.description,
        storeUrl
      };

      const brandResponse = await brandAPI.create(brandData);
      
      // If logo upload is needed and not designing later, upload logo separately
      if (data.logoFile && !data.designLater) {
        try {
          await uploadAPI.uploadLogo(data.logoFile);
        } catch (uploadError: any) {
          console.error('Logo upload failed:', uploadError);
          // Don't fail the entire process for logo upload
        }
      }
      
      return {
        success: true,
        storeUrl: brandResponse.fullUrl || `${storeUrl}.youthcreatorlaunch.org`,
        message: 'Brand created successfully!'
      };
    } catch (error: any) {
      console.error('Onboarding submission failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to complete onboarding. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- SAVE PROGRESS FUNCTION ----- ##################
  // Saves user progress during onboarding flow
  // Uses localStorage for now, will switch to API later
  // ################################################################
  const saveOnboardingProgress = async (step: string, data: Partial<OnboardingData>) => {
    try {
      // Save to localStorage for now
      const progressData = {
        step,
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('onboarding_progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  };

  // ################## ----- GET PROGRESS FUNCTION ----- ##################
  // Retrieves saved onboarding progress for users
  // Allows users to continue where they left off
  // ################################################################
  const getOnboardingProgress = (): { step: string; data: Partial<OnboardingData> } | null => {
    try {
      const saved = localStorage.getItem('onboarding_progress');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Failed to get onboarding progress:', error);
      return null;
    }
  };

  // ################## ----- CLEAR PROGRESS FUNCTION ----- ##################
  // Removes saved progress data when onboarding is complete
  // Keeps the system clean and prevents stale data
  // ################################################################
  const clearOnboardingProgress = () => {
    try {
      localStorage.removeItem('onboarding_progress');
    } catch (error) {
      console.error('Failed to clear onboarding progress:', error);
    }
  };

  return {
    isLoading,
    error,
    checkBrandNameAvailability,
    submitOnboardingData,
    saveOnboardingProgress,
    getOnboardingProgress,
    clearOnboardingProgress
  };
};
