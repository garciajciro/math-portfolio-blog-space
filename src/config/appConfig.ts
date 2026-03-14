
// Configuration options for the application
// This file contains settings that can be toggled for testing/development

export const appConfig = {
  // Set to true to bypass authentication for admin routes
  // This is useful for development and testing
  bypassAdminAuth: false,  // We're keeping the name for backward compatibility

  // Set to true to enable debug logging
  enableDebugMode: false,
  
  // Storage configuration
  storage: {
    // If true, shows more user-friendly error messages when bucket operations fail
    showFriendlyBucketErrors: true
  }
};
