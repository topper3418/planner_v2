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
          showText={(color) => <span>Select Color ({color.toHexString()})</span>}
          value={category?.color}
          onChange={(color) => category.set.color(color.toHexString())}
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
