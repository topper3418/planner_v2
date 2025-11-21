import useCreateSchedule from "./create";
import useFetchSchedules from "./fetchMany";
import useUpdateSchedule from "./update";
import useFetchSchedule from "./fetchOne";

const scheduleApi = {
  create: useCreateSchedule,
  fetchMany: useFetchSchedules,
  update: useUpdateSchedule,
  fetchOne: useFetchSchedule,
};

export default scheduleApi;
