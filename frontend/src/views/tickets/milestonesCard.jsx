import { Card, Flex, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import components from "../../components";

const {
  inputs: { MilestoneDropdown }
} = components;


const MilestonesCard = ({ ticketId, api }) => {
  return (
    <Card
      title="Milestones"
      style={{ width: '300px', height: '40%' }}
      extra={<MilestoneDropdown
        setSelectedMilestoneId={(milestoneId) => api.ticket.addMilestone.addMilestone(ticketId, milestoneId)}
        placeholder="Add" />}
    >
      <List
        loading={api.milestone.list.loading}
        dataSource={api.milestone.list.data || []}
        renderItem={(milestone) => (
          <List.Item
            style={{
              padding: '10px',
            }}
          >
            <Flex justify="space-between" style={{ width: '100%' }}>
              {milestone.name}
              <Button
                icon={<DeleteOutlined />}
                onClick={() =>
                  api.ticket.removeMilestone.removeMilestone(ticketId, milestone.id)}
              />
            </Flex>
          </List.Item>
        )}
      />
    </Card>

  )
}

export default MilestonesCard;
