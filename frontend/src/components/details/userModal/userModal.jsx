import { Flex, Input, Modal } from "antd";

const UserModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { user, loading, error } = modalControl;
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={submit}
      loading={loading}
      error={error}
      onCancel={close}>
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
