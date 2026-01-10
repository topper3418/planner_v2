import apiUtils from "../../util";

const { useFetch } = apiUtils;

const TICKET_LINK_TYPES_URL = "/api/tickets/ticket_link_types/";

const useFetchTicketLinkTypes = () => {
  const { data, loading, error, fetchData } = useFetch(TICKET_LINK_TYPES_URL);

  return { data, loading, error, fetchData };
};

export default useFetchTicketLinkTypes;
