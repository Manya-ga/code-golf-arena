// Applies small route-local validators without coupling the API to a validation library.
export const validateRequest = (schema) => (request, response, next) => {
  try {
    const validate = typeof schema === 'function' ? schema : schema?.body;
    if (typeof validate !== 'function') {
      throw new Error('A request validator function is required.');
    }

    validate(request.body);
    return next();
  } catch (error) {
    return response.status(400).json({ success: false, message: error.message ?? 'Invalid request.' });
  }
};
