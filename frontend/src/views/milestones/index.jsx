import { Button, Card, Descriptions, Flex, Input, List, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useApi from "../../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MilestoneView = () => {
  const hooks = useMilestoneViewHooks();
  return (<>
    <Flex style={{ height: '100%' }} gap="10px">
      <Card
        title="Milestones"
        style={{ width: '250px', height: '100%' }}
        extra={<Button
          type="primary"
          icon={<PlusOutlined />}
          loading={hooks.createMilestoneLoading}
          onClick={() => hooks.setNewMilestoneModalOpen(true)}
        />}
      >
        <List
          loading={hooks.milestonesLoading}
          dataSource={hooks.milestonesData || []}
          renderItem={(milestone) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: hooks.milestoneId == milestone.id ? 'lightblue' : 'transparent',
              }}
              onClick={() => hooks.selectMilestone(milestone.id)}
            >
              {milestone.name}
            </List.Item>
          )}
        />
      </Card>
      <Card
        title="Milestone Details"
        style={{ width: "300px", height: '100%' }}>
        <Descriptions
          size="small"
          column={1}>
          <Descriptions.Item label="Name">
            {hooks.milestoneData?.name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {hooks.milestoneData?.description || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Due Date">
            {hooks.milestoneData?.due_date || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Tickets"
        style={{ width: "300px", height: '100%' }}>
        <List
          loading={hooks.ticketLoading}
          dataSource={hooks.ticketData || []}
          renderItem={(ticket) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '10px',
              }}
              onClick={() => hooks.selectTicket(ticket.id)}
            >
              {ticket.title}
            </List.Item>
          )} />
      </Card>
    </Flex>
    <Modal
      title="New Milestone"
      open={hooks.newMilestoneModalOpen}
      onOk={async () => {
        await hooks.createMilestone({
          name: hooks.newMilestone.name,
          description: hooks.newMilestone.description,
          due_date: hooks.newMilestone.due_date,
        });
        hooks.fetchMilestones();
        hooks.newMilestone.reset();
      }}
      onCancel={() => hooks.setNewMilestoneModalOpen(false)}>
      <Flex gap="10px" vertical>
        <Input
          placeholder="Milestone Name"
          value={hooks.newMilestone.name}
          onChange={(e) => hooks.newMilestone.set.name(e.target.value)} />
        <Input.TextArea
          placeholder="Milestone Description"
          value={hooks.newMilestone.description}
          onChange={(e) => hooks.newMilestone.set.description(e.target.value)} />
        <Input
          type="date"
          placeholder="Milestone Due Date"
          value={hooks.newMilestone.due_date}
          onChange={(e) => hooks.newMilestone.set.due_date(e.target.value)} />
      </Flex>
    </Modal>
  </>)
}


const useMilestoneViewHooks = () => {
  const { milestoneId } = useParams();
  const navigate = useNavigate();
  const [newMilestoneModalOpen, setNewMilestoneModalOpen] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState(null);
  const milestoneModalReset = () => {
    setNewMilestoneName("");
    setNewMilestoneDescription("");
    setNewMilestoneDueDate(null);
    setNewMilestoneModalOpen(false);
  }
  const newMilestone = {
    name: newMilestoneName,
    description: newMilestoneDescription,
    due_date: newMilestoneDueDate,
    set: {
      name: setNewMilestoneName,
      description: setNewMilestoneDescription,
      due_date: setNewMilestoneDueDate,
    },
    reset: milestoneModalReset,
  }
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
    newMilestoneModalOpen,
    setNewMilestoneModalOpen,
    newMilestone,
    milestoneData,
    milestoneLoading,
    milestoneError,
    fetchMilestone,
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
