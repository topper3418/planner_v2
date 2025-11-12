import { useState } from "react";
import useUserBuffer from "./userBuffer";

const useUserModalControl = (api, userId) => {
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const mutateUser = useUserBuffer();
  const modalControl = {
    error:
      api.user.selected.error || api.user.create.error || api.user.update.error,
    loading:
      api.user.selected.loading ||
      api.user.create.loading ||
      api.user.update.loading,
    mode,
    user: mutateUser,
    add: {
      isOpen: addUserModalOpen,
      open: () => {
        setMode("add");
        mutateUser.reset();
        setAddUserModalOpen(true);
      },
      close: () => setAddUserModalOpen(false),
      submit: async () => {
        await api.user.create.create({
          username: mutateUser.username,
        });
        api.refreshAll();
        mutateUser.reset();
        setAddUserModalOpen(false);
      },
    },
    edit: {
      isOpen: editUserModalOpen,
      open: () => {
        setMode("edit");
        mutateUser.set.username(api.user.selected.data.username);
        setEditUserModalOpen(true);
      },
      close: () => setEditUserModalOpen(false),
      submit: async () => {
        await api.user.update.update({
          id: userId,
          username: mutateUser.username,
        });
        api.refreshAll();
        mutateUser.reset();
        setEditUserModalOpen(false);
      },
    },
  };
  return modalControl;
};

export default useUserModalControl;
