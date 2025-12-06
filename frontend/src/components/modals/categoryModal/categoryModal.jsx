import { ColorPicker, Flex, Input, Modal } from "antd";

const CategoryModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { category, loading, error } = modalControl;
  const submitOnEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }
  console.log("modal control:", modalControl);
  console.log("title in modal:", title);
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
          placeholder="Name"
          value={category?.name || ''}
          onKeyDown={submitOnEnter}
          onChange={(e) => category.set.name(e.target.value)} />
        <ColorPicker
          defaultValue="#ffffff"
          showText={(color) => <span>Select Color ({color.toHexString()})</span>}
        />
        <Input.TextArea
          placeholder="Description"
          value={category?.description || ''}
          onKeyDown={submitOnEnter}
          onChange={(e) => category.set.description(e.target.value)} />
      </Flex>
    </Modal>
  );
}


export default CategoryModal;
