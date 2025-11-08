import { Flex, Input, Modal } from "antd";

const UserModal = ({ open, onOk, onCancel, user }) => {
  return (
    <Modal
      title="New User"
      open={open}
      onOk={onOk}
      onCancel={onCancel}>
      <Flex gap="10px" vertical>
        <Input
          placeholder="User Name"
          value={user?.username}
          onChange={(e) => user?.set?.username(e.target.value)} />
      </Flex>
    </Modal>
  );
}


export default UserModal;
