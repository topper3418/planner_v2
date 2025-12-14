import { Button, Card, Flex, List, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const ScheduleList = (
  { scheduleId, scheduleApi, loading, createLoading, createCallback, selectSchedule }
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const onPageChange = (page) => {
    setCurrentPage(page);
  }
  useEffect(() => {
    scheduleApi.schedule.list.fetchData({
      pageNumber: currentPage,
      pageSize: pageSize,
    });
  }, [currentPage]);
  return (
    <Card
      title="Schedules"
      style={{
        width: '300px',
        height: '100%'
      }}
      extra={<Button
        type="primary"
        icon={<PlusOutlined />}
        loading={createLoading}
        onClick={createCallback}
      />}
    >
      <Flex vertical style={{
        overflowY: 'auto',
        height: '100%',
      }}>
        <List
          style={{ height: "100%" }}
          loading={loading}
          dataSource={scheduleApi.schedule.list.data || []}
          renderItem={(schedule) => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: scheduleId == schedule.id ? '#0958d9' : 'transparent',
              }}
              onClick={() => selectSchedule(schedule.id)}
            >
              {schedule.name}
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={scheduleApi.schedule.list.count || 0}
          onChange={onPageChange} />
      </Flex>
    </Card>
  )
}

export default ScheduleList;
