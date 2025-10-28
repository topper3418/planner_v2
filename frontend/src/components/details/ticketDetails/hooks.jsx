import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../../../api";

const detailsHooks = (ticket = {}, refreshTicket = () => { }, addMode = false, setAddMode = () => { }) => {
  const defaultMode = addMode ? "add" : "view";
  const [mode, setMode] = useState(defaultMode); // "view" or "edit"
  const { thingId, ticketId } = useParams();
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const navigate = useNavigate();

  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
    updateTicket
  } = useApi.ticket.update();

  const {
    data: createData,
    loading: createLoading,
    error: createError,
    createTicket
  } = useApi.ticket.create();

  // if there is an error during update, log it and sent a message to the user. 
  useEffect(() => {
    if (updateError) {
      console.error("Error updating ticket:", updateError);
      message.error(`Error updating ticket: ${updateError}`);
    }
  }, [updateError]);

  // if there is an error during create, log it and sent a message to the user.
  useEffect(() => {
    if (createError) {
      console.error("Error creating ticket:", createError);
      message.error(`Error creating ticket: ${createError}`);
    }
  }, [createError]);

  // when going to view mode, reset unsaved changes
  useEffect(() => {
    if (mode === "view") {
      // Reset unsaved changes when switching back to view mode
      resetChanges();
    }
  }, [mode])

  // view can be set to add mode from outside of the component, so we need to listen for changes to addMode and update the mode accordingly. This allows the component to switch between add and view modes based on external props.
  useEffect(() => {
    setMode(defaultMode);
  }, [addMode])

  // when updateData is available, refresh the ticket details
  useEffect(() => {
    if (updateData, !updateLoading && !updateError) {
      refreshTicket();
      resetChanges();
      setMode(defaultMode);
    }
  }, [updateLoading, updateError, updateData])

  // when a ticket is created, navigate to its details page
  useEffect(() => {
    if (!createLoading && !createError && createData) {
      console.log("Ticket created: ", createData, "Navigating to ticket details page.");
      setAddMode(false);
      resetChanges();
      navigate(`/tickets/${createData.id}`);
      refreshTicket();
    }
  }, [createLoading, createError, createData])

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
    refreshTicket();
  }


  const submit = () => {
    if (mode === 'edit') {
      const updatedTicket = {
        id: ticket.id,
        title: getValue("title"),
        thing_id: getValue("thing_id"),
        category_id: getValue("category_id"),
        description: getValue("description"),
        open: getValue("open"),
      };
      console.log("Updating thing with data:", updatedTicket);
      updateTicket(updatedTicket);
    } else if (mode === 'add') {
      const newTicket = {
        title: getValue("title"),
        open: true,
        category_id: getValue("category_id"),
        description: getValue("description"),
      };
      if (thingId) {
        newTicket.thing_id = thingId;
      }
      console.log("Creating ticket with data:", newTicket);
      createTicket(newTicket);
    }

  }

  return {
    mode,
    setMode,
    setAddMode,
    changeHandler,
    getValue,
    submit,
  };
}

export default detailsHooks;
