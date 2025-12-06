import { useState } from "react";

const useScheduleBuffer = () => {
  const [mutateScheduleName, setMutateScheduleName] = useState("");
  const [mutateScheduleWeekdays, setMutateScheduleWeekdays] = useState([]);
  const [mutateScheduleMonthdays, setMutateScheduleMonthdays] = useState([]);
  const [mutateScheduleYeardays, setMutateScheduleYeardays] = useState([]);
  const scheduleModalReset = () => {
    setMutateScheduleName("");
    setMutateScheduleWeekdays([]);
    setMutateScheduleMonthdays([]);
    setMutateScheduleYeardays([]);
  };
  // Callbacks to ensure only one of weekdays, monthdays, yeardays is set at a time
  const setMutateScheduleWeekdaysCallback = (weekdays) => {
    setMutateScheduleMonthdays([]);
    setMutateScheduleYeardays([]);
    setMutateScheduleWeekdays(weekdays);
  };
  const setMutateScheduleMonthdaysCallback = (monthdays) => {
    setMutateScheduleWeekdays([]);
    setMutateScheduleYeardays([]);
    setMutateScheduleMonthdays(monthdays);
  };
  const setMutateScheduleYeardaysCallback = (yeardays) => {
    setMutateScheduleWeekdays([]);
    setMutateScheduleMonthdays([]);
    setMutateScheduleYeardays(yeardays);
  };
  const mutateSchedule = {
    name: mutateScheduleName,
    weekdays: mutateScheduleWeekdays,
    monthdays: mutateScheduleMonthdays,
    yeardays: mutateScheduleYeardays,
    set: {
      name: setMutateScheduleName,
      weekdays: setMutateScheduleWeekdaysCallback,
      monthdays: setMutateScheduleMonthdaysCallback,
      yeardays: setMutateScheduleYeardaysCallback,
    },
    reset: scheduleModalReset,
  };
  return mutateSchedule;
};

export default useScheduleBuffer;
