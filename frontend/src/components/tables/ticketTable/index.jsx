import { Button, Card, Table, Flex, Input } from "antd";
import "../../../App.css";
import useTicketTableHooks from "./hooks";
import TicketCategoryDropdown from "../../inputs/ticketCategoryDropdown";
import MilestoneDropdown from "../../inputs/milestoneDropdown";
import UserDropdown from "../../inputs/userDropdown";


const TicketTable = ({
  checkedThingIds,
  selectedThingId,
  tableMode,
  onRow,
  selectedTicketId,
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
    checkedThingIds,
    selectedThingId,
    tableMode,
    selectedTicketId,
  );

  return (
    <Card
      title={`Tickets (${count ? count : 0})`}
      style={{
        marginTop: "10px",
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
          columns={getColumns(tableMode)}
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


const getColumns = (mode = "full") => {

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thing',
      dataIndex: ['thing', 'name'],
      key: 'thing_name',
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category_name',
    },
  ]
  if (mode === "compact") return columns;
  const createdColumn = {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text) => formatDate(text),
  }
  const updatedColumn = {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
    render: (text) => formatDate(text),
  }
  //columns.push(createdColumn);
  //columns.push(updatedColumn);
  const userColumn = {
    title: 'Assigned User',
    dataIndex: ['user', 'username'],
    key: 'user',
  }
  const thingColumn = {
    title: 'Thing',
    dataIndex: ['thing', 'name'],
    key: 'thing_name',
  }
  columns.push(userColumn);
  columns.push(thingColumn);
  return columns;
}



export default TicketTable;
