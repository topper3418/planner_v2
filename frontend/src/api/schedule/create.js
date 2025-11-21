import apiUtils from "../util";

const { useCreate } = apiUtils;

const SCHEDULE_CREATE_URL = "/api/schedules/";

const useCreateSchedule = () => {
  const { data, loading, error, create } = useCreate(SCHEDULE_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateSchedule;
