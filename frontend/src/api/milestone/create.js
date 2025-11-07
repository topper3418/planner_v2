import apiUtils from "../util";

const { useCreate } = apiUtils;

const MILESTONE_CREATE_URL = "/api/milestones/";

const useCreateMilestone = () => {
  const { data, loading, error, create } = useCreate(MILESTONE_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateMilestone;
