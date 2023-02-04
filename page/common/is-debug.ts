const getQuery = (key: string): string => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[key] || '';
};

export const isDebug = getQuery('debug') === '1';
