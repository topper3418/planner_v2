import apiUtils from "../util";

const { useCreate } = apiUtils;

const TICKET_LINK_TYPE_CREATE_URL = "/api/tickets/ticket_link_types/";

const useCreateTicketLinkType = () => {
  const { data, loading, error, create } = useCreate(
    TICKET_LINK_TYPE_CREATE_URL,
  );
  return { data, loading, error, create };
};

export default useCreateTicketLinkType;
