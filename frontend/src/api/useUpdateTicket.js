import { useState } from "react";

const UPDATE_TICKET_URL = "/api/tickets";

const useUpdateTicket = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTicket = async (ticket) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(UPDATE_TICKET_URL + "/" + ticket.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
      });
      if (!response.ok) {
        throw new Error(
          `HTTP error on create ticket! status: ${response.status}`,
        );
      }
      const result = await response.json();
      console.log("Updated ticket:", result);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, updateTicket };
};

export default useUpdateTicket;
