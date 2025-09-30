import { useEffect } from "react";
import { Table } from "antd";
import issueHook from "./ticketHook"



const IssueTable = ({ selectedThingIds }) => {
  const { data, loading, error, refetch } = issueHook(selectedThingIds);

  useEffect(() => {
    console.log('Selected Thing IDs changed in IssueTable:', selectedThingIds);
    refetch(selectedThingIds)
  }, [selectedThingIds])

  return (
    <Table
      dataSource={data ? data : []}
      columns={columns}
      loading={loading}
      error={error}
      rowKey="id" />
  )
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
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
  }
]

export default IssueTable;
