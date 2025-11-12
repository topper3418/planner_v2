import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../../api/";
import components from "../../components";

const {
  details: {
    controllers: { useTicketModalControl, useThingModalControl },
  },
} = components;

const useThingViewHooks = () => {
  // URL state
  const { thingId, ticketId } = useParams();
  const navigate = useNavigate();
  const select = {
    thing: (newThingId) => {
      if (newThingId) {
        navigate(`/things/${newThingId}`);
      } else {
        navigate(`/`);
      }
    },
    ticket: (newTicketId) => {
      if (thingId) {
        if (newTicketId == ticketId) {
          navigate(`/things/${thingId}`);
          return;
        }
        navigate(`/things/${thingId}/tickets/${newTicketId}`);
      } else {
        if (newTicketId === ticketId) {
          navigate(`/`);
          return;
        }
        navigate(`/tickets/${newTicketId}`);
      }
    },
  };
  // component state
  const [checkedThingIds, setCheckedThingIds] = useState([]);
  // API object
  const api = {
    thing: {
      selected: useApi.thing.fetchOne(thingId),
      create: useApi.thing.create(),
      update: useApi.thing.update(),
    },
    ticket: {
      selected: useApi.ticket.fetchOne(ticketId),
      create: useApi.ticket.create(),
      update: useApi.ticket.update(),
    },
  };
  api.fefreshAll = () => {
    if (thingId) {
      api.thing.selected.fetchOne(thingId);
    }
    if (ticketId) {
      api.ticket.selected.fetchOne(ticketId);
    }
  };
  api.thing.refresh = () => {
    if (thingId) {
      api.thing.selected.fetchOne(thingId);
    }
  };
  api.ticket.refresh = () => {
    if (ticketId) {
      api.ticket.selected.fetchOne(ticketId);
    }
  };

  // Effects to fetch data when IDs change
  useEffect(() => {
    api.thing.refresh();
  }, [thingId]);

  useEffect(() => {
    api.ticket.refresh();
  }, [ticketId]);

  // Modal Control
  const ticketModalControl = useTicketModalControl(api);
  const thingModalControl = useThingModalControl(api);

  return {
    ticketId,
    thingId,
    api,
    select,
    checkedThingIds,
    setCheckedThingIds,
    ticketModalControl,
    thingModalControl,
  };
};

export default useThingViewHooks;
