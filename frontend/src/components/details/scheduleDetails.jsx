import { Button, Card, Descriptions, Typography } from "antd";

const ScheduleDetails = ({ schedule, editCallback, weekdaysOptions, style = { width: "300px", height: '100%' } }) => {
  return (
    <Card
      title="Schedule Details"
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
          {schedule?.name || 'N/A'}
        </Descriptions.Item>
        {schedule?.weekdays ?
          <Descriptions.Item label="Weekdays">
            {schedule?.weekdays?.split(",")?.map(dayIndex => weekdaysOptions[dayIndex])?.join(', ')}
          </Descriptions.Item> :
          schedule?.monthdays ?
            <Descriptions.Item label="Monthdays">
              {schedule?.monthdays}
            </Descriptions.Item> :
            schedule?.yeardays ?
              <Descriptions.Item label="Yeardays">
                {schedule?.yeardays}
              </Descriptions.Item> :
              <Descriptions.Item label="Recurrence Pattern">
                <Typography.Text>N/A</Typography.Text>
              </Descriptions.Item>
        }
      </Descriptions>
    </Card>
  )
}

export default ScheduleDetails;
