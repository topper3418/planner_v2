import apiUtils from "../util";

const { useUpdate } = apiUtils;

const UPDATE_TICKET_URL = "/api/tickets";

const useUpdateTicket = () => {
  const { data, loading, error, update } = useUpdate(UPDATE_TICKET_URL);
  return { data, loading, error, update };
};

export default useUpdateTicket;
