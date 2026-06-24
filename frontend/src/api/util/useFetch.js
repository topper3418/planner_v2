import { useEffect, useState } from "react";
import useFetchState from "../../util/useFetchState";
import { withApiBase } from "../config";

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
    // reset state
    reset();
    // build url (withApiBase makes /api/... become the full deployed prefix e.g. /apps/name/api/...)
    const resolvedRoot = withApiBase(rootUrl);
    const url = urlBuilder(new URL(resolvedRoot, window.location.origin), params);
    // fetch data, manage state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error on fetch! status: ${response.status}`);
      }
      const result = await response.json();
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
