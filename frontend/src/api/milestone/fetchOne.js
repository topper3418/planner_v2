import apiUtils from "../util";

const { useFetchOne } = apiUtils;

// url
const MILESTONE_GET_URL = "/api/milestones";

const useFetchMilestone = (milestoneId = undefined) => {
  const { data, loading, error, fetchOne } = useFetchOne(
    MILESTONE_GET_URL,
    milestoneId,
  );

  // return state and the fetch function
  return { data, loading, error, fetchOne };
};

export default useFetchMilestone;
