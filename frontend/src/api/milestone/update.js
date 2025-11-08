import apiUtils from "../util";

const { useUpdate } = apiUtils;

const MILESTONE_UPDATE_URL = "/api/milestones";

const useUpdateMilestone = () => {
  const { data, loading, error, update } = useUpdate(MILESTONE_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateMilestone;
