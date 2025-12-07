import { Card, Table, Flex } from "antd";
import useApi from "../../api";
import getColumns from "../../tableColumns/getTicketTableColumns";
import { useNavigate } from "react-router-dom";


const OpenScheduledTicketTable = () => {
  const queryParams = {
    scheduled: true,
    open: true,
    include: ['thing', 'user', 'category'],
    page_size: 10000,
  }
  const { data, count, loading, error, fetchData } = useApi.ticket.fetchMany(
    queryParams,
  );
  const navigate = useNavigate();

  // on row click, navigate to ticket detail page
  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`/tickets/${record.id}`);
      },
      style: { cursor: 'pointer' },
    };
  };

  return (
    <Card
      title={`Open Scheduled Tickets (${count ? count : 0})`}
      style={{
        width: 450,
      }}>
      <Flex vertical flex={1} >
        <Table
          dataSource={data ? data : []}
          columns={getColumns(["Title", "Thing", "Category", "Assigned User"])}
          rowClassName={(record, index) =>
            record.overdue ? "overdue-ticket" : ""
          }
          onRow={onRow}
          rowHoverable={false}
          scroll={{ y: 400 }}
          pagination={false}
          loading={loading}
          error={error}
          rowKey="id" />
      </Flex>
    </Card>
  )
}


export default OpenScheduledTicketTable;
