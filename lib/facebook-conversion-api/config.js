// lib/facebook-conversion-api/config.js

export const FB_CONFIG = {
    API_VERSION: 'v18.0',
    ENDPOINTS: {
      EVENTS: (pixelId) => `https://graph.facebook.com/v18.0/${pixelId}/events`,
    },
    EVENT_NAMES: {
      ADD_TO_CART: 'AddToCart',
      PURCHASE: 'Purchase',
      VIEW_CONTENT: 'ViewContent',
      INITIATE_CHECKOUT: 'InitiateCheckout',
      LEAD: 'Lead',
      COMPLETE_REGISTRATION: 'CompleteRegistration',
      SEARCH: 'Search',
      ADD_TO_WISHLIST: 'AddToWishlist',
      CONTACT: 'Contact',
      CUSTOMIZE_PRODUCT: 'CustomizeProduct',
      DONATE: 'Donate',
      START_TRIAL: 'StartTrial',
      SUBSCRIBE: 'Subscribe',
    },
    CURRENCY_CODES: [
      'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'LKR'
      // Add more as needed
    ],
    CONTENT_TYPES: {
      PRODUCT: 'product',
      PRODUCT_GROUP: 'product_group',
      SERVICE: 'service',
    },
    DELIVERY_CATEGORIES: {
      HOME_DELIVERY: 'home_delivery',
      IN_STORE: 'in_store',
      CURBSIDE: 'curbside',
    },
    ACTION_SOURCE: 'website',
    DEBUG_MODE: process.env.NODE_ENV !== 'production',
  };
  
  export const TRACKING_CONFIG = {
    // Enable/disable all tracking
    enabled: process.env.NEXT_PUBLIC_ENABLE_TRACKING === 'true',
    
    // Enable/disable specific events
    enabledEvents: {
      ADD_TO_CART: true,
      PURCHASE: true,
      VIEW_CONTENT: true,
      INITIATE_CHECKOUT: true,
      LEAD: false,
      COMPLETE_REGISTRATION: false,
      SEARCH: false,
    },
    
    // Retry configuration
    retry: {
      maxAttempts: 3,
      initialDelay: 1000, // ms
      maxDelay: 5000, // ms
    },
    
    // Batch configuration
    batch: {
      enabled: false,
      maxSize: 50,
      flushInterval: 5000, // ms
    },
    
    // Debug configuration
    debug: {
      enabled: process.env.NODE_ENV !== 'production',
      logEvents: true,
      logErrors: true,
    },
  };
  
  export const ERROR_MESSAGES = {
    INVALID_PIXEL_ID: 'Invalid Facebook Pixel ID',
    INVALID_ACCESS_TOKEN: 'Invalid Facebook Access Token',
    INVALID_EVENT_NAME: 'Invalid event name',
    INVALID_CURRENCY: 'Invalid currency code',
    INVALID_VALUE: 'Invalid value format',
    MISSING_REQUIRED_PARAM: 'Missing required parameter',
    API_ERROR: 'Facebook API error',
    NETWORK_ERROR: 'Network error occurred',
    RETRY_FAILED: 'Failed after maximum retry attempts',
  };