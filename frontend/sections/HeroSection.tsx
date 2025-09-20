import React from 'react';
import Link from 'next/link';

// ################## ----- HERO SECTION PROPS ----- ##################
// Props interface for the hero section component
// Configures title, subtitle, CTA, and background styling
// ############################################################
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundClass?: string;
}

// ################## ----- HERO SECTION COMPONENT ----- ##################
// Main hero section for landing pages
// Features large title, subtitle, and call-to-action button
// ##########################################################
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundClass = 'bg-light'
}) => {
  return (
    <section className={`${backgroundClass} py-24 md:py-32 text-center`}>
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black text-dark leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl font-light text-medium max-w-3xl mx-auto mt-6">
          {subtitle}
        </p>
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

export default HeroSection;
