import { useState } from "react";
import useTicketBuffer from "./ticketBuffer";
import { useParams } from "react-router-dom";

const useTicketModalControl = (api) => {
  const [addTicketModalOpen, setAddTicketModalOpen] = useState(false);
  const [editTicketModalOpen, setEditTicketModalOpen] = useState(false);
  const { ticketId, thingId } = useParams();
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const ticketBuffer = useTicketBuffer();
  const ticketModalControl = {
    error:
      api.ticket.selected.error ||
      api.ticket.create.error ||
      api.ticket.update.error,
    mode,
    ticket: ticketBuffer,
    add: {
      isOpen: addTicketModalOpen,
      open: () => {
        setMode("add");
        ticketBuffer.reset();
        setAddTicketModalOpen(true);
      },
      close: () => setAddTicketModalOpen(false),
      submit: async () => {
        await api.ticket.create.create({
          title: ticketBuffer.title,
          description: ticketBuffer.description,
          open: ticketBuffer.open,
          thing_id: thingId || ticketBuffer.thingId,
          category_id: ticketBuffer.categoryId,
          user_id: ticketBuffer.userId,
        });
        api.fefreshAll();
        ticketBuffer.reset();
        setAddTicketModalOpen(false);
      },
    },
    edit: {
      isOpen: editTicketModalOpen,
      open: () => {
        setMode("edit");
        console.log("moving to edit mode", api.ticket.selected.data);
        ticketBuffer.set.title(api.ticket.selected.data?.title);
        ticketBuffer.set.description(api.ticket.selected.data?.description);
        ticketBuffer.set.open(api.ticket.selected.data?.open);
        ticketBuffer.set.thingId(api.ticket.selected.data?.thing_id);
        ticketBuffer.set.categoryId(api.ticket.selected.data?.category_id);
        ticketBuffer.set.userId(api.ticket.selected.data?.user_id);
        setEditTicketModalOpen(true);
      },
      close: () => setEditTicketModalOpen(false),
      submit: async () => {
        console.log("update: ", api.ticket.update);
        await api.ticket.update.update({
          id: ticketId,
          title: ticketBuffer.title,
          description: ticketBuffer.description,
          open: ticketBuffer.open,
          thing_id: thingId || ticketBuffer.thingId,
          category_id: ticketBuffer.categoryId,
          user_id: ticketBuffer.userId,
        });
        api.refreshAll();
        ticketBuffer.reset();
        setEditTicketModalOpen(false);
      },
    },
  };
  return ticketModalControl;
};

export default useTicketModalControl;
