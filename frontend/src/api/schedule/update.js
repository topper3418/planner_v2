import apiUtils from "../util";

const { useUpdate } = apiUtils;

const SCHEDULE_UPDATE_URL = "/api/schedules";

const useUpdateSchedule = () => {
  const { data, loading, error, update } = useUpdate(SCHEDULE_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateSchedule;
