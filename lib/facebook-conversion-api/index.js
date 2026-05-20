export * from './actions';
export * from './utils';
export { FB_CONFIG, TRACKING_CONFIG } from './config';

// Re-export commonly used functions
export {
  trackAddToCart,
  trackPurchase,
  trackViewContent,
  trackInitiateCheckout,
  trackLead,
  trackCompleteRegistration,
  trackSearch,
} from './actions';