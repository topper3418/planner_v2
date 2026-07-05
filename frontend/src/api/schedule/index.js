import useCreateSchedule from "./create";
import useFetchSchedules from "./fetchMany";
import useUpdateSchedule from "./update";
import useFetchSchedule from "./fetchOne";
import useRunSchedules from "./run";

const scheduleApi = {
  create: useCreateSchedule,
  fetchMany: useFetchSchedules,
  update: useUpdateSchedule,
  fetchOne: useFetchSchedule,
  run: useRunSchedules,
};

export default scheduleApi;
