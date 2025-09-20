# User Onboarding System

This directory contains the complete user onboarding flow for CreatorLaunch, implementing the 3-step brand setup process for new users.

## Overview

The onboarding system guides new users through setting up their brand and store after successful registration:

1. **Welcome Screen** - Introduction and overview
2. **Store URL Setup** - Reserve unique subdomain 
3. **Brand Description** - Describe the brand/business
4. **Logo Upload** - Upload logo or skip for later
5. **Onboarding Complete** - Redirect to dashboard with getting started to-do list

## Components

### Core Components

- **`OnboardingFlow.tsx`** - Main orchestrator component that manages step progression
- **`OnboardingWelcome.tsx`** - Welcome screen with overview
- **`StoreUrlSetup.tsx`** - Brand name/URL reservation with real-time availability checking
- **`BrandDescription.tsx`** - Brand description input with character limits and examples
- **`LogoUpload.tsx`** - Logo upload with drag-and-drop, file validation, and preview
- **`OnboardingError.tsx`** - Error handling component

### Pages

- **`/onboarding/index.tsx`** - Main onboarding page
- **`/onboarding/success.tsx`** - Success confirmation page
- **`/onboarding/restart.tsx`** - Restart onboarding process

### Hooks

- **`useOnboarding.ts`** - Custom hook for onboarding API calls and state management

## Features

### Real-time Brand Name Validation
- Checks availability as user types (debounced)
- Format validation (alphanumeric + hyphens only)
- Length requirements (3-20 characters)
- Reserved name protection

### Brand Description
- Character limits (20-500 characters)
- Real-time character counting
- Example descriptions for inspiration
- Validation feedback

### Logo Upload
- Drag and drop support
- File type validation (JPG, PNG, GIF, WebP)
- File size limits (5MB max)
- Image preview
- Skip option for later

### Progress Management
- Step-by-step navigation with back buttons
- Progress persistence (localStorage fallback)
- Error handling and recovery
- Auto-redirect on completion

## User Flow

1. **Registration** → Redirect to `/onboarding`
2. **Authentication Check** → Redirect to login if not authenticated
3. **Onboarding Status** → Skip if already completed
4. **Welcome Screen** → Introduction and overview
5. **Store URL Setup** → Brand name selection with validation
6. **Brand Description** → Business description entry
7. **Logo Upload** → Logo upload or skip
8. **Success Page** → Confirmation and next steps
9. **Dashboard** → Main user interface with getting started to-do list

### Dashboard To-Do List
Upon completing onboarding, users see a prominent "Getting Started" widget with initial tasks:
- [✓] Sign up for an account
- [✓] Create your brand  
- [ ] Create your first product
- [ ] Share your store and make your first sale!

## Integration Points

### Authentication
- Integrates with `useAuth` hook
- Checks user authentication status
- Redirects unauthenticated users to login

### User Data
- Updates user profile with onboarding completion status
- Stores brand information and preferences
- Generates unique store URLs

### File Upload
- Handles logo image uploads
- Processes and stores image files
- Generates optimized versions

## API Integration

The system is designed to work with these API endpoints (to be implemented):

```typescript
// Brand name availability check
POST /api/onboarding/check-brand-name
Body: { brandName: string }
Response: { available: boolean }

// Complete onboarding
POST /api/onboarding/complete
Body: FormData with logo file + JSON data
Response: { success: boolean, storeUrl: string }

// Save progress
POST /api/onboarding/save-progress
Body: { step: string, ...data }
Response: { success: boolean }

// Get progress
GET /api/onboarding/get-progress
Response: { step: string, data: object }
```

## Styling

- Uses Tailwind CSS for consistent styling
- Matches existing CreatorLaunch design system
- Responsive design for mobile and desktop
- Loading states and animations
- Accessible form controls

## Error Handling

- Network error recovery
- Validation error display
- File upload error handling
- Graceful degradation
- User-friendly error messages

## Future Enhancements

- Integrated logo design tool
- Additional brand customization options
- Social media integration
- Advanced store themes
- Tutorial videos and help system

## Usage

```tsx
import { OnboardingFlow } from '@/components/onboarding';

const MyPage = () => {
  const handleComplete = (data: OnboardingData) => {
    // Handle completion
  };

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      userName="John Doe"
    />
  );
};
```

## Dependencies

- React 18+
- Next.js 13+
- TypeScript
- Tailwind CSS
- Custom hooks (useAuth, useOnboarding)
