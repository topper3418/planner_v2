import { useEffect } from 'react';

import useFetchState from '../../util/useFetchState';
import { buildApiUrl } from '../config';
import { apiFetch } from './apiFetch';

const useFetchCount = (
  rootUrl,
  urlBuilder = (url, params) => url,
  params = {},
  { lazy = false } = {},
) => {
  const {
    data: count,
    setData: setCount,
    loading,
    setLoading,
    error,
    setError,
    reset,
  } = useFetchState(null);

  const fetchCount = async (params = {}) => {
    reset();
    const url = urlBuilder(buildApiUrl(rootUrl), params);

    try {
      const result = await apiFetch(url, { errorPrefix: 'HTTP error on fetch' });
      setCount(result.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lazy) {
      fetchCount(params);
    }
  }, []);

  return { count, loading, error, fetchCount };
};

export default useFetchCount;