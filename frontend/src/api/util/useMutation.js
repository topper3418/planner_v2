import { useState } from 'react';

import { apiFetch } from './apiFetch';

const useMutation = (
  buildRequest,
  { method = 'POST', json = true, errorPrefix = 'HTTP error' } = {},
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const { path, body } = buildRequest(...args);
      const result = await apiFetch(path, {
        method,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        json,
        errorPrefix,
      });
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, mutate };
};

export default useMutation;