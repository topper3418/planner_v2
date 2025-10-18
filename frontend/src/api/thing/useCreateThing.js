import { useState } from "react";

const THING_CREATE_URL = "/api/things";

const useCreateThing = () => {
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const createThing = async (name) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(THING_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(
          `HTTP error on create thing! status: ${response.status}`,
        );
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
  // return state and the fetch function
  return { data, loading, error, createThing };
};

export default useCreateThing;
