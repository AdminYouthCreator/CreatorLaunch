import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import { useAuth } from '@/hooks/useAuth';
import { brandAPI } from '@/utils/api';

const getRootDomain = () => {
  return process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org';
};

const getPublicStoreUrl = (subdomain: string) => {
  const domain = getRootDomain();

  if (!subdomain) {
    return `https://${domain}`;
  }

  return `https://${subdomain}.${domain}`;
};

const ShareStore: React.FC = () => {
  const { user } = useAuth();

  const [brand, setBrand] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    try {
      setLoading(true);
      const response = await brandAPI.getUserBrand();
      setBrand(response.data || response.brand || response);
    } catch (err) {
      console.error('Failed to load brand for share page:', err);
    } finally {
      setLoading(false);
    }
  };

  const subdomain = brand?.subdomain || '';
  const fullStoreUrl = getPublicStoreUrl(subdomain);
  const fallbackStorePath = subdomain ? `/store/${subdomain}` : '/dashboard';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullStoreUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out my store on CreatorLaunch! ${fullStoreUrl}`;
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
            <div className="mb-8">
              <Link
                href="/dashboard"
                className="flex items-center text-medium hover:text-dark transition-colors mb-4"
              >
                ← Back to Dashboard
              </Link>

              <h1 className="text-3xl font-bold text-dark mb-2">Share Your Store</h1>
              <p className="text-medium">
                Share your storefront with friends, family, and potential customers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">Your Store URL</h2>

              {loading ? (
                <div className="animate-pulse h-12 bg-gray-100 rounded-lg"></div>
              ) : subdomain ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex-1 bg-light border rounded-lg px-4 py-3 overflow-x-auto">
                      <code className="text-accent font-mono whitespace-nowrap">
                        {fullStoreUrl}
                      </code>
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
                    This is your future public custom subdomain URL. Until wildcard domains are
                    connected, you can preview your store using the button below.
                  </p>
                </>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg p-4">
                  No store subdomain found. Finish onboarding first.
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">Share on Social Media</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => shareToSocial('facebook')}
                  disabled={!subdomain}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <span className="text-sm font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => shareToSocial('twitter')}
                  disabled={!subdomain}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">𝕏</span>
                  </div>
                  <span className="text-sm font-medium">Twitter</span>
                </button>

                <button
                  onClick={() => shareToSocial('instagram')}
                  disabled={!subdomain}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-sm">📷</span>
                  </div>
                  <span className="text-sm font-medium">Instagram</span>
                </button>

                <button
                  onClick={() => shareToSocial('email')}
                  disabled={!subdomain}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                  <li>• Add your store URL to your social media bio</li>
                  <li>• Post behind-the-scenes content about your products</li>
                  <li>• Ask satisfied customers to share your store</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-dark">Store Preview</h2>
                <Link
                  href={fallbackStorePath}
                  className="text-accent hover:text-blue-600 font-medium transition-colors"
                >
                  Visit Store →
                </Link>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-8 bg-gray-50">
                <div className="text-center">
                  {brand?.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.brandName}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  )}

                  <h3 className="text-lg font-semibold text-dark mb-2">
                    {brand?.brandName || user?.name || 'Your Brand Name'}
                  </h3>

                  <p className="text-medium mb-4">
                    {brand?.description || 'Your brand description will appear here.'}
                  </p>

                  <Link
                    href={fallbackStorePath}
                    className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Preview Store
                  </Link>
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
