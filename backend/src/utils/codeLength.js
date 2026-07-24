// Calculates the UTF-8 byte length used as the canonical Golf Mode score.
export const calculateCodeLength = (sourceCode) => {
  if (typeof sourceCode !== 'string') {
    const error = new Error('Source code must be a string.');
    error.statusCode = 400;
    throw error;
  }

  return Buffer.byteLength(sourceCode, 'utf8');
};
