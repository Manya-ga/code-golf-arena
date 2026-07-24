// Central logging abstraction with stable levels suitable for replacing with a transport later.
export const logger = {
  info: (message, metadata) => console.info(message, metadata ?? ''),
  warn: (message, metadata) => console.warn(message, metadata ?? ''),
  error: (message, metadata) => console.error(message, metadata ?? ''),
};
