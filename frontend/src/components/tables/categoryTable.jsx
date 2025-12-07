import { Button, Card, Table, Flex, Modal } from "antd";
import { useState } from "react";


const CategoryTable = ({
  api,
  categoryName,
  modalControl,
  scrollHeight
}) => {
  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState(false);

  const categoryApi = api[categoryName];

  const count = categoryApi.list.data ? categoryApi.list.data.length : 0;
  const { data, loading, error } = categoryApi.list;

  const onRow = (record) => {
    return {
      onDoubleClick: () => {
        console.log("Editing record:", record);
        if (record.is_default) {
          setIsDefaultModalOpen(true);
        } else {
          modalControl.edit.open(record);

        }
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

  const categoryTitle = {
    actionType: "Action Type",
    ticketCategory: "Ticket Category",
    thingCategory: "Thing Category",
  }[categoryName]

  return (<>
    <Card
      title={`${categoryTitle} (${count ? count : 0})`}
      extra={
        <Flex gap="10px">
          <Button
            type="primary"
            onClick={modalControl.add.open}>
            {`Add ${categoryTitle}`}
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
    <Modal
      type="warning"
      title="Cannot Edit Default Category"
      open={isDefaultModalOpen}
      footer={null}
      onCancel={() => setIsDefaultModalOpen(false)} />
  </>)
}


export default CategoryTable;
