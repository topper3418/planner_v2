import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useApi from "../../api";
import components from "../../components";
import useViewNavigation from "../../navigation";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";

const {
  details: {
    controllers: { useUserModalControl } },
} = components;

const useUserViewHooks = () => {
  // URL State
  const navigation = useViewNavigation();
  const { userId } = navigation.getQueryParam;
  const ticketQueryParams = useTicketQueryParams(navigation.getQueryParam);
  const select = {
    user: (id) => {
      if (id == userId) {
        navigation.navigate(`/users/`);
      } else {
        navigation.navigate(`/users/${id}`);
      }
    },
    ticket: (id) => {
      navigation.navigate(`/tickets/${id}`);
    }
  }
  // API object
  const api = {
    user: {
      list: useApi.user.fetchMany(),
      selected: useApi.user.fetchOne(userId),
      create: useApi.user.create(),
      update: useApi.user.update(),
    },
    ticket: {
      list: useApi.ticket.fetchMany(ticketQueryParams),
    },
  };
  api.refreshAll = () => {
    api.user.list.fetchData();
    if (userId) {
      api.user.selected.fetchOne(userId);
      api.ticket.list.fetchData(ticketQueryParams);
    }
  };

  // Modal Control
  const modalControl = useUserModalControl(api, userId);

  // refresh when a new user is selected
  useEffect(() => {
    api.refreshAll();
  }, [
    navigation.getQueryParam.thingIds,
    navigation.getQueryParam.showClosed,
    navigation.getQueryParam.milestoneId,
    navigation.getQueryParam.userId,
    navigation.getQueryParam.search,
    navigation.getQueryParam.ticketCategoryIds,
  ]);

  return {
    userId,
    api,
    select,
    modalControl,
  };
}

export default useUserViewHooks;
