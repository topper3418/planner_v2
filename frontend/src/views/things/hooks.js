import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../../api/";
import components from "../../components";
import useViewNavigation from "../../navigation";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";

const {
  modals: {
    controllers: { useTicketModalControl, useThingModalControl },
  },
} = components;

const useThingViewHooks = () => {
  // URL state
  const { thingId, ticketId } = useParams();
  const navigation = useViewNavigation();
  const select = {
    thing: (newThingId) => {
      if (newThingId) {
        navigation.navigateWithParams(`/things/${newThingId}`);
      } else {
        navigation.navigateWithParams(`/things/`);
      }
    },
    ticket: (newTicketId) => {
      if (thingId) {
        if (newTicketId == ticketId) {
          navigation.navigateWithParams(`/things/${thingId}`);
          return;
        }
        navigation.navigateWithParams(
          `/things/${thingId}/tickets/${newTicketId}`,
        );
      } else {
        if (newTicketId === ticketId) {
          navigation.navigateWithParams(`/things`);
          return;
        }
        navigation.navigateWithParams(`/tickets/${newTicketId}`);
      }
    },
  };
  // component state
  const [checkedThingIds, setCheckedThingIds] = useState([]);
  // API object
  const ticketTableQueryParams = useTicketQueryParams(navigation.getQueryParam);
  const api = {
    thing: {
      tree: useApi.thing.fetchTree(),
      selected: useApi.thing.fetchOne(thingId),
      create: useApi.thing.create(),
      update: useApi.thing.update(),
    },
    ticket: {
      list: useApi.ticket.fetchMany(ticketTableQueryParams),
      selected: useApi.ticket.fetchOne(ticketId),
      create: useApi.ticket.create(),
      update: useApi.ticket.update(),
    },
  };
  api.refreshAll = () => {
    if (thingId) {
      api.thing.selected.fetchOne(thingId);
    }
    if (ticketId) {
      api.ticket.selected.fetchOne(ticketId);
    }
    api.thing.tree.fetchData();
    api.ticket.list.fetchData(ticketTableQueryParams);
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
    api.ticket.list.fetchData(ticketTableQueryParams);
  };

  // Effects to fetch data when IDs change
  useEffect(() => {
    api.thing.refresh();
  }, [thingId]);

  useEffect(() => {
    api.ticket.refresh();
  }, [ticketId]);

  // Modal Control
  const ticketModalControl = useTicketModalControl(api, {
    afterCreate: (createData) => {
      if (createData && createData.id) {
        if (thingId) {
          navigation.navigateWithParams(
            `/things/${thingId}/tickets/${createData.id}`,
          );
          return;
        }
        navigation.navigateWithParams(`/tickets/${createData.id}`);
      }
    },
  });
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
