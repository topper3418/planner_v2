import { useState } from "react";

const GET_TICKET_URL = "/api/tickets";

const useFetchTicket = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTicket = async (ticketId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GET_TICKET_URL + "/" + ticketId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error on get ticket! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched ticket:", result);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getTicket: getTicket };
};

export default useFetchTicket;
