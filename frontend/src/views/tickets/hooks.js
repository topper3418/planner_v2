import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useApi from "../../api";
import components from "../../components";
import useViewNavigation from "../../navigation";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";

const {
  modals: {
    controllers: { 
      useTicketModalControl ,
      useTicketLinkModalControl,
    },
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
  const ticketTableQueryParams = useTicketQueryParams(navigation.getQueryParam);
  const api = {
    ticket: {
      list: useApi.ticket.fetchMany(ticketTableQueryParams),
      selected: useApi.ticket.fetchOne(ticketId),
      create: useApi.ticket.create(),
      update: useApi.ticket.update(),
      addMilestone: useApi.ticket.addMilestone(),
      removeMilestone: useApi.ticket.removeMilestone(),
      links: {
        list: useApi.ticket.links.fetchMany(ticketId, {
          include: ["link_type"],
        }),
        create: useApi.ticket.links.create(ticketId),
        remove: useApi.ticket.links.remove(ticketId),
      },
    },
  };
  api.refreshTicket = () => {
    if (ticketId) {
      api.ticket.selected.fetchOne(ticketId);
      api.ticket.list.fetchData(ticketTableQueryParams);
      api.ticket.links.list.fetchData({
        include: ["link_type"],
      });
    }
  };
  api.refreshAll = () => {
    api.refreshTicket();
  };

  // refresh all on ticketId change
  useEffect(() => {
    if (ticketId) {
      api.refreshAll();
    }
  }, [ticketId]);

  const modalControl = {
    ticket: useTicketModalControl(api),
    ticketLink: useTicketLinkModalControl(ticketId, api),
  };

  return {
    ticketId,
    select,
    api,
    modalControl,
  };
};

export default useTicketViewHooks;
