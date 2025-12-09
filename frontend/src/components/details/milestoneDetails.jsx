import { Button, Card, Descriptions } from "antd";

const MilestoneDetails = ({ milestone, editCallback, style = { width: "300px", height: '100%' } }) => {
  return (
    <Card
      title="Milestone Details"
      extra={
        <Button type="primary" onClick={editCallback}>
          Edit
        </Button>
      }
      style={style}>
      <Descriptions
        size="small"
        column={1}>
        <Descriptions.Item label="Name">
          {milestone?.name || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {milestone?.description || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {milestone?.start_date?.split("T")[0] || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Due Date">
          {milestone?.due_date?.split("T")[0] || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default MilestoneDetails;
