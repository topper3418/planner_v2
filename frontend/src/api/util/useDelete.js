import { useState } from "react";

const useDelete = (url) => {
  // initialize state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // delete function
  const remove = async (id) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(url + "/" + id, {
        method: "DELETE",
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(`HTTP error on delete! status: ${response.status}`);
      }
      // return success
      return true;
      // catch all errors
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      // reset loading state
      setLoading(false);
    }
  };

  // return state and the delete function
  return { loading, error, remove };
};

export default useDelete;
