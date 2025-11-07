import apiUtils from "../util";

const { useFetch } = apiUtils;

const MILESTONES_URL = "/api/milestones/";

const useFetchMilestones = () => {
  const { data, loading, error, fetchData } = useFetch(MILESTONES_URL);

  return { data, loading, error, fetchData };
};

export default useFetchMilestones;
