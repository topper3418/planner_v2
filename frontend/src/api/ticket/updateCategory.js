import apiUtils from "../util";

const { useUpdate } = apiUtils;

const UPDATE_TICKET_CATEGORY_URL = "/api/tickets/categories";

const useUpdateTicketCategory = () => {
  const { data, loading, error, update } = useUpdate(
    UPDATE_TICKET_CATEGORY_URL,
  );
  return { data, loading, error, update };
};

export default useUpdateTicketCategory;
