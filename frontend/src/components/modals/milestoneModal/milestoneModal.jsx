import { DatePicker, Descriptions, Input, Modal } from "antd";
import dayjs from "dayjs";

const MilestoneModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { milestone, error, loading } = modalControl;
  const submitOnEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }
  console.log("milestone modal render", milestone);
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
        <Descriptions.Item label="Start Date" >
          <DatePicker
            value={milestone.startDate ? dayjs(milestone.startDate) : null}
            onChange={(date) => milestone.set.startDate(date ? date.format('YYYY-MM-DDTHH:mm:ss') : null)} />
        </Descriptions.Item>
        <Descriptions.Item label="Due Date" >
          <DatePicker
            value={milestone.dueDate ? dayjs(milestone.dueDate) : null}
            onChange={(date) => milestone.set.dueDate(date ? date.format('YYYY-MM-DDTHH:mm:ss') : null)} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}


export default MilestoneModal;
