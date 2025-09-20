import React from 'react';

// ################## ----- INTERFACES ----- ##################
interface PrintfulErrorHandlerProps {
  error: string | Error | null;
  onRetry?: () => void;
  context?: string;
  className?: string;
}

interface PrintfulLoadingSkeletonProps {
  type: 'product' | 'category' | 'list' | 'grid';
  count?: number;
  className?: string;
}

// ################## ----- ERROR HANDLER COMPONENT ----- ##################
// Displays Printful-specific errors with retry mechanisms
// ##########################################################
export const PrintfulErrorHandler: React.FC<PrintfulErrorHandlerProps> = ({
  error,
  onRetry,
  context = 'operation',
  className = ''
}) => {
  if (!error) return null;

  const getErrorMessage = (error: string | Error): string => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  };

  const getErrorType = (errorMessage: string): 'network' | 'api' | 'auth' | 'generic' => {
    const message = errorMessage.toLowerCase();
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('401') || message.includes('unauthorized') || message.includes('authentication')) {
      return 'auth';
    }
    if (message.includes('printful') || message.includes('api')) {
      return 'api';
    }
    return 'generic';
  };

  const errorMessage = getErrorMessage(error);
  const errorType = getErrorType(errorMessage);

  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return (
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L4.064 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'auth':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'api':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getErrorTitle = (): string => {
    switch (errorType) {
      case 'network':
        return 'Connection Problem';
      case 'auth':
        return 'Authentication Error';
      case 'api':
        return 'Service Unavailable';
      default:
        return 'Error';
    }
  };

  const getErrorSuggestion = (): string => {
    switch (errorType) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'auth':
        return 'Please check your Printful API credentials or contact support.';
      case 'api':
        return 'The Printful service is temporarily unavailable. Please try again later.';
      default:
        return 'Please try again or contact support if the problem persists.';
    }
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getErrorIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-red-900 mb-1">
            {getErrorTitle()}
          </h3>
          <p className="text-red-800 mb-2">
            Failed to {context}: {errorMessage}
          </p>
          <p className="text-red-700 text-sm mb-4">
            {getErrorSuggestion()}
          </p>
          {onRetry && (
            <div className="flex space-x-3">
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ################## ----- LOADING SKELETON COMPONENT ----- ##################
// Displays loading skeletons for different Printful content types
// ###################################################################
export const PrintfulLoadingSkeleton: React.FC<PrintfulLoadingSkeletonProps> = ({
  type,
  count = 6,
  className = ''
}) => {
  const renderProductSkeleton = () => (
    <div className="bg-white border rounded-lg p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="bg-white border rounded-lg p-4 animate-pulse">
      <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="bg-white border rounded-lg p-4 animate-pulse">
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return renderProductSkeleton();
      case 'category':
        return renderCategorySkeleton();
      case 'list':
        return renderListSkeleton();
      case 'grid':
        return renderProductSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  const getGridClass = () => {
    switch (type) {
      case 'category':
        return 'grid grid-cols-2 md:grid-cols-4 gap-4';
      case 'list':
        return 'space-y-4';
      case 'product':
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <div className={`${getGridClass()} ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

// ################## ----- LOADING OVERLAY COMPONENT ----- ##################
// Full-page loading overlay for major operations
// #########################################################
interface PrintfulLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export const PrintfulLoadingOverlay: React.FC<PrintfulLoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  progress
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-700 mb-2">{message}</p>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  PrintfulErrorHandler,
  PrintfulLoadingSkeleton,
  PrintfulLoadingOverlay
};
