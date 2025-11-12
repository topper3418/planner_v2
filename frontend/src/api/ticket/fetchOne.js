import apiUtils from "../util";

const { useFetchOne } = apiUtils;

const GET_TICKET_URL = "/api/tickets";

const useFetchTicket = (ticketId = undefined) => {
  const { data, loading, error, fetchOne } = useFetchOne(
    GET_TICKET_URL,
    ticketId,
  );

  return { data, loading, error, fetchOne };
};

export default useFetchTicket;
