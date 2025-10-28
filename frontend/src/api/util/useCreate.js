import { useState } from "react";

const useCreate = (url) => {
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const create = async (data) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      console.log("Creating data at:", url, "with data:", data);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(`HTTP error on create! status: ${response.status}`);
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
  return { data, loading, error, create };
};

export default useCreate;
