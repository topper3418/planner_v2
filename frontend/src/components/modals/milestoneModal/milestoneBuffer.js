import { useState } from "react";

const useMilestoneBuffer = () => {
  const [mutateMilestoneName, setMutateMilestoneName] = useState("");
  const [mutateMilestoneDescription, setMutateMilestoneDescription] =
    useState("");
  const [mutateMilestoneStartDate, setMutateMilestoneStartDate] =
    useState(null);
  const [mutateMilestoneDueDate, setMutateMilestoneDueDate] = useState(null);
  const milestoneModalReset = () => {
    setMutateMilestoneName("");
    setMutateMilestoneDescription("");
    setMutateMilestoneDueDate(null);
    setMutateMilestoneStartDate(null);
  };
  const mutateMilestone = {
    name: mutateMilestoneName,
    description: mutateMilestoneDescription,
    dueDate: mutateMilestoneDueDate,
    startDate: mutateMilestoneStartDate,
    set: {
      name: setMutateMilestoneName,
      description: setMutateMilestoneDescription,
      dueDate: setMutateMilestoneDueDate,
      startDate: setMutateMilestoneStartDate,
    },
    reset: milestoneModalReset,
  };
  return mutateMilestone;
};

export default useMilestoneBuffer;
