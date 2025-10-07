import { Table } from "antd";
import issueHook from "./ticketHook"
import useFetchThings from "./useFetchThings";



const ChilrenTable = ({ selectedThingId }) => {
  const { data, loading, error, refetch } = useFetchThings({ parent_id: selectedThingId, include: ['category'] });

  return (
    <Table
      title={() => "Children"}
      dataSource={data ? data : []}
      columns={columns}
      loading={loading}
      error={error}
      rowKey="id" />
  )
}


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'title',
  },
  {
    title: 'Category',
    dataIndex: ['category', 'name'],
    key: 'category_name',
  },
]

export default ChilrenTable;
