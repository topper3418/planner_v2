import { useState } from "react";

const useTicketBuffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(true);
  const [thingId, setThingId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const reset = () => {
    setTitle("");
    setDescription("");
    setOpen(true);
    setThingId(null);
    setCategoryId(null);
    setParentId(null);
    setUserId(null);
  };
  const ticket = {
    title,
    description,
    open,
    thingId,
    categoryId,
    parentId,
    userId,
    set: {
      title: setTitle,
      description: setDescription,
      open: setOpen,
      thingId: setThingId,
      categoryId: setCategoryId,
      parentId: setParentId,
      userId: setUserId,
    },
    reset,
  };
  return ticket;
};

export default useTicketBuffer;
