import React, { useState } from 'react';
import { OnboardingWelcome } from './OnboardingWelcome';
import { StoreUrlSetup } from './StoreUrlSetup';
import { BrandDescription } from './BrandDescription';
import { LogoUpload } from './LogoUpload';

// ################## ----- ONBOARDING DATA INTERFACE ----- ##################
// Data structure for complete onboarding information
// Exported for use in other components that need this data
// ######################################################################
export interface OnboardingData {
  brandName: string;
  description: string;
  logoFile?: File;
  designLater?: boolean;
}

// ################## ----- ONBOARDING FLOW PROPS ----- ##################
// Props interface for the main onboarding flow component
// Handles completion callbacks and initial data
// ################################################################
interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  onCancel?: () => void;
  userName?: string;
  initialData?: Partial<OnboardingData>;
}

// ################## ----- ONBOARDING FLOW COMPONENT ----- ##################
// Main component that orchestrates the entire onboarding process
// Manages step navigation and data collection across all steps
// ########################################################################
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onCancel,
  userName,
  initialData = {}
}) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'url' | 'description' | 'logo'>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(initialData);

  // ################## ----- STEP NAVIGATION HANDLERS ----- ##################
  // Functions to handle progression between onboarding steps
  // Each handler updates state and moves to the next step
  // ####################################################################
  const handleWelcomeNext = () => {
    setCurrentStep('url');
  };

  const handleUrlNext = (brandName: string) => {
    setOnboardingData(prev => ({ ...prev, brandName }));
    setCurrentStep('description');
  };

  const handleDescriptionNext = (description: string) => {
    setOnboardingData(prev => ({ ...prev, description }));
    setCurrentStep('logo');
  };

  const handleLogoComplete = (logoFile?: File, designLater?: boolean) => {
    const finalData: OnboardingData = {
      brandName: onboardingData.brandName || '',
      description: onboardingData.description || '',
      logoFile,
      designLater
    };
    onComplete(finalData);
  };

  // ################## ----- BACKWARD NAVIGATION HANDLERS ----- ##################
  // Functions to handle going back to previous steps
  // Allows users to correct information or change their choices
  // ######################################################################
  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleBackToUrl = () => {
    setCurrentStep('url');
  };

  const handleBackToDescription = () => {
    setCurrentStep('description');
  };

  // Handle escape key to cancel (if onCancel is provided)
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onCancel) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  switch (currentStep) {
    case 'welcome':
      return (
        <OnboardingWelcome
          onNext={handleWelcomeNext}
          userName={userName}
        />
      );

    case 'url':
      return (
        <StoreUrlSetup
          onNext={handleUrlNext}
          onBack={handleBackToWelcome}
          initialBrandName={onboardingData.brandName}
        />
      );

    case 'description':
      return (
        <BrandDescription
          onNext={handleDescriptionNext}
          onBack={handleBackToUrl}
          initialDescription={onboardingData.description}
        />
      );

    case 'logo':
      return (
        <LogoUpload
          onComplete={handleLogoComplete}
          onBack={handleBackToDescription}
        />
      );

    default:
      return null;
  }
};
