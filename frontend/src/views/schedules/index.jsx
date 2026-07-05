import { Flex, message } from "antd";
import components from "../../components";
import useScheduleViewHooks from "./hooks";


const {
  tables: { ScheduleList, TicketList },
  details: { ScheduleDetails },
  modals: { ScheduleModal }
} = components;

const ScheduleView = () => {
  const {
    scheduleId,
    api,
    select,
    modalControl,
  } = useScheduleViewHooks();

  const runSchedules = async () => {
    try {
      const result = await api.schedule.run.run();
      const scheduleCount = result.matching_schedules?.length ?? 0;
      const ticketCount = result.tickets_processed ?? 0;
      message.success(
        `Ran ${scheduleCount} matching schedule(s); processed ${ticketCount} ticket(s).`,
      );
      api.refreshAll();
    } catch {
      message.error("Failed to run schedules.");
    }
  };

  return (<>
    <Flex style={{ height: '100%', flexWrap: 'wrap' }} gap="10px">
      <ScheduleList
        scheduleId={scheduleId}
        scheduleApi={api}
        loading={api.schedule.list.loading}
        createLoading={api.schedule.create.loading}
        runLoading={api.schedule.run.loading}
        createCallback={() => modalControl.add.open()}
        runCallback={runSchedules}
        selectSchedule={(scheduleId) => select.schedule(scheduleId)} />
      {scheduleId &&
        <ScheduleDetails
          weekdaysOptions={modalControl.weekdaysOptions}
          schedule={api.schedule.selected.data}
          editCallback={modalControl.edit.open}
        />
      }
      {scheduleId &&
        <TicketList
          tickets={api.ticket.list.data || []}
          ticketsLoading={api.ticket.list.loading}
          selectTicket={select.ticket} />}
    </Flex>
    <ScheduleModal
      modalControl={modalControl} />
  </>)
}

export default ScheduleView;
