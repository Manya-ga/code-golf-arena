// Creates a consistent success response shape for all REST controllers.
export const sendSuccess = (response, { statusCode = 200, data, message } = {}) =>
  response.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...(data === undefined ? {} : { data }),
  });
