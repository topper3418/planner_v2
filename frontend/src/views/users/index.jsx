import { Flex } from "antd";
import components from "../../components";
import useUserViewHooks from "./hooks";


const {
  tables: { TicketList, UserList },
  details: { UserModal },
} = components;

const UserView = () => {
  const {
    userId,
    api,
    select,
    modalControl,
  } = useUserViewHooks();
  return (<>
    <Flex style={{ height: '100%' }} gap="10px">
      <UserList
        userId={userId}
        users={api.user.list.data || []}
        loading={api.user.list.loading}
        createLoading={api.user.create.loading}
        createCallback={modalControl.add.open}
        editCallback={modalControl.edit.open}
        selectUser={select.user} />
      {userId &&
        <TicketList
          tickets={api.ticket.list.data || []}
          ticketsLoading={api.ticket.list.loading}
          selectTicket={select.ticket} />}
    </Flex>
    <UserModal
      modalControl={modalControl} />
  </>)
}


export default UserView;
