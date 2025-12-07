import { useState } from "react";
import useCategoryBuffer from "./categoryBuffer";

const useCategoryModalControl = (api, categoryName) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const buffer = useCategoryBuffer();

  const categoryApi = api[categoryName];

  const modalControl = {
    error: categoryApi.create.error || categoryApi.update.error,
    loading: categoryApi.create.loading || categoryApi.update.loading,
    mode,
    category: buffer,
    add: {
      title: `Add ${categoryName}`,
      isOpen: addModalOpen,
      open: () => {
        setMode("add");
        buffer.reset();
        setAddModalOpen(true);
      },
      close: () => setAddModalOpen(false),
      submit: async () => {
        await categoryApi.create.create({
          name: buffer.name,
          description: buffer.description,
          color: buffer.color,
        });
        api.refreshAll();
        buffer.reset();
        setAddModalOpen(false);
      },
    },
    edit: {
      title: `Edit ${categoryName}`,
      isOpen: editModalOpen,
      open: (category) => {
        setMode("edit");
        buffer.set.id(category.id);
        buffer.set.name(category.name);
        buffer.set.description(category.description);
        buffer.set.color(category.color);
        setEditModalOpen(true);
      },
      close: () => setEditModalOpen(false),
      submit: async () => {
        await categoryApi.update.update({
          id: buffer.id,
          name: buffer.name,
          description: buffer.description,
          color: buffer.color,
        });
        api.refreshAll();
        buffer.reset();
        setEditModalOpen(false);
      },
    },
  };
  return modalControl;
};

export default useCategoryModalControl;
