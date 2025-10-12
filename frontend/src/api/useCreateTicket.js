import { useState } from "react";

const TICKET_CREATE_URL = "/api/tickets";

const useCreateTicket = () => {
  // initialize state
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch function
  const createTicket = async ({
    title,
    description,
    thing_id,
    category_id,
    parent_id,
  }) => {
    // reset state
    setLoading(true);
    setError(null);
    try {
      // actual fetch
      const response = await fetch(TICKET_CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          thing_id,
          category_id,
          parent_id,
        }),
      });
      // handle non-2xx status
      if (!response.ok) {
        throw new Error(
          `HTTP error on create ticket! status: ${response.status}`,
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
  return { data, loading, error, createTicket };
};

export default useCreateTicket;
