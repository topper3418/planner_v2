import apiUtils from "../../../util";

const TICKETS_URL = "/api/tickets/";

const useRemoveLinkFromTicket = (ticketId) => {
  const TICKET_REMOVE_LINK_URL = `${TICKETS_URL}${ticketId}/links/`;
  const { data, loading, error, remove } = apiUtils.useRemove(
    TICKET_REMOVE_LINK_URL,
  );
  // return state and the fetch function
  return { data, loading, error, remove };
};

export default useRemoveLinkFromTicket;
