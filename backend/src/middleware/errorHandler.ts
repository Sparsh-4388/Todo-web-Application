import { Request, Response, NextFunction } from 'express';
import { ErrorLog } from '../models/ErrorLog';
import { AuthRequest } from './auth';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = async (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error to MongoDB
  try {
    const authReq = req as AuthRequest;
    await ErrorLog.create({
      message: message,
      stack: err.stack,
      statusCode: statusCode,
      method: req.method,
      url: req.originalUrl,
      userId: authReq.userId || undefined,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent')
    });
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode
    });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error: AppError = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};