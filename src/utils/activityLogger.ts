import mongoose, { Schema, Document } from 'mongoose';

// Interface cho Activity Log
export interface IActivityLog extends Document {
  userId?: string;
  action: string;
  category: 'ORDER' | 'PAYMENT' | 'USER' | 'PRODUCT' | 'CART' | 'AUTH' | 'BLOG' | 'CATEGORY';
  details: any;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  metadata?: any;
  createdAt: Date;
}

// Schema cho Activity Log
const activityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: String,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['ORDER', 'PAYMENT', 'USER', 'PRODUCT', 'CART', 'AUTH', 'BLOG', 'CATEGORY'],
    index: true,
  },
  details: {
    type: Schema.Types.Mixed,
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
    default: 'SUCCESS',
  },
  metadata: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Indexes
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ category: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, status: 1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

// Activity Logger Service
class ActivityLogger {
  // Log order activities
  async logOrder(data: {
    userId: string;
    action: 'CREATE_ORDER' | 'UPDATE_ORDER' | 'CANCEL_ORDER' | 'COMPLETE_ORDER' | 'CONFIRM_ORDER' | 'SHIP_ORDER' | 'DELIVER_ORDER';
    orderId: string;
    orderData: any;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'ORDER',
        details: {
          orderId: data.orderId,
          orderData: data.orderData,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging order activity:', error);
    }
  }

  // Log payment activities
  async logPayment(data: {
    userId: string;
    action: 'PAYMENT_INITIATED' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'REFUND';
    orderId: string;
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'PAYMENT',
        details: {
          orderId: data.orderId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
      });
    } catch (error) {
      console.error('Error logging payment activity:', error);
    }
  }

  // Log cart activities
  async logCart(data: {
    userId: string;
    action: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_CART' | 'CLEAR_CART';
    productId?: string;
    quantity?: number;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'CART',
        details: {
          productId: data.productId,
          quantity: data.quantity,
        },
        status: 'SUCCESS',
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging cart activity:', error);
    }
  }

  // Log user activities
  async logUser(data: {
    userId: string;
    action: 'REGISTER' | 'LOGIN' | 'LOGOUT' | 'UPDATE_PROFILE' | 'CHANGE_PASSWORD' | 'DELETE_ACCOUNT' | 'VERIFY_EMAIL' | 'RESET_PASSWORD';
    details?: any;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'USER',
        details: data.details || {},
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
  }

  // Log authentication activities
  async logAuth(data: {
    userId?: string;
    action: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'TOKEN_REFRESH' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
    email?: string;
    username?: string;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'AUTH',
        details: {
          email: data.email,
          username: data.username,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
      });
    } catch (error) {
      console.error('Error logging auth activity:', error);
    }
  }

  // Log product activities
  async logProduct(data: {
    userId?: string;
    action: 'VIEW_PRODUCT' | 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT' | 'SEARCH_PRODUCT';
    productId?: string;
    productData?: any;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'PRODUCT',
        details: {
          productId: data.productId,
          productData: data.productData,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging product activity:', error);
    }
  }

  // Log blog activities
  async logBlog(data: {
    userId?: string;
    action: 'VIEW_BLOG' | 'CREATE_BLOG' | 'UPDATE_BLOG' | 'DELETE_BLOG';
    blogId?: string;
    blogData?: any;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'BLOG',
        details: {
          blogId: data.blogId,
          blogData: data.blogData,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging blog activity:', error);
    }
  }

  // Log category activities
  async logCategory(data: {
    userId?: string;
    action: 'VIEW_CATEGORY' | 'CREATE_CATEGORY' | 'UPDATE_CATEGORY' | 'DELETE_CATEGORY';
    categoryId?: string;
    categoryData?: any;
    status: 'SUCCESS' | 'FAILED';
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      return await ActivityLog.create({
        userId: data.userId,
        action: data.action,
        category: 'CATEGORY',
        details: {
          categoryId: data.categoryId,
          categoryData: data.categoryData,
        },
        status: data.status,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      });
    } catch (error) {
      console.error('Error logging category activity:', error);
    }
  }

  // Get user activity history
  async getUserActivityHistory(userId: string, limit: number = 50) {
    try {
      return await ActivityLog.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting user activity history:', error);
      return [];
    }
  }

  // Get activities by category
  async getActivitiesByCategory(category: string, limit: number = 100) {
    try {
      return await ActivityLog.find({ category })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting activities by category:', error);
      return [];
    }
  }

  // Get failed activities
  async getFailedActivities(startDate?: Date, endDate?: Date) {
    try {
      const query: any = { status: 'FAILED' };
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }

      return await ActivityLog.find(query).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting failed activities:', error);
      return [];
    }
  }
}

export default new ActivityLogger();