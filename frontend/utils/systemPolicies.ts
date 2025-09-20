// ################## ----- SYSTEM POLICIES UTILITIES ----- ##################
// Utilities for managing system policies and user compliance
// Handles subdomain inactivity tracking and notifications
// #################################################################

export interface InactivityPolicy {
  inactivityThreshold: number; // days
  noSalesThreshold: number; // days
  warningPeriod: number; // days before release
  gracePeriod: number; // days after warning
}

export interface UserActivityData {
  userId: string;
  lastLogin: Date;
  lastSale: Date | null;
  subdomain: string;
  isActive: boolean;
  warningsSent: number;
  lastWarningDate: Date | null;
}

export interface PolicyViolation {
  userId: string;
  subdomain: string;
  violationType: 'INACTIVITY_WARNING' | 'DOMAIN_RELEASE_PENDING' | 'DOMAIN_RELEASED';
  daysInactive: number;
  daysSinceLastSale: number;
  releaseDate?: Date;
  canAppeal: boolean;
}

// ################## ----- DEFAULT POLICY CONFIGURATION ----- ##################
export const DEFAULT_INACTIVITY_POLICY: InactivityPolicy = {
  inactivityThreshold: 30, // 30 days without login
  noSalesThreshold: 30, // 30 days without sales
  warningPeriod: 7, // 7 days warning before release
  gracePeriod: 14, // 14 days grace period after warning
};

// ################## ----- POLICY CHECKER CLASS ----- ##################
// Main class for checking and enforcing inactivity policies
export class SubdomainPolicyManager {
  private policy: InactivityPolicy;

  constructor(customPolicy?: Partial<InactivityPolicy>) {
    this.policy = { ...DEFAULT_INACTIVITY_POLICY, ...customPolicy };
  }

  // ################## ----- ACTIVITY VALIDATION ----- ##################
  /**
   * Check if user meets inactivity criteria
   */
  checkInactivityStatus(activityData: UserActivityData): PolicyViolation | null {
    const now = new Date();
    const daysSinceLogin = this.daysBetween(activityData.lastLogin, now);
    const daysSinceLastSale = activityData.lastSale 
      ? this.daysBetween(activityData.lastSale, now)
      : Infinity;

    // Check if user meets both inactivity criteria
    const isLoginInactive = daysSinceLogin >= this.policy.inactivityThreshold;
    const isSalesInactive = daysSinceLastSale >= this.policy.noSalesThreshold;

    if (!isLoginInactive || !isSalesInactive) {
      return null; // User is active
    }

    // Determine violation type based on warnings sent
    const daysSinceWarning = activityData.lastWarningDate 
      ? this.daysBetween(activityData.lastWarningDate, now)
      : Infinity;

    let violationType: PolicyViolation['violationType'];
    let releaseDate: Date | undefined;

    if (activityData.warningsSent === 0) {
      violationType = 'INACTIVITY_WARNING';
    } else if (daysSinceWarning >= this.policy.gracePeriod) {
      violationType = 'DOMAIN_RELEASED';
    } else {
      violationType = 'DOMAIN_RELEASE_PENDING';
      releaseDate = new Date(activityData.lastWarningDate!.getTime() + (this.policy.gracePeriod * 24 * 60 * 60 * 1000));
    }

    return {
      userId: activityData.userId,
      subdomain: activityData.subdomain,
      violationType,
      daysInactive: daysSinceLogin,
      daysSinceLastSale: daysSinceLastSale,
      releaseDate,
      canAppeal: violationType !== 'DOMAIN_RELEASED'
    };
  }

  /**
   * Get days remaining before domain release
   */
  getDaysUntilRelease(activityData: UserActivityData): number | null {
    const violation = this.checkInactivityStatus(activityData);
    
    if (!violation || violation.violationType === 'DOMAIN_RELEASED') {
      return null;
    }

    if (violation.violationType === 'INACTIVITY_WARNING') {
      return this.policy.gracePeriod;
    }

    if (violation.releaseDate) {
      const now = new Date();
      const daysRemaining = this.daysBetween(now, violation.releaseDate);
      return Math.max(0, daysRemaining);
    }

    return null;
  }

  /**
   * Check if user can reactivate their account
   */
  canReactivateAccount(activityData: UserActivityData): boolean {
    const violation = this.checkInactivityStatus(activityData);
    return violation?.canAppeal ?? true;
  }

  // ################## ----- UTILITY METHODS ----- ##################
  private daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor(Math.abs(date2.getTime() - date1.getTime()) / msPerDay);
  }
}

// ################## ----- EMAIL NOTIFICATION TEMPLATES ----- ##################
export const EMAIL_TEMPLATES = {
  INACTIVITY_WARNING: {
    subject: 'Action Required: Your CreatorLaunch Subdomain',
    template: `
Hi {{userName}},

We noticed that your CreatorLaunch account ({{subdomain}}.youthcreatorlaunch.org) has been inactive for {{daysInactive}} days.

Our system shows:
• Last login: {{lastLogin}}
• Last sale: {{lastSale}}

To keep your subdomain active, please:
1. Log into your account at https://{{subdomain}}.youthcreatorlaunch.org
2. Make a sale or update your store

If no activity is detected within {{gracePeriod}} days, your subdomain will be released and made available to other users.

Need help reactivating your store? Contact our support team.

Best regards,
The CreatorLaunch Team
    `
  },
  
  DOMAIN_RELEASE_FINAL: {
    subject: 'Final Notice: Subdomain Release in {{daysRemaining}} Days',
    template: `
Hi {{userName}},

This is a final notice that your subdomain {{subdomain}}.youthcreatorlaunch.org will be released in {{daysRemaining}} days due to inactivity.

You can still save your subdomain by:
1. Logging into your account
2. Making a sale or updating your store

After release, you'll need to choose a new subdomain if you want to return.

Log in now: https://app.youthcreatorlaunch.org/login

Best regards,
The CreatorLaunch Team
    `
  },

  DOMAIN_RELEASED: {
    subject: 'Your CreatorLaunch Subdomain Has Been Released',
    template: `
Hi {{userName}},

Your subdomain {{subdomain}}.youthcreatorlaunch.org has been released due to 30+ days of inactivity with no sales.

Your account and data are still safe, but you'll need to choose a new subdomain when you return.

To reactivate your account:
1. Log in at https://app.youthcreatorlaunch.org/login
2. Choose a new available subdomain
3. Your products and store data will be restored

We'd love to have you back when you're ready!

Best regards,
The CreatorLaunch Team
    `
  }
};

// ################## ----- API HELPERS ----- ##################
/**
 * Format policy violation for display
 */
export function formatPolicyViolation(violation: PolicyViolation): string {
  switch (violation.violationType) {
    case 'INACTIVITY_WARNING':
      return `Your subdomain may be released due to ${violation.daysInactive} days of inactivity.`;
    case 'DOMAIN_RELEASE_PENDING':
      const daysLeft = violation.releaseDate 
        ? Math.ceil((violation.releaseDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
        : 0;
      return `Your subdomain will be released in ${daysLeft} days due to inactivity.`;
    case 'DOMAIN_RELEASED':
      return `Your subdomain has been released due to prolonged inactivity.`;
    default:
      return 'Unknown policy violation.';
  }
}

/**
 * Get recommended actions for policy violation
 */
export function getRecommendedActions(violation: PolicyViolation): string[] {
  switch (violation.violationType) {
    case 'INACTIVITY_WARNING':
      return [
        'Log into your account regularly',
        'Add new products to your store',
        'Share your store with friends and family',
        'Make your first sale'
      ];
    case 'DOMAIN_RELEASE_PENDING':
      return [
        'Log in immediately to prevent release',
        'Make a sale to show activity',
        'Update your store with new content',
        'Contact support if you need help'
      ];
    case 'DOMAIN_RELEASED':
      return [
        'Choose a new available subdomain',
        'Restore your products and store data',
        'Stay active to prevent future releases'
      ];
    default:
      return [];
  }
}

export default SubdomainPolicyManager;
