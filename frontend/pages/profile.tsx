// pages/profile.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@/components/common/Layout';
import { useAuthContext } from '@/context/AuthContext';
import { authAPI } from '@/utils/api';
import { useRouter } from 'next/router';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
  dob: string;
  parentEmail?: string;
  parentalConsent: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfile(response.user);
    } catch (err: any) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout title="Profile | CreatorLaunch" description="Your CreatorLaunch profile">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Profile | CreatorLaunch" description="Your CreatorLaunch profile">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchProfile}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile | CreatorLaunch" description="Your CreatorLaunch profile">
      <div className="min-h-screen bg-light py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mr-6">
                {profile?.username ? profile.username.charAt(0).toUpperCase() : (profile?.email ? profile.email.charAt(0).toUpperCase() : '?')}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-dark">{profile?.username || 'Unknown User'}</h1>
                <p className="text-medium">{profile?.email || 'No email provided'}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-medium mb-1">Username</label>
                      <div className="px-4 py-3 bg-light rounded-lg text-dark">
                        {profile?.username || 'Not provided'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medium mb-1">Email Address</label>
                      <div className="px-4 py-3 bg-light rounded-lg text-dark flex items-center justify-between">
                        <span>{profile?.email || 'Not provided'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          profile?.emailVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profile?.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medium mb-1">Member Since</label>
                      <div className="px-4 py-3 bg-light rounded-lg text-dark">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Not available'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medium mb-1">Role</label>
                      <div className="px-4 py-3 bg-light rounded-lg text-dark">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          profile?.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {profile?.role || 'Creator'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medium mb-1">Date of Birth</label>
                      <div className="px-4 py-3 bg-light rounded-lg text-dark">
                        {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not provided'}
                      </div>
                    </div>
                    {profile?.parentEmail && (
                      <div>
                        <label className="block text-sm font-medium text-medium mb-1">Parent/Guardian Email</label>
                        <div className="px-4 py-3 bg-light rounded-lg text-dark">
                          {profile.parentEmail}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-dark mb-4">Account Actions</h2>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 border border-medium text-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Update Profile
                    </button>
                    {!profile?.emailVerified && (
                      <button className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                        Resend Verification Email
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-600 mb-3">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
