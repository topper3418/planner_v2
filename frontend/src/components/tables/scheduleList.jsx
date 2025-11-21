import { Button, Card, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ScheduleList = (
  { scheduleId, schedules, loading, createLoading, createCallback, selectSchedule }
) => {
  return (
    <Card
      title="Schedules"
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
        dataSource={schedules || []}
        renderItem={(schedule) => (
          <List.Item
            style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: scheduleId == schedule.id ? 'lightblue' : 'transparent',
            }}
            onClick={() => selectSchedule(schedule.id)}
          >
            {schedule.name}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default ScheduleList;
