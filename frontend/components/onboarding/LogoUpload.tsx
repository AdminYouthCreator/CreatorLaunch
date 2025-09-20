import React, { useState, useRef } from 'react';

// ################## ----- LOGO UPLOAD PROPS INTERFACE ----- ##################
// Props interface for the logo upload component
// Handles completion callback and navigation
// ####################################################################
interface LogoUploadProps {
  onComplete: (logoFile?: File, designLater?: boolean) => void;
  onBack: () => void;
}

// ################## ----- LOGO UPLOAD COMPONENT ----- ##################
// Component for uploading brand logos during onboarding
// Supports drag & drop, file validation, and preview functionality
// ################################################################
export const LogoUpload: React.FC<LogoUploadProps> = ({
  onComplete,
  onBack
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ################## ----- FILE VALIDATION AND SELECTION ----- ##################
  // Validates uploaded files and creates preview URLs
  // Checks file type, size, and format requirements
  // ################################################################
  const handleFileSelect = (file: File) => {
    // Validate file type - only accept common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size - maximum 5MB to ensure reasonable upload times
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview URL for immediate feedback
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(selectedFile || undefined, false);
  };

  const handleSkip = () => {
    onComplete(undefined, true);
  };

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
            <span className="text-sm text-medium">Step 3 of 3</span>
          </div>
          
          <h2 className="text-2xl font-bold text-dark mb-2">
            Upload Your Logo
          </h2>
          
          <p className="text-medium">
            Add your logo to make your brand stand out. You can always change this later.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div>
            <label className="block text-left font-bold mb-3 text-dark">
              Logo Image
            </label>
            
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <div>
                    <p className="text-medium font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG, GIF or WebP up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  {previewUrl && (
                    <img 
                      src={previewUrl} 
                      alt="Logo preview" 
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                  
                  <div className="flex-1">
                    <p className="font-medium text-dark">{selectedFile.name}</p>
                    <p className="text-sm text-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Future feature notice */}
          <div className="bg-light p-4 rounded-lg border-l-4 border-accent">
            <div className="flex items-start space-x-3">
              <div className="bg-accent text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-dark">
                  Coming Soon: Logo Designer
                </p>
                <p className="text-xs text-medium mt-1">
                  We're working on an integrated logo creation tool. For now, you can upload an existing logo or skip this step.
                </p>
              </div>
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
              type="button"
              onClick={handleSkip}
              className="flex-1 bg-gray-200 text-dark py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Skip for Now
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
            >
              {selectedFile ? 'Upload & Finish' : 'Finish Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
