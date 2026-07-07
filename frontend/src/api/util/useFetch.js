import { useEffect, useState } from 'react';

import { buildApiUrl } from '../config';
import { apiFetch } from './apiFetch';

const useFetch = (
  rootUrl,
  urlBuilder = (url, params) => url,
  params = {},
  { lazy = false } = {},
) => {
  const [data, setData] = useState(null);
  const [count, setcount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reset = () => {
    setData(null);
    setcount(null);
    setLoading(true);
    setError(null);
  };

  const fetchData = async (params = {}) => {
    reset();
    const url = urlBuilder(buildApiUrl(rootUrl), params);

    try {
      const result = await apiFetch(url, { errorPrefix: 'HTTP error on fetch' });
      if (result.data !== undefined) {
        setData(result.data);
        if (result.count !== undefined) {
          setcount(result.count);
        }
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lazy) {
      fetchData(params);
    }
  }, []);

  return { data, count, loading, error, fetchData };
};

export default useFetch;