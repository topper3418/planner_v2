import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useApi from "../../api";
import components from "../../components";
import useViewNavigation from "../../navigation";

const {
  details: {
    controllers: { useTicketModalControl },
  },
} = components;

const useTicketViewHooks = () => {
  // URL state
  const { ticketId } = useParams();
  const navigation = useViewNavigation();
  const select = {
    ticket: (newTicketId) => {
      if (newTicketId == ticketId) {
        navigation.navigateWithParams(`/tickets/`);
        return;
      }
      navigation.navigateWithParams(`/tickets/${newTicketId}`);
    },
  };
  // API object
  const api = {
    ticket: {
      selected: useApi.ticket.fetchOne(ticketId),
      create: useApi.ticket.create(),
      update: useApi.ticket.update(),
      addMilestone: useApi.ticket.addMilestone(),
      removeMilestone: useApi.ticket.removeMilestone(),
    },
    milestone: {
      list: useApi.milestone.fetchMany(),
    },
  };
  api.refreshTicket = () => {
    if (ticketId) {
      api.ticket.selected.fetchOne(ticketId);
    }
  };
  api.refreshMilestones = () => {
    if (ticketId) {
      api.milestone.list.fetchData({ ticket_id: ticketId });
    }
  };
  api.refreshAll = () => {
    api.refreshTicket();
    api.refreshMilestones();
  };

  // refresh all on ticketId change
  useEffect(() => {
    if (ticketId) {
      api.refreshAll();
    }
  }, [ticketId]);
  // refresh milestones on add/remove milestone
  useEffect(() => {
    api.refreshMilestones();
  }, [api.ticket.addMilestone.data, api.ticket.removeMilestone.data]);

  const modalControl = useTicketModalControl(api);

  return {
    ticketId,
    select,
    api,
    modalControl,
  };
};

export default useTicketViewHooks;
