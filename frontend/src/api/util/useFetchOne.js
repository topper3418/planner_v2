import { useEffect, useState } from "react";
import { withApiBase } from "../config";

const useFetchOne = (url, itemId = undefined, { lazy = false } = {}) => {
  const baseUrl = withApiBase(url);
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const fetchOne = async (itemId) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(baseUrl + "/" + itemId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(`HTTP error on fetch one! status: ${response.status}`);
      }
      // parse JSON response
      const result = await response.json();
      // update state
      setData(result);
      // return the result
      return result;
      // catch all errors
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      // reset loading state
      setLoading(false);
    }
  };

  // if thingId is provided, fetch immediately
  useEffect(() => {
    if (itemId && !lazy) {
      fetchOne(itemId);
    }
  }, []);

  // return state and the fetch function
  return { data, loading, error, fetchOne };
};

export default useFetchOne;
