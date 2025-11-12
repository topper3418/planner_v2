import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import useApi from "../../api";
import components from "../../components";

const {
  details: {
    controllers: { useMilestoneModalControl },
  },
} = components;

const useMilestoneViewHooks = () => {
  // URL State
  const { milestoneId } = useParams();
  const navigate = useNavigate();
  const select = {
    milestone: (id) => {
      if (id == milestoneId) {
        navigate(`/milestones/`);
      } else {
        navigate(`/milestones/${id}`);
      }
    },
    ticket: (id) => {
      navigate(`/tickets/${id}`);
    },
  };
  // API object
  const api = {
    milestone: {
      selected: useApi.milestone.fetchOne(milestoneId),
      list: useApi.milestone.fetchMany(),
      create: useApi.milestone.create(),
      update: useApi.milestone.update(),
    },
    ticket: {
      list: useApi.ticket.fetchMany({ milestone_id: milestoneId }),
    },
  };
  api.refreshAll = () => {
    if (milestoneId) {
      api.milestone.selected.fetchOne(milestoneId);
    }
    api.milestone.list.fetchData();
    if (milestoneId) {
      api.ticket.list.fetchData({ milestone_id: milestoneId });
    }
  };
  // Modal Control
  const modalControl = useMilestoneModalControl(api, milestoneId);

  // refresh all on milestoneId change
  useEffect(() => {
    if (milestoneId) {
      api.refreshAll();
    }
  }, [milestoneId]);

  return {
    milestoneId,
    api,
    select,
    modalControl,
  };
};

export default useMilestoneViewHooks;
