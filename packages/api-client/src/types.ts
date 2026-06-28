export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, any>;
}

export class ApiRequestError extends Error {
  constructor(
    public error: ApiError,
    public response: Response
  ) {
    super(error.message);
    this.name = 'ApiRequestError';
  }
}
