import React from 'react';
import Link from 'next/link';

// ################## ----- CTA SECTION PROPS ----- ##################
// Props interface for the call-to-action section
// Configures messaging, button text, and background styling
// ############################################################
interface CTASectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundClass?: string;
}

// ################## ----- CTA SECTION COMPONENT ----- ##################
// Call-to-action section for driving user engagement
// Features centered content with prominent action button
// ##########################################################
const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundClass = 'bg-light'
}) => {
  return (
    <section className={`py-20 sm:py-28 ${backgroundClass} text-center`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-dark">{title}</h2>
        <p className="text-lg text-medium mt-4 max-w-2xl mx-auto">{subtitle}</p>
        <Link
          href={ctaLink}
          className="mt-10 inline-block px-12 py-5 rounded-full btn-apply text-xl font-bold"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
