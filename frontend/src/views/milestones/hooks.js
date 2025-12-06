import { useEffect } from "react";

import useApi from "../../api";
import components from "../../components";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";
import useViewNavigation from "../../navigation";

const {
  modals: {
    controllers: { useMilestoneModalControl },
  },
} = components;

const useMilestoneViewHooks = () => {
  // URL State
  const navigation = useViewNavigation();
  const { milestoneId } = navigation.getQueryParam;
  const select = {
    milestone: (id) => {
      if (id == milestoneId) {
        navigation.navigate(`/milestones/`);
      } else {
        navigation.navigate(`/milestones/${id}`);
      }
    },
    ticket: (id) => {
      navigation.navigate(`/tickets/${id}`);
    },
  };
  const ticketParams = useTicketQueryParams(navigation.getQueryParam);
  // API object
  const api = {
    milestone: {
      selected: useApi.milestone.fetchOne(milestoneId),
      list: useApi.milestone.fetchMany(),
      create: useApi.milestone.create(),
      update: useApi.milestone.update(),
    },
    ticket: {
      list: useApi.ticket.fetchMany(ticketParams),
    },
  };
  api.refreshAll = () => {
    if (milestoneId) {
      api.milestone.selected.fetchOne(milestoneId);
    }
    api.milestone.list.fetchData();
    if (milestoneId) {
      api.ticket.list.fetchData(ticketParams);
    }
  };
  // Modal Control
  const modalControl = useMilestoneModalControl(api, milestoneId);

  // refresh all on milestoneId change
  useEffect(() => {
    if (milestoneId) {
      api.refreshAll();
    }
  }, [
    navigation.getQueryParam.thingIds,
    navigation.getQueryParam.showClosed,
    navigation.getQueryParam.milestoneId,
    navigation.getQueryParam.userId,
    navigation.getQueryParam.search,
    navigation.getQueryParam.ticketCategoryIds,
  ]);

  return {
    milestoneId,
    api,
    select,
    modalControl,
  };
};

export default useMilestoneViewHooks;
