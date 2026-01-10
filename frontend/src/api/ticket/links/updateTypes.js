import apiUtils from "../../util";

const { useUpdate } = apiUtils;

const UPDATE_TICKET_LINK_TYPES_URL = "/api/tickets/ticket_link_types";

const useUpdateTicketLinkType = () => {
  const { data, loading, error, update } = useUpdate(
    UPDATE_TICKET_LINK_TYPES_URL,
  );
  return { data, loading, error, update };
};

export default useUpdateTicketLinkType;
