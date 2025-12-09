import { useState } from "react";
import useMilestoneBuffer from "./milestoneBuffer";

const useMilestoneModalControl = (api, milestoneId) => {
  const [addMilestoneModalOpen, setAddMilestoneModalOpen] = useState(false);
  const [editMilestoneModalOpen, setEditMilestoneModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const milestoneBuffer = useMilestoneBuffer();
  console.log("milestone:", api.milestone.selected.data);
  const modalControl = {
    loading:
      api.milestone.selected.loading ||
      api.milestone.create.loading ||
      api.milestone.update.loading,
    error:
      api.milestone.selected.error ||
      api.milestone.create.error ||
      api.milestone.update.error,
    mode: modalMode,
    milestone: milestoneBuffer,
    add: {
      title: "Add Milestone",
      isOpen: addMilestoneModalOpen,
      open: () => {
        setModalMode("add");
        setAddMilestoneModalOpen(true);
      },
      close: () => {
        milestoneBuffer.reset();
        setAddMilestoneModalOpen(false);
      },
      submit: async () => {
        await api.milestone.create.create({
          name: milestoneBuffer.name,
          description: milestoneBuffer.description,
          due_date: milestoneBuffer.dueDate,
          start_date: milestoneBuffer.startDate,
        });
        api.refreshAll();
        milestoneBuffer.reset();
        setAddMilestoneModalOpen(false);
      },
    },
    edit: {
      title: "Edit Milestone",
      isOpen: editMilestoneModalOpen,
      open: () => {
        setModalMode("edit");
        // set the mutateMilestone to the current milestone data
        milestoneBuffer.set.name(api.milestone.selected.data.name);
        milestoneBuffer.set.description(
          api.milestone.selected.data.description,
        );
        milestoneBuffer.set.dueDate(api.milestone.selected.data.due_date);
        milestoneBuffer.set.startDate(api.milestone.selected.data.start_date);
        // then open the modal
        setEditMilestoneModalOpen(true);
      },
      close: () => {
        milestoneBuffer.reset();
        setEditMilestoneModalOpen(false);
      },
      submit: async () => {
        await api.milestone.update.update({
          id: milestoneId,
          name: milestoneBuffer.name,
          description: milestoneBuffer.description,
          due_date: milestoneBuffer.dueDate,
          start_date: milestoneBuffer.startDate,
        });
        api.refreshAll();
        milestoneBuffer.reset();
        setEditMilestoneModalOpen(false);
      },
    },
  };
  return modalControl;
};

export default useMilestoneModalControl;
