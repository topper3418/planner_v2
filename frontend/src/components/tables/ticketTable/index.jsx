import { Button, Card, Table, Flex } from "antd";
import "../../../App.css";
import useTicketTableHooks from "./hooks";
import getColumns from "../../../tableColumns/getTicketTableColumns"


const TicketTable = ({
  tableMode,
  onRow,
  ticketListApi,
  beginAddTicket,
  scrollHeight
}) => {

  const {
    pagination,
    getRowClassName,
  } = useTicketTableHooks(
    tableMode,
    ticketListApi,
  );

  const cols = tableMode === "compact" ?
    ["Title", "Thing", "Category"] :
    ["Title", "Thing", "Category", "Assigned User", "Updated"];

  return (
    <Card
      title={`Tickets (${ticketListApi.count ? ticketListApi.count : 0})`}
      style={{
        width: tableMode === "compact" ? 400 : 1100,
        height: '100%'
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
          dataSource={ticketListApi.data ? ticketListApi.data : []}
          columns={getColumns(cols)}
          pagination={pagination}
          rowClassName={getRowClassName}
          rowHoverable={false}
          scroll={{ y: scrollHeight ? scrollHeight : 400 }}
          loading={ticketListApi.loading}
          error={ticketListApi.error}
          onRow={onRow}
          rowKey="id" />
      </Flex>
    </Card>
  )
}






export default TicketTable;
