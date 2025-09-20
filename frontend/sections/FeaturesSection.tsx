import React from 'react';

// ################## ----- FEATURE INTERFACE ----- ##################
// Structure for individual feature items
// Includes icon, content, and animation timing
// ##########################################################
interface Feature {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

// ################## ----- FEATURES SECTION PROPS ----- ##################
// Props interface for the features section component
// Configures title, features array, and background styling
// ################################################################
interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
  backgroundClass?: string;
}

// ################## ----- FEATURES SECTION COMPONENT ----- ##################
// Section component for displaying feature grids
// Shows multiple features with icons, titles, and descriptions
// ####################################################################
const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  subtitle,
  features,
  backgroundClass = 'bg-white'
}) => {
  return (
    <section className={`py-20 sm:py-28 ${backgroundClass}`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-dark">{title}</h2>
          <p className="text-lg text-medium mt-4 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div
              key={index}
            >
              <div className="feature-icon-box mx-auto mb-4">
                <i className={`${feature.icon} fa-2x`}></i>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
