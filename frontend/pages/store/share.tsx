import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { useAuth } from '@/hooks/useAuth';

// ################## ----- SHARE STORE PAGE COMPONENT ----- ##################
// Page for sharing store URLs and social media promotion
// Helps users promote their stores across different platforms
// ####################################################################
const ShareStore: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Generate store URL from user data
  const storeUrl = user?.storeUrl || `${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'your-store'}.youthcreatorlaunch.org`;
  const fullStoreUrl = `https://${storeUrl}`;

  // ################## ----- CLIPBOARD COPY FUNCTION ----- ##################
  // Copies store URL to clipboard with user feedback
  // Provides temporary success message to confirm action
  // ####################################################################
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullStoreUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // ################## ----- SOCIAL MEDIA SHARING FUNCTION ----- ##################
  // Opens social media platforms with pre-filled share content
  // Supports multiple platforms with custom messaging
  // ###########################################################################
  const shareToSocial = (platform: string) => {
    const text = `Check out my new store on CreatorLaunch! ${fullStoreUrl}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(fullStoreUrl);

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
        copyToClipboard();
        alert('Store URL copied! You can now paste it in your Instagram bio or story.');
        return;
      case 'email':
        shareUrl = `mailto:?subject=Check out my new store&body=${encodedText}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Layout title="Share Your Store | CreatorLaunch">
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center text-medium hover:text-dark transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              
              <h1 className="text-3xl font-bold text-dark mb-2">Share Your Store</h1>
              <p className="text-medium">
                Your store is ready! Share it with friends, family, and potential customers to start making sales.
              </p>
            </div>

            {/* Store URL Display */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">Your Store URL</h2>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1 bg-light border rounded-lg px-4 py-3">
                  <code className="text-accent font-mono">{fullStoreUrl}</code>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary text-white hover:bg-red-600'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <p className="text-sm text-medium">
                This is your unique store address. Anyone can visit this URL to see your products and make purchases.
              </p>
            </div>

            {/* Share Options */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">Share on Social Media</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => shareToSocial('twitter')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">𝕏</span>
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </button>

                <button
                  onClick={() => shareToSocial('instagram')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">📷</span>
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </button>

                <button
                  onClick={() => shareToSocial('email')}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">✉</span>
                  </div>
                  <span className="text-sm font-medium">Email</span>
                </button>
              </div>

              <div className="bg-light p-4 rounded-lg">
                <p className="text-sm text-medium mb-2">
                  <strong>💡 Sharing Tips:</strong>
                </p>
                <ul className="text-sm text-medium space-y-1">
                  <li>• Share with friends and family first</li>
                  <li>• Post in relevant social media groups</li>
                  <li>• Add your store URL to your bio</li>
                  <li>• Ask satisfied customers to share</li>
                </ul>
              </div>
            </div>

            {/* Store Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">Store Preview</h2>
                <a
                  href={fullStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-blue-600 font-medium transition-colors"
                >
                  Visit Store →
                </a>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-dark mb-2">
                    {user?.brandName || user?.name || 'Your Brand Name'}
                  </h3>
                  <p className="text-medium mb-4">
                    Your brand description will appear here
                  </p>
                  <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm">
                    Add your first product to complete your store
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShareStore;
