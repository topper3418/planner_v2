import { Descriptions, Input, Modal } from "antd";

const MilestoneModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { milestone, error, loading } = modalControl;
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
            value={milestone?.name}
            onChange={(e) => milestone?.set?.name(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Description" >
          <Input.TextArea
            placeholder="Milestone Description"
            value={milestone.description}
            onChange={(e) => milestone?.set?.description(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Due Date" >
          <Input
            type="date"
            placeholder="Milestone Due Date"
            value={milestone.due_date}
            onChange={(e) => milestone?.set?.due_date(e.target.value)} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}


export default MilestoneModal;
