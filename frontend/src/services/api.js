const apiBase = import.meta.env.VITE_API_BASE_URL ?? '/api';

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem('code-golf-session'));
  } catch {
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const session = readSession();
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(session?.token ? { authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) throw new Error(payload.message ?? 'Unable to complete this request.');
  return payload.data;
};
