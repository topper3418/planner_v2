import { useEffect } from "react";
import { Table } from "antd";
import useApi from "../../api";



const ChilrenTable = ({ selectedThingId, setSelectedThingId }) => {
  const {
    data,
    loading,
    error,
    refetch
  } = useApi.thing.fetchMany({
    parent_id: selectedThingId,
    include: ['category']
  });

  useEffect(() => {
    refetch({
      parent_id: selectedThingId,
      include: ['category']
    });
  }, [selectedThingId]);

  const onRow = (record) => {
    return {
      onClick: () => {
        setSelectedThingId(record.id);
      },
    };
  }

  return (
    <Table
      title={() => "Children"}
      dataSource={data ? data : []}
      scroll={{ y: 110 }}
      columns={columns}
      loading={loading}
      error={error}
      onRow={onRow}
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
