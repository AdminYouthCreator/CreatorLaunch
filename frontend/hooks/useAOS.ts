import { useEffect } from 'react';

// ################## ----- AOS GLOBAL TYPE DECLARATION ----- ##################
// TypeScript declaration for AOS library on window object
// Allows access to AOS methods without type errors
// ####################################################################
declare global {
  interface Window {
    AOS: any;
  }
}

// ################## ----- AOS HOOK ----- ##################
// Custom hook for initializing Animate On Scroll library
// Dynamically loads AOS CSS and JS, then initializes animations
// ############################################################
export const useAOS = () => {
  useEffect(() => {
    // Load AOS CSS dynamically
    const aosCSS = document.createElement('link');
    aosCSS.rel = 'stylesheet';
    aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    document.head.appendChild(aosCSS);

    // Load AOS JavaScript library
    const aosScript = document.createElement('script');
    aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    aosScript.onload = () => {
      if (window.AOS) {
        window.AOS.init({
          duration: 800,
          once: true
        });
      }
    };
    document.head.appendChild(aosScript);

    // Cleanup function
    return () => {
      document.head.removeChild(aosCSS);
      document.head.removeChild(aosScript);
    };
  }, []);
};

export default useAOS;
