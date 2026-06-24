import { useState } from "react";
import { withApiBase } from "../config";

const useUpdate = (url) => {
  const baseUrl = withApiBase(url);
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const update = async (data) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(baseUrl + "/" + data.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(`HTTP error on update! status: ${response.status}`);
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
  return { data, loading, error, update };
};

export default useUpdate;
