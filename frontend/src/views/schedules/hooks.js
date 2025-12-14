import { useEffect } from "react";

import useApi from "../../api";
import components from "../../components";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";
import useViewNavigation from "../../navigation";

const {
  modals: {
    controllers: { useScheduleModalControl },
  },
} = components;

const useScheduleViewHooks = () => {
  // URL State
  const navigation = useViewNavigation();
  const { scheduleId } = navigation.getQueryParam;
  const select = {
    schedule: (id) => {
      if (id == scheduleId) {
        navigation.navigate(`/schedules/`);
      } else {
        navigation.navigate(`/schedules/${id}`);
      }
    },
    ticket: (id) => {
      navigation.navigate(`/tickets/${id}`);
    },
  };
  const ticketParams = useTicketQueryParams(navigation.getQueryParam);
  // API object
  const api = {
    schedule: {
      selected: useApi.schedule.fetchOne(scheduleId),
      list: useApi.schedule.fetchMany({ pageSize: 10 }),
      create: useApi.schedule.create(),
      update: useApi.schedule.update(),
    },
    ticket: {
      list: useApi.ticket.fetchMany(ticketParams),
    },
  };
  api.refreshAll = () => {
    if (scheduleId) {
      api.schedule.selected.fetchOne(scheduleId);
    }
    api.schedule.list.fetchData();
    if (scheduleId) {
      api.ticket.list.fetchData(ticketParams);
    }
  };
  // Modal Control
  const modalControl = useScheduleModalControl(api, scheduleId);

  // refresh all on scheduleId change
  useEffect(() => {
    if (scheduleId) {
      api.refreshAll();
    }
  }, [
    navigation.getQueryParam.thingIds,
    navigation.getQueryParam.showClosed,
    navigation.getQueryParam.milestoneId,
    navigation.getQueryParam.scheduleId,
    navigation.getQueryParam.userId,
    navigation.getQueryParam.search,
    navigation.getQueryParam.ticketCategoryIds,
  ]);

  return {
    scheduleId,
    api,
    select,
    modalControl,
  };
};

export default useScheduleViewHooks;
