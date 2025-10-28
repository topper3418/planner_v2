import { Button, Card, Checkbox, Descriptions, Flex, Input } from "antd"
import TicketCategoryDropdown from "../../inputs/ticketCategoryDropdown";
import TicketDropdown from "../../inputs/ticketDropdown";
import detailsHooks from "./hooks";


const TicketDetails = ({
  ticket,
  thing,
  loading,
  error,
  refreshTicket,
  addMode = false,
  setAddMode = () => { },
  thingId
}) => {
  console.log("addmode in ticket details:", addMode);
  const {
    mode,
    setMode,
    changeHandler,
    getValue,
    submit
  } = detailsHooks(ticket, refreshTicket, addMode, setAddMode);


  return (
    <Card
      title="Ticket"
      extra={
        <ModeButton
          mode={mode}
          setMode={setMode}
          setAddMode={setAddMode} />
      }
      style={{
        marginTop: '10px',
        padding: '10px',
        width: '350px',
        marginBottom: '10px',
      }}
    >
      <Flex vertical gap="10px">
        <Descriptions
          column={1}
          error={error}
          size="small">
          <Descriptions.Item label="Title">
            {mode === "view" ?
              ticket?.title :
              <Input
                value={getValue("title")}
                onChange={changeHandler("title")} />}
          </Descriptions.Item>
          {mode !== "add" && <Descriptions.Item label="Open">
            {mode === "view" ?
              (ticket?.open ? 'Yes' : 'No') :
              <Checkbox
                checked={getValue("open")}
                onChange={changeHandler("open")} />}
          </Descriptions.Item>}
          <Descriptions.Item label="category">
            {mode === "view" ?
              (ticket?.category ? ticket.category.name : 'Uncategorized') :
              <TicketCategoryDropdown
                selectedTicketCategoryId={getValue("category_id")}
                setSelectedTicketCategoryId={(value) => {
                  const e = { target: { value } };
                  changeHandler("category_id")(e);
                }} />}
          </Descriptions.Item>
          {false && <Descriptions.Item label="Thing">
            {mode === "view" ?
              (ticket?.thing ? ticket.thing.name : (thing ? thing.name : 'No thing')) :
              <TicketDropdown
                selectedTicketId={getValue("thing_id")}
                setSelectedTicketId={(value) => {
                  const e = { target: { value } };
                  changeHandler("thing_id")(e);
                }} />}
          </Descriptions.Item>}
          {false && <Descriptions.Item label="Parent">
            {mode === "view" ?
              (ticket?.parent ? ticket.parent.name : 'No parent') :
              <TicketDropdown
                selectedTicketId={getValue("parent_id")}
                setSelectedTicketId={(value) => {
                  const e = { target: { value } };
                  changeHandler("parent_id")(e);
                }} />}
          </Descriptions.Item>}
          <Descriptions.Item label="Description">
            {mode === "view" ?
              (ticket?.description ? ticket.description : 'No description') :
              <Input.TextArea
                value={getValue("description")}
                onChange={changeHandler("description")}
                autoSize={{ minRows: 3, maxRows: 5 }} />}
          </Descriptions.Item>
        </Descriptions>
        <Flex justify="end">
          {mode !== "view" &&
            <Button
              type="primary"
              onClick={submit}>
              Save
            </Button>}
        </Flex>
      </Flex>
    </Card >
  )
}

const ModeButton = ({ mode, setMode, setAddMode }) => {
  const onClick = () => {
    if (mode === "view") {
      setMode("edit");
    } else {
      setAddMode(false);
      setMode("view");
    }
  }
  return (
    <Button type="primary" onClick={onClick}>
      {mode === "view" ? "Edit" : "Cancel"}
    </Button>
  )
}



export default TicketDetails;
