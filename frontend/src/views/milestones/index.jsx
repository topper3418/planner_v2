import { Flex } from "antd";
import components from "../../components";
import useMilestoneViewHooks from "./hooks";


const {
  tables: { MilestoneList, TicketList },
  details: { MilestoneDetails },
  modals: { MilestoneModal }
} = components;

const MilestoneView = () => {
  const {
    milestoneId,
    api,
    select,
    modalControl,
  } = useMilestoneViewHooks();
  return (<>
    <Flex style={{ height: '100%', flexWrap: 'wrap' }} gap="10px">
      <MilestoneList
        milestoneId={milestoneId}
        milestones={api.milestone.list.data || []}
        loading={api.milestone.list.loading}
        createLoading={api.milestone.create.loading}
        createCallback={() => modalControl.add.open()}
        selectMilestone={(milestoneId) => select.milestone(milestoneId)} />
      {milestoneId &&
        <MilestoneDetails
          milestone={api.milestone.selected.data}
          editCallback={modalControl.edit.open}
        />
      }
      {milestoneId &&
        <TicketList
          tickets={api.ticket.list.data || []}
          ticketsLoading={api.ticket.list.loading}
          selectTicket={select.ticket} />}
    </Flex>
    <MilestoneModal
      modalControl={modalControl} />
  </>)
}

export default MilestoneView;
