import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../application/errors/AppError';

/**
 * Global error-handling middleware.
 *
 * Must be registered LAST (after all routes) in Express so it receives
 * errors forwarded via next(err).
 *
 * - AppError instances → structured JSON response with the correct status code.
 * - Unknown errors     → 500 Internal Server Error (details hidden from client).
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Log unexpected errors server-side for debugging
  console.error('[Unhandled Error]', error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
