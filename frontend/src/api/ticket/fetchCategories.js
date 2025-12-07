import apiUtils from "../util";

const { useFetch } = apiUtils;

const TICKET_CATEGORIES_URL = "/api/tickets/categories/";

const useFetchTicketCategories = () => {
  const { data, loading, error, fetchData } = useFetch(TICKET_CATEGORIES_URL);

  return { data, loading, error, fetchData };
};

export default useFetchTicketCategories;
