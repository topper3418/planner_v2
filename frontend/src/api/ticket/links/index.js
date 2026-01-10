import useRemoveLinkFromTicket from "./removeLink";
import useAddLinkToTicket from "./addLink";
import useFetchLinks from "./fetchLinks";
import useCreateTicketLinkType from "./createType";
import useUpdateTicketLinkType from "./updateTypes";
import useFetchTicketLinkTypes from "./fetchTypes";

const ticketLinksApi = {
  remove: useRemoveLinkFromTicket,
  create: useAddLinkToTicket,
  fetchMany: useFetchLinks,
  createType: useCreateTicketLinkType,
  updateType: useUpdateTicketLinkType,
  fetchTypes: useFetchTicketLinkTypes,
};

export default ticketLinksApi;
