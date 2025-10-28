import { useEffect } from "react";
import useFetchState from "../../util/useFetchState";

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
    // build url
    const url = urlBuilder(new URL(rootUrl, window.location.origin), params);
    console.log("Fetching URL:", url.toString());
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
