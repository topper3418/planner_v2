import { useState } from "react";
import useScheduleBuffer from "./scheduleBuffer";

const useScheduleModalControl = (api, scheduleId) => {
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const scheduleBuffer = useScheduleBuffer();
  const modalControl = {
    loading:
      api.schedule.selected.loading ||
      api.schedule.create.loading ||
      api.schedule.update.loading,
    error:
      api.schedule.selected.error ||
      api.schedule.create.error ||
      api.schedule.update.error,
    mode: modalMode,
    schedule: scheduleBuffer,
    weekdaysOptions: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    monthDayOptions: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    yearDayOptions: Array.from({ length: 365 }, (_, i) => (i + 1).toString()),
    add: {
      title: "Add Schedule",
      isOpen: addScheduleModalOpen,
      open: () => {
        setModalMode("add");
        setAddScheduleModalOpen(true);
      },
      close: () => {
        scheduleBuffer.reset();
        setAddScheduleModalOpen(false);
      },
      submit: async () => {
        const { name, weekdays, monthdays, yeardays } = scheduleBuffer;
        console.log("Submitting new schedule:", scheduleBuffer);
        await api.schedule.create.create({
          name,
          weekdays: weekdays ? weekdays.join(",") : null,
          monthdays: monthdays ? monthdays.join(",") : null,
          yeardays: yeardays ? yeardays.join(",") : null,
        });
        api.refreshAll();
        scheduleBuffer.reset();
        setAddScheduleModalOpen(false);
      },
    },
    edit: {
      title: "Edit Schedule",
      isOpen: editScheduleModalOpen,
      open: () => {
        setModalMode("edit");
        // set the mutateSchedule to the current schedule data
        const { name, weekdays, monthdays, yeardays } =
          api.schedule.selected.data;
        scheduleBuffer.set.name(name);
        if (weekdays) {
          scheduleBuffer.set.weekdays(
            weekdays ? weekdays.split(",").map(Number) : [],
          );
        }
        if (monthdays) {
          scheduleBuffer.set.monthdays(
            monthdays ? monthdays.split(",").map(Number) : [],
          );
        }
        if (yeardays) {
          scheduleBuffer.set.yeardays(
            yeardays ? yeardays.split(",").map(Number) : [],
          );
        }
        // then open the modal
        setEditScheduleModalOpen(true);
      },
      close: () => {
        scheduleBuffer.reset();
        setEditScheduleModalOpen(false);
      },
      submit: async () => {
        const { name, weekdays, monthdays, yeardays } = scheduleBuffer;
        await api.schedule.update.update({
          id: scheduleId,
          name,
          weekdays: weekdays ? weekdays.join(",") : null,
          monthdays: monthdays ? monthdays.join(",") : null,
          yeardays: yeardays ? yeardays.join(",") : null,
        });
        api.refreshAll();
        scheduleBuffer.reset();
        setEditScheduleModalOpen(false);
      },
    },
  };
  return modalControl;
};

export default useScheduleModalControl;
