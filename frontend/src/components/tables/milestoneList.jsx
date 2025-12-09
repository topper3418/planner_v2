import { Button, Card, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const MilestoneList = (
  { milestoneId, milestones, loading, createLoading, createCallback, selectMilestone }
) => {
  return (
    <Card
      title="Milestones"
      style={{ width: '250px', height: '100%' }}
      extra={<Button
        type="primary"
        icon={<PlusOutlined />}
        loading={createLoading}
        onClick={createCallback}
      />}
    >
      <List
        loading={loading}
        dataSource={milestones || []}
        renderItem={(milestone) => (
          <List.Item
            style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: milestoneId == milestone.id ? '#0958d9' : 'transparent',
            }}
            onClick={() => selectMilestone(milestone.id)}
          >
            {milestone.name}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default MilestoneList;
