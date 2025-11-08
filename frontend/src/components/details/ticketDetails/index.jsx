import { Button, Card, Checkbox, Descriptions, Flex, Input, Typography } from "antd"
import TicketCategoryDropdown from "../../inputs/ticketCategoryDropdown";
import TicketDropdown from "../../inputs/ticketDropdown";
import detailsHooks from "./hooks";
import ThingDropdown from "../../inputs/thingDropdown";
import UserDropdown from "../../inputs/userDropdown";


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
        width: '250px',
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
                selectedCategoryId={getValue("category_id")}
                setSelectedCategoryId={(value) => {
                  const e = { target: { value } };
                  changeHandler("category_id")(e);
                }} />}
          </Descriptions.Item>
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
          {mode === "view" ?
            <Typography.Paragraph style={{ border: '1px solid #f0f0f0', padding: '10px', borderRadius: '5px' }}>
              {ticket?.description ? ticket.description : 'No description'}
            </Typography.Paragraph> :
            <Descriptions.Item label="Description">
              <Input.TextArea
                value={getValue("description")}
                onChange={changeHandler("description")}
                autoSize={{ minRows: 3, maxRows: 5 }} />
            </Descriptions.Item>}
          {!thing &&
            <Descriptions.Item label="Thing">
              {mode === "view" ?
                (ticket?.thing ? ticket.thing.name : (thing ? thing.name : 'No thing')) :
                <ThingDropdown
                  selectedThingId={getValue("thing_id")}
                  setSelectedThingId={(value) => {
                    const e = { target: { value } };
                    changeHandler("thing_id")(e);
                  }}
                  filters={{ page_size: 10000 }}
                />}
            </Descriptions.Item>}
          <Descriptions.Item label="User">
            {mode === "view" ?
              (ticket?.user?.username ? ticket.user.username : 'No user') :
              <UserDropdown
                selectedUserId={getValue("user_id")}
                setSelectedUserId={(value) => {
                  const e = { target: { value } };
                  changeHandler("user_id")(e);
                }}
                filters={{ page_size: 10000 }}
              />}
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
