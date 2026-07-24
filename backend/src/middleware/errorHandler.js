// Converts unhandled Express errors into a consistent JSON response.
export const errorHandler = (error, request, response, next) => {
  void request;
  void next;

  const statusCode =
    error.statusCode ??
    (error.name === 'CastError' || error.name === 'ValidationError' ? 400 : undefined) ??
    (error.code === 11000 ? 409 : 500);
  const message =
    error.code === 11000
      ? 'A record with that value already exists.'
      : error.message ?? 'Internal server error.';

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    success: false,
    message,
  });
};
