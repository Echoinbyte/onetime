export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
  MESSAGE_EXPIRED: 'MESSAGE_EXPIRED',
  INVALID_VIEW_LIMIT: 'INVALID_VIEW_LIMIT',
  INVALID_INPUT: 'INVALID_INPUT',
  DATABASE_ERROR: 'DATABASE_ERROR',
  ENCRYPTION_ERROR: 'ENCRYPTION_ERROR'
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];