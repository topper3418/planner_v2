import { useState } from "react";
import useTicketLinkBuffer from "./ticketLinkBuffer";

const useTicketLinkModalControl = (ticketId, api) => {
  const [addTicketLinkModalOpen, setAddTicketLinkModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const ticketLinkBuffer = useTicketLinkBuffer();
  const modalControl = {
    loading: api.ticket.links.create.loading,
    error: api.ticket.links.create.error,
    mode: modalMode,
    ticketLink: ticketLinkBuffer,
    add: {
      title: "Add Ticket Link",
      isOpen: addTicketLinkModalOpen,
      open: () => {
        setModalMode("add");
        setAddTicketLinkModalOpen(true);
      },
      close: () => {
        ticketLinkBuffer.reset();
        setAddTicketLinkModalOpen(false);
      },
      submit: async () => {
        console.log("Submitting ticket link:", ticketLinkBuffer);
        await api.ticket.links.create.create({
          label: ticketLinkBuffer.label,
          link: ticketLinkBuffer.link,
          link_type_id: ticketLinkBuffer.linkTypeId,
        });
        api.refreshAll();
        ticketLinkBuffer.reset();
        setAddTicketLinkModalOpen(false);
      },
    },
  };
  return modalControl;
};

export default useTicketLinkModalControl;
