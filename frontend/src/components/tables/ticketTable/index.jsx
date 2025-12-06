import { Button, Card, Table, Flex } from "antd";
import "../../../App.css";
import useTicketTableHooks from "./hooks";
import getColumns from "../../../tableColumns/getTicketTableColumns"


const TicketTable = ({
  tableMode,
  onRow,
  refreshTrigger,
  beginAddTicket,
  scrollHeight
}) => {

  const {
    data,
    count,
    loading,
    error,
    pagination,
    getRowClassName,
  } = useTicketTableHooks(
    tableMode,
    refreshTrigger
  );

  const cols = tableMode === "compact" ?
    ["Title", "Thing", "Category"] :
    ["Title", "Thing", "Category", "Assigned User", "Updated"];

  return (
    <Card
      title={`Tickets (${count ? count : 0})`}
      style={{
        width: tableMode === "compact" ? 450 : 1100,
      }}
      extra={
        <Flex gap="10px">
          <Button
            type="primary"
            onClick={beginAddTicket}>
            Add Ticket
          </Button>
        </Flex>
      }>
      <Flex vertical flex={1} >
        <Table
          dataSource={data ? data : []}
          columns={getColumns(cols)}
          pagination={pagination}
          rowClassName={getRowClassName}
          rowHoverable={false}
          scroll={{ y: scrollHeight ? scrollHeight : 400 }}
          loading={loading}
          error={error}
          onRow={onRow}
          rowKey="id" />
      </Flex>
    </Card>
  )
}






export default TicketTable;
