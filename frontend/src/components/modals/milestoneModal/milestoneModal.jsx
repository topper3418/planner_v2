import { Descriptions, Input, Modal } from "antd";

const MilestoneModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { milestone, error, loading } = modalControl;
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
      error={error}
      loading={loading}
      onCancel={close}>
      <Descriptions
        column={1}
        error={error}
        bordered
        size="small">
        <Descriptions.Item label="Name" >
          <Input
            placeholder="Milestone Name"
            onKeyDown={submitOnEnter}
            value={milestone?.name}
            onChange={(e) => milestone?.set?.name(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Description" >
          <Input.TextArea
            placeholder="Milestone Description"
            onKeyDown={submitOnEnter}
            value={milestone.description}
            onChange={(e) => milestone?.set?.description(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Due Date" >
          <Input
            type="date"
            placeholder="Milestone Due Date"
            onKeyDown={submitOnEnter}
            value={milestone.due_date}
            onChange={(e) => milestone?.set?.due_date(e.target.value)} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}


export default MilestoneModal;
