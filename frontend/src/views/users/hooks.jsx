import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useApi from "../../api";
import components from "../../components";

const {
  details: {
    controllers: { useUserModalControl } },
} = components;

const useUserViewHooks = () => {
  // URL State
  const { userId } = useParams();
  const navigate = useNavigate();
  const select = {
    user: (id) => {
      if (id == userId) {
        navigate(`/users/`);
      } else {
        navigate(`/users/${id}`);
      }
    },
    ticket: (id) => {
      navigate(`/tickets/${id}`);
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
      list: useApi.ticket.fetchMany({ user_id: userId }),
    },
  };
  api.refreshAll = () => {
    api.user.list.fetchData();
    if (userId) {
      api.user.selected.fetchOne(userId);
      api.ticket.list.fetchData({ user_id: userId });
    }
  };

  // Modal Control
  const modalControl = useUserModalControl(api, userId);

  // refresh when a new user is selected
  useEffect(() => {
    api.refreshAll();
  }, [userId]);

  return {
    userId,
    api,
    select,
    modalControl,
  };
}

export default useUserViewHooks;
