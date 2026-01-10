import apiUtils from "../../util";

const TICKETS_URL = "/api/tickets/";

const useAddLinkToTicket = (ticketId) => {
  const TICKET_ADD_LINK_URL = `${TICKETS_URL}${ticketId}/links`;
  const { data, loading, error, create } =
    apiUtils.useCreate(TICKET_ADD_LINK_URL);
  const addLinkToTicket = (linkData) => {
    return create({
      ...linkData,
      ticket_id: ticketId,
    });
  };
  return { data, loading, error, create: addLinkToTicket };
};

export default useAddLinkToTicket;
