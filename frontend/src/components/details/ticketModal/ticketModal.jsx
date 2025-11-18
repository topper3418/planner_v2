import { Checkbox, Flex, Input, Modal, Descriptions } from "antd"
import TicketCategoryDropdown from "../../inputs/ticketCategoryDropdown";
import ThingDropdown from "../../inputs/thingDropdown";
import UserDropdown from "../../inputs/userDropdown";


const TicketModal = ({ modalControl }) => {
  const { isOpen, close, submit } = modalControl[modalControl.mode];
  const { ticket, error } = modalControl;
  const submitOnEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }
  return (
    <Modal
      title={modalControl.mode === "add" ? "Add Ticket" : "Edit Ticket"}
      error={error}
      open={isOpen}
      onOk={submit}
      onCancel={close}>
      <Descriptions
        column={1}
        error={error}
        bordered
        size="small">
        <Descriptions.Item label="Title" >
          <Input
            placeholder="Title"
            value={ticket.title}
            onKeyDown={submitOnEnter}
            onChange={(e) => ticket.set.title(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Open" >
          <Checkbox
            disabled
            checked={ticket.open}
            onChange={(e) => ticket.set.open(e.target.checked)} />
        </Descriptions.Item>
        <Descriptions.Item label="Category" >
          <TicketCategoryDropdown
            selectedCategoryId={ticket.categoryId}
            setSelectedCategoryId={(value) => ticket.set.categoryId(value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Description" >
          <Input.TextArea
            value={ticket.description}
            onKeyDown={submitOnEnter}
            onChange={(e) => ticket.set.description(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }} />
        </Descriptions.Item>
        <Descriptions.Item label="Thing" >
          <ThingDropdown
            selectedThingId={ticket.thingId}
            setSelectedThingId={(value) => ticket.set.thingId(value)} />
        </Descriptions.Item>
        <Descriptions.Item label="User" >
          <UserDropdown
            selectedUserId={ticket.userId}
            setSelectedUserId={(value) => ticket.set.userId(value)} />
        </Descriptions.Item>
      </Descriptions>
    </Modal >
  )
}

export default TicketModal;
