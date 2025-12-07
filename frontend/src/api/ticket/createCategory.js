import apiUtils from "../util";

const { useCreate } = apiUtils;

const TICKET_CATEGORY_CREATE_URL = "/api/tickets/categories/";

const useCreateTicketCategory = () => {
  const { data, loading, error, create } = useCreate(
    TICKET_CATEGORY_CREATE_URL,
  );
  return { data, loading, error, create };
};

export default useCreateTicketCategory;
