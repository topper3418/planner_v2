import { Descriptions, Flex, Input, Modal } from "antd"
import ThingDropdown from "../../inputs/thingDropdown";
import ThingCategoryDropdown from "../../inputs/thingCategoryDropdown";


const ThingModal = ({
  modalControl
}) => {
  const { isOpen, close, submit } = modalControl[modalControl.mode];
  const { thing, error, loading } = modalControl;
  return (
    <Modal
      title={modalControl.mode === "add" ? "Add Thing" : "Edit Thing"}
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
            value={thing?.name}
            onChange={(e) => thing?.set?.name(e.target.value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Category" >
          <ThingCategoryDropdown
            selectedThingCategoryId={thing?.categoryId}
            setSelectedThingCategoryId={(value) => thing?.set?.categoryId(value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Parent Thing" >
          <ThingDropdown
            selectedThingId={thing?.parentId}
            setSelectedThingId={(value) => thing?.set?.parentId(value)} />
        </Descriptions.Item>
        <Descriptions.Item label="Description" >
          <Input.TextArea
            value={thing?.description}
            onChange={(e) => thing?.set?.description(e.target.value)}
            autoSize={{ minRows: 3, maxRows: 5 }} />
        </Descriptions.Item>
      </Descriptions>
    </Modal >
  )
}

export default ThingModal;
