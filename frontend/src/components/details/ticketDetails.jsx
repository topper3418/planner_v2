import { Button, Card, Checkbox, Descriptions, Flex, Input } from "antd"
import { useEffect, useState } from "react";
import api from "../../api/";
import TicketCategoryDropdown from "../inputs/ticketCategoryDropdown";
import TicketDropdown from "../inputs/ticketDropdown";


const TicketDetails = ({
  ticket,
  loading,
  error,
  refreshTicket,
  addMode = false,
}) => {
  const {
    mode,
    setMode,
    changeHandler,
    getValue,
    resetChanges,
    updateData,
    updateLoading,
    updateError,
    updateThing,
    createData,
    createLoading,
    createError,
    createTicket
  } = detailsHooks(ticket, refreshTicket, addMode);


  return (
    <Card
      title="Ticket"
      extra={
        <ModeButton
          mode={mode}
          setMode={setMode} />
      }
      style={{
        marginTop: '10px',
        padding: '10px',
        width: '350px',
        marginBottom: '10px',
      }}
    >
      <Flex vertical>
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
          {mode === "edit" &&
            <Button
              type="primary"
              onClick={() => {
                const updatedThing = {
                  id: ticket.id,
                  name: getValue("name"),
                  docs_link: getValue("docs_link"),
                  category: getValue("category"),
                  parent: getValue("parent"),
                  description: getValue("description"),
                };
                console.log("Updating thing with data:", updatedThing);
                updateThing(updatedThing);
              }}>
              Save
            </Button>}
        </Flex>
      </Flex>
    </Card >
  )
}

const ModeButton = ({ mode, setMode }) => {
  const onClick = () => {
    if (mode === "view") {
      setMode("edit");
    } else {
      setMode("view");
    }
  }
  console.log("mode in ModeButton:", mode);
  return (
    <Button type="primary" onClick={onClick}>
      {mode === "view" ? "Edit" : "Cancel"}
    </Button>
  )
}

const detailsHooks = (ticket = {}, refreshTicket = () => { }, addMode = false) => {
  const [mode, setMode] = useState(addMode ? "add" : "view"); // "view" or "edit"
  const [unsavedChanges, setUnsavedChanges] = useState({});

  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
    updateThing
  } = api.useUpdateTicket();

  const {
    data: createData,
    loading: createLoading,
    error: createError,
    createTicket
  } = api.useCreateTicket();

  // when going to view mode, reset unsaved changes
  useEffect(() => {
    if (mode === "view") {
      // Reset unsaved changes when switching back to view mode
      resetChanges();
    }
  }, [mode])

  console.log("addMode in detailsHooks:", addMode);

  useEffect(() => {
    console.log("effect triggering")
    setMode(addMode ? "add" : "view");
  }, [addMode])

  // when updateData is available, refresh the ticket details
  useEffect(() => {
    if (updateData) {
      console.log("Ticket updated:", updateData);
      refreshTicket();
      setMode("view");
    }
  }, [updateLoading])

  const isChanged = (field) => {
    return unsavedChanges[field] !== undefined;
  }

  const changeHandler = (field) => {
    if (field === "open") {
      return (e) => {
        const newValue = e.target.checked;
        setUnsavedChanges({
          ...unsavedChanges,
          [field]: newValue,
        });
      }
    }
    return (e) => {
      const newValue = e.target.value;
      setUnsavedChanges({
        ...unsavedChanges,
        [field]: newValue,
      });
    }
  }

  const getValue = (field) => {
    return isChanged(field) ? unsavedChanges[field] : ticket ? ticket[field] : '';
  }

  const resetChanges = () => {
    setUnsavedChanges({});
  }
  return {
    mode,
    setMode,
    changeHandler,
    getValue,
    resetChanges,
    updateData,
    updateLoading,
    updateError,
    updateThing,
    createData,
    createLoading,
    createError,
    createTicket
  };
}

export default TicketDetails;
