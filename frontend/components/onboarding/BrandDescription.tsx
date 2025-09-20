import React, { useState } from 'react';

// ################## ----- BRAND DESCRIPTION PROPS ----- ##################
// Props interface for the brand description component
// Handles navigation and initial description data
// ####################################################################
interface BrandDescriptionProps {
  onNext: (description: string) => void;
  onBack: () => void;
  initialDescription?: string;
}

// ################## ----- BRAND DESCRIPTION COMPONENT ----- ##################
// Component for collecting brand description during onboarding
// Validates length and provides character count feedback
// #######################################################################
export const BrandDescription: React.FC<BrandDescriptionProps> = ({
  onNext,
  onBack,
  initialDescription = ''
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [charCount, setCharCount] = useState(initialDescription.length);
  const maxChars = 500;
  const minChars = 20;

  // ################## ----- DESCRIPTION CHANGE HANDLER ----- ##################
  // Handles textarea input changes and enforces character limits
  // Updates both description state and character count
  // #######################################################################
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setDescription(value);
      setCharCount(value.length);
    }
  };

  // ################## ----- FORM SUBMISSION HANDLER ----- ##################
  // Validates description length before proceeding to next step
  // Only allows submission if minimum character requirement is met
  // ####################################################################
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length >= minChars) {
      onNext(description.trim());
    }
  };

  // Character count validation and styling
  const isValid = description.trim().length >= minChars;
  const charCountColor = charCount < minChars ? 'text-red-500' : 
                        charCount > maxChars * 0.9 ? 'text-orange-500' : 
                        'text-medium';

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
            <span className="text-sm text-medium">Step 2 of 3</span>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            Describe Your Brand
          </h2>
          
          <p className="text-medium">
            Tell customers what your brand is all about. This will appear on your storefront.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left font-bold mb-3 text-dark">
              Brand Description
            </label>
            
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your brand in a few sentences. What makes you unique? What products or services do you offer? What's your story?"
              rows={6}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-primary focus:outline-none bg-light text-dark resize-none"
              style={{ fontSize: '16px' }}
            />
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-medium">
                {charCount < minChars && (
                  <>Need at least {minChars - charCount} more characters</>
                )}
                {charCount >= minChars && (
                  <>Looks good! Keep it engaging and authentic.</>
                )}
              </p>
              <p className={`text-sm ${charCountColor}`}>
                {charCount}/{maxChars}
              </p>
            </div>
          </div>

          {/* Example descriptions */}
          <div className="bg-light p-4 rounded-lg">
            <p className="text-sm font-semibold text-dark mb-2">
              💡 Need inspiration? Here are some examples:
            </p>
            <div className="space-y-2 text-sm text-medium">
              <p className="italic">
                "Handcrafted jewelry inspired by nature. Each piece tells a story and supports local artisans in my community."
              </p>
              <p className="italic">
                "Custom digital art and illustrations for small businesses. I help brands stand out with unique, eye-catching designs."
              </p>
              <p className="italic">
                "Sustainable skincare made from natural ingredients. Gentle on your skin and kind to the planet."
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 text-dark py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
