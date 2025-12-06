import { Button, Card, Table, Flex } from "antd";


const CategoryTable = ({
  api,
  categoryName,
  modalControl,
  scrollHeight
}) => {

  const categoryApi = api[categoryName];

  const count = categoryApi.list.data ? categoryApi.list.data.length : 0;
  const { data, loading, error } = categoryApi.list;

  const onRow = (record) => {
    return {
      onDoubleClick: () => {
        console.log("Editing record:", record);
        modalControl.edit.open(record);
      },
    };
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: color,
            border: '1px solid #000',
            borderRadius: '4px',
          }} />
      ),
    }
  ]

  return (
    <Card
      title={`${categoryName} (${count ? count : 0})`}
      extra={
        <Flex gap="10px">
          <Button
            type="primary"
            onClick={modalControl.add.open}>
            {`Add ${categoryName}`}
          </Button>
        </Flex>
      }>
      <Flex vertical flex={1} >
        <Table
          dataSource={data ? data : []}
          columns={columns}
          scroll={{ y: scrollHeight ? scrollHeight : 400 }}
          loading={loading}
          error={error}
          onRow={onRow}
          rowKey="id" />
      </Flex>
    </Card>
  )
}


export default CategoryTable;
