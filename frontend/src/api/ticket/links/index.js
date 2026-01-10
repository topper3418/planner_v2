import useRemoveLinkFromTicket from "./removeLink";
import useAddLinkToTicket from "./addLink";
import useFetchLinks from "./fetchLinks";

const ticketLinksApi = {
  renmove: useRemoveLinkFromTicket,
  create: useAddLinkToTicket,
  fetchMany: useFetchLinks,
};

export default ticketLinksApi;
