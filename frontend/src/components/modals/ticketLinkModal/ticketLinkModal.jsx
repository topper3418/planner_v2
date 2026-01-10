import { DatePicker, Descriptions, Input, Modal } from "antd";
import dayjs from "dayjs";
import TicketLinkTypeDropdown from "../../inputs/ticketLinkTypeDropdown";

const TicketLinkModal = ({ modalControl }) => {
  const { title, isOpen, close, submit } = modalControl[modalControl.mode];
  const { ticketLink, error, loading } = modalControl;
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
        <Descriptions.Item label="Label" >
          <Input
            placeholder="Link Label"
            value={ticketLink?.label}
            onChange={(e) => ticketLink?.set?.label(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Link" >
          <Input
            placeholder="Link URL"
            value={ticketLink.link}
            onChange={(e) => ticketLink?.set?.link(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Type" >
          <TicketLinkTypeDropdown
            selectedTypeId={ticketLink.linkTypeId}
            setSelectedTypeId={ticketLink?.set?.linkTypeId}
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}


export default TicketLinkModal;
