import { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../api/";


const TicketTable = ({ checkedThingIds, selectedThingId }) => {
  const queryParams = {
    thing_ids: selectedThingId || checkedThingIds,
    include: ["thing", "category"]
  }
  const { data, loading, error, refetch } = api.useFetchTickets(queryParams);

  const doRefetch = () => {
    refetch(queryParams);
  }


  console.log("Ticket data: ", data);

  const [tableMode, setTableMode] = useState("full");

  useEffect(() => {
    if (!selectedThingId) {
      setTableMode("full");
    }
    doRefetch();
  }, [checkedThingIds, selectedThingId])

  return (
    <Table
      title={() => `Tickets (${data ? data.length : 0})`}
      style={{ marginTop: "10px" }}
      dataSource={data ? data : []}
      columns={getColumns(tableMode)}
      loading={loading}
      error={error}
      rowKey="id" />
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
