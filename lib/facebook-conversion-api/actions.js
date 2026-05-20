// lib/facebook-conversion-api/actions.js
'use server';

import { hashUserData, createEventData, formatCurrencyValue, isProduction, formatCategory } from './utils';

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const API_VERSION = 'v18.0';



async function sendEvent(eventData) {
  // Don't send events in development unless explicitly configured
  if (!isProduction() && !process.env.ENABLE_FB_TRACKING_IN_DEV) {
    console.log('Facebook event (dev mode):', eventData);
    return { success: true, data: { debug: true } };
  }

  const baseUrl = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
  
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: FACEBOOK_ACCESS_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to send event to Facebook');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Facebook Conversion API Error:', error);
    return { success: false, error: error.message };
  }
}

export async function trackConversion(eventName, userData, customData) {
  const eventData = createEventData(eventName, userData, customData);
  
  return await sendEvent(eventData);
}

export async function trackPurchase({ orderId, value, currency, user, products }) {
  const userData = hashUserData(user);

  const customData = {
    value: formatCurrencyValue(value),
    currency,
    content_ids: products.map(p => p.productId),
    content_type: 'product',
    order_id: orderId,
    contents: products.map(product => ({
      id: product.productId,
      quantity: product.quantity,
      price: formatCurrencyValue(product.salesPrice || product.price)
    }))
  }; 

  return await trackConversion('Purchase', userData, customData);
}

export async function trackAddToCart({ productId, value, currency, user, quantity = 1 }) {
  const userData = hashUserData(user);

  const customData = {
    value: formatCurrencyValue(value),
    currency,
    content_ids: [productId],
    content_type: 'product',
    contents: [{
      id: productId,
      quantity,
      price: formatCurrencyValue(value)
    }]
  };

  return await trackConversion('AddToCart', userData, customData);
}

export async function trackViewContent({ productId, value, currency, user, category }) {
  const userData = hashUserData(user);

  const customData = {
    content_ids: [productId],
    content_type: 'product',
    value: formatCurrencyValue(value),
    currency,
    ...formatCategory(category)
  };

  return await trackConversion('ViewContent', userData, customData);
}

export async function trackInitiateCheckout({ value, currency, user, items }) {
  const userData = hashUserData(user);

  const customData = {
    value: formatCurrencyValue(value),
    currency,
    content_ids: items.map(item => item.productId),
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    contents: items.map(item => ({
      id: item.productId,
      quantity: item.quantity || 1,
      price: formatCurrencyValue(item.salesPrice || item.price )
    }))
  };

  return await trackConversion('InitiateCheckout', userData, customData);
}

export async function trackLead({ user, formData }) {
  const userData = hashUserData(user);

  const customData = {
    content_name: formData.source,
    content_category: formData.category,
    currency: formData.currency,
    value: formData.value ? formatCurrencyValue(formData.value) : undefined
  };

  return await trackConversion('Lead', userData, customData);
}

export async function trackCompleteRegistration({ user, registrationType, value, currency }) {
  const userData = hashUserData(user);

  const customData = {
    content_name: registrationType,
    status: 'completed',
    value: value ? formatCurrencyValue(value) : undefined,
    currency
  };

  return await trackConversion('CompleteRegistration', userData, customData);
}

export async function trackSearch({ searchString, user }) {
  const userData = hashUserData(user);

  const customData = {
    search_string: searchString,
  };

  return await trackConversion('Search', userData, customData);
}