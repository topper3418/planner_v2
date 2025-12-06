import { useState } from "react";

const useMilestoneBuffer = () => {
  const [mutateMilestoneName, setMutateMilestoneName] = useState("");
  const [mutateMilestoneDescription, setMutateMilestoneDescription] =
    useState("");
  const [mutateMilestoneDueDate, setMutateMilestoneDueDate] = useState(null);
  const milestoneModalReset = () => {
    setMutateMilestoneName("");
    setMutateMilestoneDescription("");
    setMutateMilestoneDueDate(null);
  };
  const mutateMilestone = {
    name: mutateMilestoneName,
    description: mutateMilestoneDescription,
    due_date: mutateMilestoneDueDate,
    set: {
      name: setMutateMilestoneName,
      description: setMutateMilestoneDescription,
      due_date: setMutateMilestoneDueDate,
    },
    reset: milestoneModalReset,
  };
  return mutateMilestone;
};

export default useMilestoneBuffer;
