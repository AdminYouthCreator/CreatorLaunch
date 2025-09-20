import React from 'react';
import Head from 'next/head';

// ################## ----- ONBOARDING LAYOUT PROPS ----- ##################
// Props interface for the onboarding layout wrapper
// Handles page metadata for onboarding flow pages
// ################################################################
interface OnboardingLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// ################## ----- ONBOARDING LAYOUT COMPONENT ----- ##################
// Specialized layout for onboarding flow pages
// Simplified layout without header/footer, focused on the setup process
// ########################################################################
const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  title = 'Setup Your Brand | CreatorLaunch',
  description = 'Set up your brand and get your store ready to launch with CreatorLaunch.'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-light via-white to-blue-50 text-dark font-['Raleway']">
        {/* Simple header with logo */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-4">
              <img 
                src="/assets/header-logo.png" 
                alt="CreatorLaunch" 
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
};

export default OnboardingLayout;
