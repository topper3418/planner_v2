import { Flex } from "antd";
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
  return (<>
    <Flex style={{ height: '100%', flexWrap: 'wrap' }} gap="10px">
      <ScheduleList
        scheduleId={scheduleId}
        scheduleApi={api}
        loading={api.schedule.list.loading}
        createLoading={api.schedule.create.loading}
        createCallback={() => modalControl.add.open()}
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
