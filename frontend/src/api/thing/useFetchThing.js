import { useEffect, useState } from "react";

// url
const THING_GET_URL = "/api/things";

const useFetchThing = (thingId = undefined) => {
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const getThing = async (thingId) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(THING_GET_URL + "/" + thingId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(`HTTP error on get thing! status: ${response.status}`);
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
    if (thingId) {
      getThing(thingId);
    }
  }, []);

  // return state and the fetch function
  return { data, loading, error, getThing };
};

export default useFetchThing;
