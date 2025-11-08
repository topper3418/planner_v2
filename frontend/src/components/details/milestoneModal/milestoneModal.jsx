import { Flex, Input, Modal } from "antd";

const MilestoneModal = ({ open, onOk, onCancel, milestone, title = "New Milestone" }) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}>
      <Flex gap="10px" vertical>
        <Input
          placeholder="Milestone Name"
          value={milestone?.name}
          onChange={(e) => milestone?.set?.name(e.target.value)} />
        <Input.TextArea
          placeholder="Milestone Description"
          value={milestone.description}
          onChange={(e) => milestone?.set?.description(e.target.value)} />
        <Input
          type="date"
          placeholder="Milestone Due Date"
          value={milestone.due_date}
          onChange={(e) => milestone?.set?.due_date(e.target.value)} />
      </Flex>
    </Modal>
  );
}


export default MilestoneModal;
