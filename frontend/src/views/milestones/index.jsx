import { Flex } from "antd";
import useApi from "../../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import components from "../../components";
import useMutateMilestone from "../../components/details/milestoneModal/mutateMilestoneHooks";


const {
  tables: { MilestoneList, TicketList },
  details: { MilestoneDetails, MilestoneModal },
} = components;

const MilestoneView = () => {
  const hooks = useMilestoneViewHooks();
  return (<>
    <Flex style={{ height: '100%' }} gap="10px">
      <MilestoneList
        milestoneId={hooks.milestoneId}
        milestones={hooks.milestonesData || []}
        loading={hooks.milestonesLoading}
        createLoading={hooks.createMilestoneLoading}
        createCallback={() => hooks.setAddMilestoneModalOpen(true)}
        selectMilestone={(milestoneId) => hooks.selectMilestone(milestoneId)} />
      {hooks.milestoneId &&
        <MilestoneDetails
          milestone={hooks.milestoneData}
          editCallback={() => {
            // set the mutateMilestone to the current milestone data
            hooks.mutateMilestone.set.name(hooks.milestoneData.name);
            hooks.mutateMilestone.set.description(hooks.milestoneData.description);
            hooks.mutateMilestone.set.due_date(hooks.milestoneData.due_date);
            hooks.setMutateMilestoneMode('update');
            // then open the modal
            hooks.setEditMilestoneModalOpen(true);
          }}
        />
      }
      <TicketList
        tickets={hooks.ticketData || []}
        ticketsLoading={hooks.ticketLoading}
        selectTicket={hooks.selectTicket} />
    </Flex>
    <MilestoneModal
      open={hooks.addMilestoneModalOpen}
      onOk={async () => {
        await hooks.createMilestone({
          name: hooks.mutateMilestone.name,
          description: hooks.mutateMilestone.description,
          due_date: hooks.mutateMilestone.due_date,
        });
        hooks.fetchMilestones();
        hooks.mutateMilestone.reset();
        hooks.refreshMilestone();
        hooks.setAddMilestoneModalOpen(false)
      }}
      onCancel={() => {
        hooks.mutateMilestone.reset();
        hooks.setAddMilestoneModalOpen(false)
      }}
      milestone={hooks.mutateMilestone} />
    <MilestoneModal
      open={hooks.editMilestoneModalOpen}
      onOk={async () => {
        await hooks.updateMilestone({
          id: hooks.milestoneId,
          name: hooks.mutateMilestone.name,
          description: hooks.mutateMilestone.description,
          due_date: hooks.mutateMilestone.due_date,
        });
        hooks.fetchMilestones();
        hooks.mutateMilestone.reset();
        hooks.refreshMilestone();
        hooks.setEditMilestoneModalOpen(false)
      }}
      onCancel={() => {
        hooks.mutateMilestone.reset();
        hooks.setEditMilestoneModalOpen(false)
      }}
      milestone={hooks.mutateMilestone} />
  </>)
}


const useMilestoneViewHooks = () => {
  const { milestoneId } = useParams();
  const navigate = useNavigate();

  const [addMilestoneModalOpen, setAddMilestoneModalOpen] = useState(false);
  const [editMilestoneModalOpen, setEditMilestoneModalOpen] = useState(false);
  const [mutateMilestoneMode, setMutateMilestoneMode] = useState('create'); // 'create' | 'update'
  const mutateMilestone = useMutateMilestone();

  const selectMilestone = (id) => {
    navigate(`/milestones/${id}`);
  }
  const selectTicket = (id) => {
    navigate(`/tickets/${id}`);
  }
  const {
    data: milestoneData,
    loading: milestoneLoading,
    error: milestoneError,
    fetchOne: fetchMilestone,
  } = useApi.milestone.fetchOne(milestoneId);
  const refreshMilestone = () => {
    if (milestoneId) {
      fetchMilestone(milestoneId);
    }
  }
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    refetch: fetchTickets,
  } = useApi.ticket.fetchMany({ milestone_id: milestoneId });
  useEffect(() => {
    if (milestoneId) {
      fetchMilestone(milestoneId);
      fetchTickets({ milestone_id: milestoneId });
    }
  }, [milestoneId]);
  const {
    data: milestonesData,
    loading: milestonesLoading,
    error: milestonesError,
    fetchData: fetchMilestones,
  } = useApi.milestone.fetchMany();
  const {
    data: createMilestoneData,
    loading: createMilestoneLoading,
    error: createMilestoneError,
    create: createMilestone,
  } = useApi.milestone.create();
  const {
    data: updateMilestoneData,
    loading: updateMilestoneLoading,
    error: updateMilestoneError,
    update: updateMilestone,
  } = useApi.milestone.update();
  return {
    milestoneId,
    selectMilestone,
    selectTicket,
    addMilestoneModalOpen,
    editMilestoneModalOpen,
    setAddMilestoneModalOpen,
    setEditMilestoneModalOpen,
    mutateMilestoneMode,
    setMutateMilestoneMode,
    mutateMilestone,
    milestoneData,
    milestoneLoading,
    milestoneError,
    fetchMilestone,
    refreshMilestone,
    milestonesData,
    milestonesLoading,
    milestonesError,
    fetchMilestones,
    ticketData,
    ticketLoading,
    ticketError,
    fetchTickets,
    createMilestoneData,
    createMilestoneLoading,
    createMilestoneError,
    createMilestone,
    updateMilestoneData,
    updateMilestoneLoading,
    updateMilestoneError,
    updateMilestone,
  };
}


export default MilestoneView;
