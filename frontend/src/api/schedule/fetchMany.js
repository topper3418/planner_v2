import apiUtils from "../util";

const { useFetch } = apiUtils;

const SCHEDULES_URL = "/api/schedules/";

const useFetchSchedules = () => {
  const { data, loading, error, fetchData } = useFetch(SCHEDULES_URL);

  return { data, loading, error, fetchData };
};

export default useFetchSchedules;
