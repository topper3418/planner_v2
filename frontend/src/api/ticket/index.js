import useCreateTicket from "./useCreateTicket";
import useFetchTicket from "./useFetchTicket";
import useFetchTickets from "./useFetchTickets";
import useFetchTicketCategories from "./useFetchTicketCategories";
import useUpdateTicket from "./useUpdateTicket";

const ticketApi = {
  create: useCreateTicket,
  fetchOne: useFetchTicket,
  fetchMany: useFetchTickets,
  update: useUpdateTicket,
  fetchCategories: useFetchTicketCategories,
};

export default ticketApi;
