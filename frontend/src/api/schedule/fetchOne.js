import apiUtils from "../util";

const { useFetchOne } = apiUtils;

// url
const SCHEDULE_GET_URL = "/api/schedules";

const useFetchSchedule = (sheduleId = undefined) => {
  const { data, loading, error, fetchOne } = useFetchOne(
    SCHEDULE_GET_URL,
    sheduleId,
  );

  // return state and the fetch function
  return { data, loading, error, fetchOne };
};

export default useFetchSchedule;
