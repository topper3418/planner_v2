import { Flex } from "antd";
import useApi from "../../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import components from "../../components";
import useMutateUser from "../../components/details/userModal/mutateUserHooks";


const {
  tables: { TicketList, UserList },
  details: { UserModal },
} = components;

const UserView = () => {
  const hooks = useUserViewHooks();
  return (<>
    <Flex style={{ height: '100%' }} gap="10px">
      <UserList
        userId={hooks.userId}
        users={hooks.usersData || []}
        loading={hooks.usersLoading}
        createLoading={hooks.createUserLoading}
        createCallback={() => hooks.setAddUserModalOpen(true)}
        editCallback={() => {
          hooks.setEditUserModalOpen(true)
        }}
        selectUser={(userId) => hooks.selectUser(userId)} />
      {hooks.userId &&
        <TicketList
          tickets={hooks.ticketData || []}
          ticketsLoading={hooks.ticketLoading}
          selectTicket={hooks.selectTicket} />}
    </Flex>
    <UserModal
      open={hooks.addUserModalOpen}
      onOk={async () => {
        console.log('Creating user with username:', hooks.mutateUser.username);
        await hooks.createUser({
          username: hooks.mutateUser.username,
        });
        hooks.fetchUsers();
        hooks.mutateUser.reset();
        hooks.setAddUserModalOpen(false)
      }}
      onCancel={() => {
        hooks.mutateUser.reset();
        hooks.setAddUserModalOpen(false)
      }}
      user={hooks.mutateUser} />
    <UserModal
      open={hooks.editUserModalOpen}
      onOk={async () => {
        await hooks.updateUser({
          id: hooks.userId,
          username: hooks.mutateUser.username
        });
        hooks.fetchUsers();
        hooks.mutateUser.reset();
        hooks.setEditUserModalOpen(false)
      }}
      onCancel={() => {
        hooks.mutateUser.reset();
        hooks.setEditUserModalOpen(false)
      }}
      user={hooks.mutateUser} />
  </>)
}


const useUserViewHooks = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [mutateUserMode, setMutateUserMode] = useState('create'); // 'create' | 'update'
  const mutateUser = useMutateUser();

  const selectUser = (id) => {
    if (id == userId) {
      navigate(`/users/`);
    } else {
      navigate(`/users/${id}`);
    }
  }
  const selectTicket = (id) => {
    navigate(`/tickets/${id}`);
  }
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    refetch: fetchTickets,
  } = useApi.ticket.fetchMany({ user_id: userId });
  useEffect(() => {
    if (userId) {
      fetchTickets({ user_id: userId });
    }
  }, [userId]);
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    fetchData: fetchUsers,
  } = useApi.user.fetchMany();
  const {
    data: createUserData,
    loading: createUserLoading,
    error: createUserError,
    create: createUser,
  } = useApi.user.create();
  const {
    data: updateUserData,
    loading: updateUserLoading,
    error: updateUserError,
    update: updateUser,
  } = useApi.user.update();

  const beginEdit = () => {
    // TODO: fix this
    setEditUserModalOpen(true);
  }
  return {
    userId,
    selectUser,
    selectTicket,
    addUserModalOpen,
    editUserModalOpen,
    setAddUserModalOpen,
    setEditUserModalOpen,
    mutateUserMode,
    setMutateUserMode,
    mutateUser,
    usersData,
    usersLoading,
    usersError,
    fetchUsers,
    ticketData,
    ticketLoading,
    ticketError,
    fetchTickets,
    createUserData,
    createUserLoading,
    createUserError,
    createUser,
    updateUserData,
    updateUserLoading,
    updateUserError,
    updateUser,
  };
}


export default UserView;
