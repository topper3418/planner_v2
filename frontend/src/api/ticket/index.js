import useCreateTicket from "./create";
import useFetchTicket from "./fetchOne";
import useFetchTickets from "./fetchMany";
import useFetchTicketCategories from "./fetchCategories";
import useUpdateTicket from "./update";
import useFetchTicketCount from "./fetchCount";
import useAddMilestoneToTicket from "./addMilestone";
import useRemoveMilestoneFromTicket from "./removeMilestone";
import useCreateTicketCategory from "./createCategory";
import useUpdateTicketCategory from "./updateCategory";
import useFetchTicketTodos from "./fetchTodos";
import ticketLinksApi from "./links";

const ticketApi = {
  create: useCreateTicket,
  fetchOne: useFetchTicket,
  fetchMany: useFetchTickets,
  fetchCount: useFetchTicketCount,
  update: useUpdateTicket,
  fetchCategories: useFetchTicketCategories,
  addMilestone: useAddMilestoneToTicket,
  removeMilestone: useRemoveMilestoneFromTicket,
  createCategory: useCreateTicketCategory,
  updateCategory: useUpdateTicketCategory,
  fetchTodos: useFetchTicketTodos,
  links: ticketLinksApi,
};

export default ticketApi;
