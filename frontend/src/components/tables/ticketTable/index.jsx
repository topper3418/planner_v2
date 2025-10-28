import { Button, Card, Table, Flex, Input } from "antd";
import "../../../App.css";
import useTicketTableHooks from "./hooks";
import TicketCategoryDropdown from "../../inputs/ticketCategoryDropdown";


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
    search,
    onSearchChange,
    selectedTicketCategoryId,
    setSelectedTicketCategoryId,
    pagination,
    showClosedToggleText,
    handleShowClosedToggle,
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
        width: tableMode === "compact" ? 500 : 800
      }}
      extra={beginAddTicket && <Flex gap="10px">
        {!selectedTicketId && <>
          <Input
            placeholder="Search Tickets"
            value={search}
            onChange={onSearchChange} />
          <TicketCategoryDropdown
            selectedCategoryId={selectedTicketCategoryId}
            setSelectedCategoryId={setSelectedTicketCategoryId} />
        </>}
        <Button
          onClick={handleShowClosedToggle}>
          {showClosedToggleText}
        </Button>
        <Button
          type="primary"
          onClick={beginAddTicket}>
          Add Ticket
        </Button>
      </Flex>}>
      <Table
        dataSource={data ? data : []}
        columns={getColumns(tableMode)}
        scroll={{ y: scrollHeight ? scrollHeight : 600 }}
        rowClassName={getRowClassName}
        pagination={pagination}
        loading={loading}
        error={error}
        onRow={onRow}
        rowKey="id" />
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
  columns.push(createdColumn);
  columns.push(updatedColumn);
  return columns;
}



export default TicketTable;
