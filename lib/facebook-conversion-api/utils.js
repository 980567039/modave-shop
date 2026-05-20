// lib/facebook-conversion-api/utils.js

import crypto from 'crypto';

/**
 * Generates a hash of the provided data using SHA-256
 * @param {string} data - Data to be hashed
 * @returns {string|null} Hashed string or null if no data provided
 */
export function hash(data) {
  if (!data) return null;
  
  // Normalize the data according to Facebook's requirements
  const normalizedData = data.toString()
    .trim()
    .toLowerCase();
  
  // Create SHA-256 hash
  return crypto
    .createHash('sha256')
    .update(normalizedData)
    .digest('hex');
}

export function formatCategory(category) {
  if (!category) return {};

  // If category is a string, use it as content_category
  if (typeof category === 'string') {
    return {
      content_category: category
    };
  }

  // If category is an array, join with '>' for hierarchy
  if (Array.isArray(category)) {
    return {
      content_category: category.join(' > ')
    };
  }

  // If category is an object with specific Facebook fields
  if (typeof category === 'object') {
    const {
      category_1,
      category_2,
      category_3,
      category_4,
      category_5
    } = category;

    const formattedCategory = {};

    // Add each category level if it exists
    if (category_1) formattedCategory.content_category = category_1;
    if (category_2) formattedCategory.content_category_2 = category_2;
    if (category_3) formattedCategory.content_category_3 = category_3;
    if (category_4) formattedCategory.content_category_4 = category_4;
    if (category_5) formattedCategory.content_category_5 = category_5;

    return formattedCategory;
  }

  return {};
}


/**
 * Generates or retrieves an anonymous user ID
 * @returns {string} Anonymous user ID
 */
export function generateAnonymousId() {
  if (typeof window !== 'undefined') {
    try {
      let anonymousId = sessionStorage.getItem('anonymous_user_id');
      if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        sessionStorage.setItem('anonymous_user_id', anonymousId);
      }
      return anonymousId;
    } catch (error) {
      console.warn('Failed to access sessionStorage:', error);
      return crypto.randomUUID();
    }
  }
  return crypto.randomUUID();
}

/**
 * Collects client browser data for tracking
 * @returns {Object} Browser data including user agent and Facebook pixels
 */
export function getClientBrowserData() {
  if (typeof window === 'undefined') {
    return {
      client_user_agent: '',
      fbp: null,
      fbc: null
    };
  }

  try {
    return {
      client_user_agent: window.navigator.userAgent,
      fbp: document.cookie.match(/_fbp=([^;]+)/)?.[1] || null,
      fbc: document.cookie.match(/_fbc=([^;]+)/)?.[1] || null
    };
  } catch (error) {
    console.warn('Failed to collect browser data:', error);
    return {
      client_user_agent: '',
      fbp: null,
      fbc: null
    };
  }
}

/**
 * Hashes user data according to Facebook's requirements
 * @param {Object} userData - User data to be hashed
 * @returns {Object} Hashed user data
 */
export function hashUserData(userData = {}) {
  const hashedData = {
    ...getClientBrowserData()
  };
  
  // Hash standard user data if available
  if (userData.email) hashedData.em = [hash(userData.email)];
  if (userData.phone) hashedData.ph = [hash(userData.phone)];
  if (userData.firstName) hashedData.fn = [hash(userData.firstName)];
  if (userData.lastName) hashedData.ln = [hash(userData.lastName)];
  if (userData.city) hashedData.ct = [hash(userData.city)];
  if (userData.state) hashedData.st = [hash(userData.state)];
  if (userData.zipCode) hashedData.zp = [hash(userData.zipCode)];
  if (userData.country) hashedData.country = [hash(userData.country)];
  
  // Add external_id for anonymous users
  if (!userData.email && !userData.phone) {
    hashedData.external_id = [hash(generateAnonymousId())];
  }
  
  return hashedData;
}

/**
 * Creates Facebook event data structure
 * @param {string} eventName - Name of the event
 * @param {Object} userData - User data
 * @param {Object} customData - Custom event data
 * @returns {Object} Formatted event data
 */
export function createEventData(eventName, userData, customData) {
  return {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    event_id: crypto.randomUUID(), // Unique identifier for deduplication
    action_source: 'website',
    user_data: {
      ...hashUserData(userData)
    },
    custom_data: customData || {},
  };
}

/**
 * Validates an email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Formats currency value according to Facebook's requirements
 * @param {number|string} value - Value to format
 * @returns {number} Formatted value
 */
export function formatCurrencyValue(value) {
  if (typeof value === 'string') {
    // Remove currency symbols and convert to number
    value = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  }
  return Number(value.toFixed(2));
}

/**
 * Gets Facebook pixel ID from environment variables
 * @returns {string|null} Facebook pixel ID
 */
export function getPixelId() {
  return process.env.NEXT_PUBLIC_FB_PIXEL_ID || null;
}

/**
 * Checks if the current environment is production
 * @returns {boolean} Whether the current environment is production
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Formats event parameters according to Facebook's requirements
 * @param {Object} params - Event parameters to format
 * @returns {Object} Formatted parameters
 */
export function formatEventParams(params = {}) {
  const formatted = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value != null) {  // Skip null or undefined values
      if (typeof value === 'number') {
        formatted[key] = value.toString();
      } else if (Array.isArray(value)) {
        formatted[key] = value.map(item => item.toString());
      } else {
        formatted[key] = value.toString();
      }
    }
  }
  
  return formatted;
}