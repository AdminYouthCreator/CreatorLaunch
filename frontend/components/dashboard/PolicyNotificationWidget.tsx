import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import SubdomainPolicyManager, { 
  PolicyViolation, 
  UserActivityData,
  formatPolicyViolation,
  getRecommendedActions 
} from '@/utils/systemPolicies';

// ################## ----- POLICY NOTIFICATION COMPONENT ----- ##################
// Component for displaying subdomain inactivity policy notifications
// Shows warnings and provides actions for users at risk of domain release
// Only displays when there are actual policy violations
// ##########################################################################
const PolicyNotificationWidget: React.FC = () => {
  const { user } = useAuth();
  const [violation, setViolation] = useState<PolicyViolation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // ################## ----- LOAD POLICY STATUS ----- ##################
  useEffect(() => {
    if (user) {
      checkPolicyStatus();
    }
  }, [user]);

  const checkPolicyStatus = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to get user activity data
      // For now, we'll only show violations if there's real data
      // This would typically come from a backend API endpoint
      
      // Since we don't have real user activity tracking yet,
      // we won't show any violations by default
      setViolation(null);
      
    } catch (error) {
      console.error('Failed to check policy status:', error);
      setViolation(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ################## ----- ACTION HANDLERS ----- ##################
  const handleDismiss = () => {
    setIsDismissed(true);
    // TODO: Save dismissal status to prevent showing again for this session
  };

  const handleTakeAction = () => {
    // TODO: Implement specific actions based on violation type
    console.log('Taking action for policy violation:', violation);
  };

  // ################## ----- RENDER CONDITIONS ----- ##################
  if (isLoading || !violation || isDismissed) {
    return null;
  }

  // ################## ----- NOTIFICATION STYLING ----- ##################
  const getNotificationStyle = () => {
    switch (violation.violationType) {
      case 'INACTIVITY_WARNING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'DOMAIN_RELEASE_PENDING':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'DOMAIN_RELEASED':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconForViolationType = () => {
    switch (violation.violationType) {
      case 'INACTIVITY_WARNING':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'DOMAIN_RELEASE_PENDING':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'DOMAIN_RELEASED':
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const recommendedActions = getRecommendedActions(violation);

  // ################## ----- MAIN RENDER ----- ##################
  return (
    <div className={`border rounded-lg p-4 ${getNotificationStyle()}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIconForViolationType()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">
                {violation.violationType === 'INACTIVITY_WARNING' && 'Subdomain Activity Warning'}
                {violation.violationType === 'DOMAIN_RELEASE_PENDING' && 'Subdomain Release Pending'}
                {violation.violationType === 'DOMAIN_RELEASED' && 'Subdomain Released'}
              </h3>
              
              <p className="text-sm mt-1">
                {formatPolicyViolation(violation)}
              </p>

              {/* Release Date for Pending */}
              {violation.violationType === 'DOMAIN_RELEASE_PENDING' && violation.releaseDate && (
                <p className="text-xs mt-2 font-medium">
                  Release Date: {violation.releaseDate.toLocaleDateString()}
                </p>
              )}

              {/* Recommended Actions */}
              {recommendedActions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium mb-2">Recommended actions:</p>
                  <ul className="text-xs space-y-1">
                    {recommendedActions.slice(0, 2).map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-1 h-1 rounded-full bg-current mt-1.5 mr-2 flex-shrink-0"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="text-current hover:text-opacity-70 transition-colors ml-4"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          {violation.canAppeal && (
            <div className="flex space-x-2 mt-4">
              {violation.violationType === 'INACTIVITY_WARNING' && (
                <button
                  onClick={() => window.location.href = '/products/new'}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded border border-current transition-colors"
                >
                  Add Product
                </button>
              )}
              
              {violation.violationType === 'DOMAIN_RELEASE_PENDING' && (
                <button
                  onClick={() => window.location.href = '/store/share'}
                  className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded border border-current transition-colors"
                >
                  Share Store
                </button>
              )}

              <button
                onClick={handleTakeAction}
                className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded border border-current transition-colors"
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyNotificationWidget;
