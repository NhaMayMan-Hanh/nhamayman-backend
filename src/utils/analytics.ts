import admin from 'firebase-admin';
import { Request } from 'express';

interface TrackingEvent {
  eventName: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

interface UserProperties {
  userId: string;
  properties: Record<string, any>;
}

class AnalyticsTracker {
  private isInitialized: boolean = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      if (!admin.apps.length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: privateKey,
            }),
          });
          this.isInitialized = true;
          console.log('✅ Firebase Analytics initialized');
        } else {
          console.log('⚠️ Firebase credentials not found, analytics disabled');
        }
      }
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      this.isInitialized = false;
    }
  }

  trackEvent(event: TrackingEvent) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', {
          event: event.eventName,
          userId: event.userId,
          properties: event.properties,
          timestamp: event.timestamp || new Date(),
        });
      }
      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }

  setUserProperties(data: UserProperties) {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('👤 User Properties:', data);
      }
      return true;
    } catch (error) {
      console.error('Error setting user properties:', error);
      return false;
    }
  }

  // Track user registration
  trackSignUp(data: {
    userId: string;
    method: string;
    email?: string;
    username?: string;
  }) {
    return this.trackEvent({
      eventName: 'sign_up',
      userId: data.userId,
      properties: {
        method: data.method,
        email: data.email,
        username: data.username,
      },
    });
  }

  // Track user login
  trackLogin(data: {
    userId: string;
    method: string;
  }) {
    return this.trackEvent({
      eventName: 'login',
      userId: data.userId,
      properties: {
        method: data.method,
      },
    });
  }

  // Track product view
  trackProductView(data: {
    userId?: string;
    productId: string;
    productName: string;
    category?: string;
    price?: number;
  }) {
    return this.trackEvent({
      eventName: 'view_item',
      userId: data.userId,
      properties: {
        items: [{
          item_id: data.productId,
          item_name: data.productName,
          item_category: data.category,
          price: data.price,
        }],
      },
    });
  }

  // Track add to cart
  trackAddToCart(data: {
    userId?: string;
    productId: string;
    productName: string;
    category?: string;
    price: number;
    quantity: number;
  }) {
    return this.trackEvent({
      eventName: 'add_to_cart',
      userId: data.userId,
      properties: {
        currency: 'VND',
        value: data.price * data.quantity,
        items: [{
          item_id: data.productId,
          item_name: data.productName,
          item_category: data.category,
          price: data.price,
          quantity: data.quantity,
        }],
      },
    });
  }

  // Track remove from cart
  trackRemoveFromCart(data: {
    userId?: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }) {
    return this.trackEvent({
      eventName: 'remove_from_cart',
      userId: data.userId,
      properties: {
        currency: 'VND',
        value: data.price * data.quantity,
        items: [{
          item_id: data.productId,
          item_name: data.productName,
          price: data.price,
          quantity: data.quantity,
        }],
      },
    });
  }

  // Track begin checkout
  trackBeginCheckout(data: {
    userId: string;
    value: number;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
  }) {
    return this.trackEvent({
      eventName: 'begin_checkout',
      userId: data.userId,
      properties: {
        currency: 'VND',
        value: data.value,
        items: data.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  }

  // Track purchase
  trackPurchase(data: {
    userId: string;
    transactionId: string;
    value: number;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    paymentMethod: string;
  }) {
    return this.trackEvent({
      eventName: 'purchase',
      userId: data.userId,
      properties: {
        transaction_id: data.transactionId,
        currency: 'VND',
        value: data.value,
        payment_method: data.paymentMethod,
        items: data.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  }

  // Track search
  trackSearch(data: {
    userId?: string;
    searchTerm: string;
    category?: string;
  }) {
    return this.trackEvent({
      eventName: 'search',
      userId: data.userId,
      properties: {
        search_term: data.searchTerm,
        category: data.category,
      },
    });
  }

  // Track blog view
  trackBlogView(data: {
    userId?: string;
    blogId: string;
    blogTitle: string;
    category?: string;
  }) {
    return this.trackEvent({
      eventName: 'view_blog',
      userId: data.userId,
      properties: {
        blog_id: data.blogId,
        blog_title: data.blogTitle,
        category: data.category,
      },
    });
  }

  // Track custom event
  trackCustomEvent(data: {
    userId?: string;
    eventName: string;
    properties?: Record<string, any>;
  }) {
    return this.trackEvent({
      eventName: data.eventName,
      userId: data.userId,
      properties: data.properties,
    });
  }
}

export default new AnalyticsTracker();