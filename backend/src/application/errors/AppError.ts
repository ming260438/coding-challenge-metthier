/**
 * AppError — application-level error with an associated HTTP status code.
 *
 * Use cases throw this error to signal expected failure conditions
 * (e.g. "not found", "validation failed"). The global error handler
 * converts it to the appropriate HTTP response.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
    // Restore prototype chain so `instanceof AppError` works after transpilation.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
