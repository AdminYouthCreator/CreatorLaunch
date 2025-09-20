class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark this as a predictable, operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;