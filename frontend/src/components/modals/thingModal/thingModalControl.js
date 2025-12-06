import { useState } from "react";
import useThingBuffer from "./thingBuffer";
import { useParams } from "react-router-dom";

const useThingModalControl = (api) => {
  const [addThingModalOpen, setAddThingModalOpen] = useState(false);
  const [editThingModalOpen, setEditThingModalOpen] = useState(false);
  const { thingId } = useParams();
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const thingBuffer = useThingBuffer();
  const thingModalControl = {
    error:
      api.thing.selected.error ||
      api.thing.create.error ||
      api.thing.update.error,
    loading:
      api.thing.selected.loading ||
      api.thing.create.loading ||
      api.thing.update.loading,
    mode,
    thing: thingBuffer,
    add: {
      isOpen: addThingModalOpen,
      open: () => {
        setMode("add");
        thingBuffer.reset();
        setAddThingModalOpen(true);
      },
      close: () => setAddThingModalOpen(false),
      submit: async () => {
        await api.thing.create.create({
          name: thingBuffer.name,
          description: thingBuffer.description,
          docs_link: thingBuffer.docsLink,
          category_id: thingBuffer.categoryId,
          parent_id: thingBuffer.parentId,
        });
        api.refreshAll();
        thingBuffer.reset();
        setAddThingModalOpen(false);
      },
    },
    edit: {
      isOpen: editThingModalOpen,
      open: () => {
        setMode("edit");
        thingBuffer.set.name(api.thing.selected.data?.name);
        thingBuffer.set.description(api.thing.selected.data?.description);
        thingBuffer.set.docsLink(api.thing.selected.data?.docs_link);
        thingBuffer.set.categoryId(api.thing.selected.data?.category_id);
        thingBuffer.set.parentId(api.thing.selected.data?.parent_id);
        setEditThingModalOpen(true);
      },
      close: () => setEditThingModalOpen(false),
      submit: async () => {
        console.log("update: ", api.thing.update);
        await api.thing.update.update({
          id: thingId,
          name: thingBuffer.name,
          description: thingBuffer.description,
          docs_link: thingBuffer.docsLink,
          category_id: thingBuffer.categoryId,
          parent_id: thingBuffer.parentId,
        });
        api.refreshAll();
        thingBuffer.reset();
        setEditThingModalOpen(false);
      },
    },
  };
  return thingModalControl;
};

export default useThingModalControl;
