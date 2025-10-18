import { useEffect } from "react";
import { Button, Card, Table } from "antd";
import useApi from "../../api/";


const TicketTable = ({
  checkedThingIds,
  selectedThingId,
  tableMode,
  onRow,
  selectedTicketId,
  beginAddTicket,
  scrollHeight
}) => {

  const { data, loading, error, doRefetch } = useTicketTableHooks(checkedThingIds, selectedThingId, tableMode);

  return (
    <Card
      title={`Tickets (${data ? data.length : 0})`}
      style={{
        marginTop: "10px",
        width: tableMode === "compact" ? 500 : 800
      }}
      extra={beginAddTicket && <Button
        type="primary"
        onClick={beginAddTicket}>
        Add Ticket

      </Button>}>
      <Table
        dataSource={data ? data : []}
        columns={getColumns(tableMode)}
        scroll={{ y: scrollHeight ? scrollHeight : 600 }}
        rowClassName={(record) => {
          return record.id === Number(selectedTicketId) ? 'ant-table-row-selected' : ''
        }}
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

const useTicketTableHooks = (checkedThingIds, selectedThingId, tableMode) => {
  // initialize query params for consistency throughout component
  const queryParams = {
    thing_ids: selectedThingId ? [selectedThingId] : checkedThingIds ? checkedThingIds : [],
    include: ["thing", "category"]
  }
  console.log("fetching with queryParams:", queryParams);
  // initialize state
  const { data, loading, error, refetch } = useApi.ticket.fetchMany(queryParams, { lazy: true });

  // set default table mode
  if (!tableMode) tableMode = "full"; // other option is "compact"

  //helper function
  const doRefetch = () => {
    refetch(queryParams);
  }

  // on mount and when checkedThingIds or selectedThingId changes, refetch data
  useEffect(() => {
    doRefetch();
  }, [checkedThingIds, selectedThingId])
  return { data, loading, error, doRefetch };
}

export default TicketTable;
