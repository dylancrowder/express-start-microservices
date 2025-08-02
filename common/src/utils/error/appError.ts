/* eslint-disable @typescript-eslint/no-explicit-any */
class AppError extends Error {
  public readonly httpCode: number;
  public readonly isOperational: boolean;
  public readonly responseMessage: string;

  constructor(
    name: string,
    httpCode: number,
    message: any,
    responseMessage: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.responseMessage = responseMessage;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
