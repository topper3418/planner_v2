import { Button, Card, Flex, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UserList = (
  { userId, users, loading, createLoading, createCallback, selectUser, editCallback }
) => {
  return (
    <Card
      title="Users"
      style={{ width: '250px', height: '100%' }}
      extra={<Flex gap="10px">
        {userId &&
          <Button
            type="default"
            onClick={editCallback}>
            Edit
          </Button>}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          loading={createLoading}
          onClick={createCallback}
        />
      </Flex>}
    >
      <List
        loading={loading}
        dataSource={users || []}
        renderItem={(user) => (
          <List.Item
            style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: userId == user.id ? 'lightblue' : 'transparent',
            }}
            onClick={() => selectUser(user.id)}
          >
            {user.username}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default UserList;
