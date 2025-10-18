import { useEffect } from "react";
import useFetchState from "../../util/useFetchState";

const TICKET_CATEGORIES_URL = "/api/tickets/categories/";

const useFetchTicketCategories = () => {
  const { data, setData, loading, setLoading, error, setError, reset } =
    useFetchState(null);

  const fetchData = async () => {
    // reset state
    reset();
    // build url
    const url = new URL(TICKET_CATEGORIES_URL, window.location.origin);
    // fetch data, manage state
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error on fetch ticket categories! status: ${response.status}`,
        );
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchTicketCategories;
