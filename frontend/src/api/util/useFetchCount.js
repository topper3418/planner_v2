import { useEffect } from "react";
import useFetchState from "../../util/useFetchState";
import { withApiBase } from "../config";

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
    // reset state
    reset();
    // build url (withApiBase handles /api -> deployed api prefix)
    const resolvedRoot = withApiBase(rootUrl);
    const url = urlBuilder(new URL(resolvedRoot, window.location.origin), params);
    // fetch data, manage state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error on fetch! status: ${response.status}`);
      }
      const result = await response.json();
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
