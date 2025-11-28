import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';
import ActivityLogger from '../utils/activityLogger';

// Middleware ghi log HTTP requests
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  Logger.http(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms - IP: ${req.ip}`;
    
    if (res.statusCode >= 400) {
      Logger.error(message);
    } else {
      Logger.http(message);
    }
  });

  next();
};

// Middleware ghi log errors
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Error: ${err.message} - URL: ${req.originalUrl} - Method: ${req.method} - IP: ${req.ip}`);
  
  if (err.stack) {
    Logger.error(`Stack: ${err.stack}`);
  }

  next(err);
};

// Middleware ghi log activities quan trọng
export const activityLogger = (action: string, category: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    try {
      (req as any).activityLog = {
        userId,
        action,
        category,
        ipAddress,
        userAgent,
      };

      next();
    } catch (error) {
      Logger.error(`Activity logging error: ${error}`);
      next();
    }
  };
};

// Middleware hoàn thành ghi log activity sau response
export const completeActivityLog = async (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function (data: any) {
    const activityLog = (req as any).activityLog;

    if (activityLog) {
      setImmediate(async () => {
        try {
          const status = res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILED';
          
          switch (activityLog.category) {
            case 'ORDER':
              await ActivityLogger.logOrder({
                ...activityLog,
                orderId: data?.data?._id || data?._id || 'UNKNOWN',
                orderData: data?.data || data,
                status,
              });
              break;

            case 'PAYMENT':
              await ActivityLogger.logPayment({
                ...activityLog,
                orderId: data?.orderId || data?.data?.orderId,
                amount: data?.amount || data?.total,
                paymentMethod: data?.paymentMethod,
                transactionId: data?.transactionId,
                status,
              });
              break;

            case 'CART':
              await ActivityLogger.logCart({
                ...activityLog,
                productId: data?.productId,
                quantity: data?.quantity,
              });
              break;

            case 'USER':
              await ActivityLogger.logUser({
                ...activityLog,
                details: data?.data || data,
                status,
              });
              break;

            case 'AUTH':
              await ActivityLogger.logAuth({
                ...activityLog,
                email: data?.email,
                username: data?.username,
                status,
              });
              break;

            case 'PRODUCT':
              await ActivityLogger.logProduct({
                ...activityLog,
                productId: data?.data?._id || data?._id,
                productData: data?.data || data,
                status,
              });
              break;

            case 'BLOG':
              await ActivityLogger.logBlog({
                ...activityLog,
                blogId: data?.data?._id || data?._id,
                blogData: data?.data || data,
                status,
              });
              break;

            case 'CATEGORY':
              await ActivityLogger.logCategory({
                ...activityLog,
                categoryId: data?.data?._id || data?._id,
                categoryData: data?.data || data,
                status,
              });
              break;
          }
        } catch (error) {
          Logger.error(`Error completing activity log: ${error}`);
        }
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

export default {
  httpLogger,
  errorLogger,
  activityLogger,
  completeActivityLog,
};