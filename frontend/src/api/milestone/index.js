import useCreateMilestone from "./create";
import useFetchMilestones from "./fetchMany";
import useUpdateMilestone from "./update";
import useFetchMilestone from "./fetchOne";

const milestoneApi = {
  create: useCreateMilestone,
  fetchMany: useFetchMilestones,
  update: useUpdateMilestone,
  fetchOne: useFetchMilestone,
};

export default milestoneApi;
