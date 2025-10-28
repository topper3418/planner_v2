import useCreateTicket from "./create";
import useFetchTicket from "./fetchOne";
import useFetchTickets from "./fetchMany";
import useFetchTicketCategories from "./fetchCategories";
import useUpdateTicket from "./update";
import useFetchTicketCount from "./fetchCount";

const ticketApi = {
  create: useCreateTicket,
  fetchOne: useFetchTicket,
  fetchMany: useFetchTickets,
  fetchCount: useFetchTicketCount,
  update: useUpdateTicket,
  fetchCategories: useFetchTicketCategories,
};

export default ticketApi;
