import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import OnboardingLayout from '@/components/common/OnboardingLayout';
import { OnboardingFlow, OnboardingData } from '@/components/onboarding';
import { useAuthContext } from '@/context/AuthContext';
import { useOnboarding } from '@/hooks/useOnboarding';

// ################## ----- ONBOARDING PAGE COMPONENT ----- ##################
// Main page for user onboarding flow
// Handles authentication checks and onboarding process
// ####################################################################
const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const { user, refreshBrandData } = useAuthContext();
  const { submitOnboardingData, getOnboardingProgress, clearOnboardingProgress } = useOnboarding();
  const [isLoading, setIsLoading] = useState(true);

  // ################## ----- AUTHENTICATION AND SETUP CHECK ----- ##################
  // Effect to verify user authentication and onboarding status
  // Redirects users as needed based on their current state
  // ###########################################################################
  useEffect(() => {
    // Check authentication status
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check if user has already completed onboarding
    // TODO: Implement actual check for user's onboarding status from backend
    const hasCompletedOnboarding = user.hasCompletedOnboarding || false;
    
    if (hasCompletedOnboarding) {
      router.push('/dashboard'); // Redirect to dashboard if already onboarded
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      setIsLoading(true);

      const result = await submitOnboardingData(data);
      
      if (result.success) {
        // Clear any saved progress
        clearOnboardingProgress();
        
        // Refresh brand data to update user context
        await refreshBrandData();
        
        // Redirect to success page or dashboard
        router.push('/onboarding/success');
      } else {
        // Handle error
        console.error('Onboarding failed:', result.error);
        setIsLoading(false);
        // TODO: Show error message to user
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setIsLoading(false);
      // TODO: Show error message to user
    }
  };

  const handleCancel = () => {
    // Redirect back to previous page or dashboard
    router.push('/');
  };

  if (isLoading) {
    return (
      <OnboardingLayout title="Setting up your brand... | CreatorLaunch">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-medium">Setting up your brand...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout title="Welcome to CreatorLaunch | Brand Setup">
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onCancel={handleCancel}
        userName={user?.name || "Demo User"}
      />
    </OnboardingLayout>
  );
};

export default OnboardingPage;
