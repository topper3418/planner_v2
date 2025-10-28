import apiUtils from "../util";

const { useFetchCount } = apiUtils;

const GET_TICKET_COUNT_URL = "/api/tickets/count";

const useFetchTicketCount = (ticketId = undefined) => {
  const { count, loading, error, fetchCount } = useFetchCount(
    GET_TICKET_COUNT_URL,
    ticketId,
  );

  return { count, loading, error, fetchCount };
};

export default useFetchTicketCount;
