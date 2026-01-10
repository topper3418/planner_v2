import { Flex } from "antd";
import components from "../../components";
import useTicketViewHooks from "./hooks";
// import MilestonesCard from "./milestonesCard";

const {
  ActionPanel,
  tables: { TicketTable },
  details: { TicketDetails },
  modals: { TicketModal, TicketLinkModal },
  TicketLinkPanel
} = components;


const TicketView = () => {
  const {
    ticketId,
    select,
    api,
    modalControl
  } = useTicketViewHooks()
  const cols = ticketId ? ["Title", "Thing", "Category", "Due Date"] :
    ["Title", "Thing", "Category", "Assigned User", "Due Date"];
  return (<>
    <Flex gap="10px" style={{
      height: '100%',
      overflowY: 'hidden',
    }}>
      <Flex gap="10px" style={{
        height: '100%',
        overflowX: 'auto',
        flexWrap: 'wrap',
      }}>
        <TicketTable
          ticketListApi={api.ticket.list}
          tableMode={ticketId ? "compact" : "full"}
          widthOverride={ticketId ? 600 : 1100}
          colsOverride={cols}
          selectedTicketId={ticketId}
          beginAddTicket={modalControl.ticket.add.open}
          scrollHeight={500}
          onRow={(record) => {
            return {
              onClick: () => select.ticket(record.id)
            }
          }} />
        {ticketId &&
          <Flex vertical gap="10px" style={{ height: 'calc(100% - 20px)' }}>
            <TicketDetails
              ticket={api.ticket.selected.data}
              loading={api.ticket.selected.loading}
              error={api.ticket.selected.error}
              beginEdit={modalControl.ticket.edit.open}
              height="60%"
            />
            <TicketLinkPanel api={api} beginAdd={modalControl.ticketLink.add.open} />
          </Flex>}
        {ticketId && <>
          <Flex
            vertical
            gap="10px"
            style={{ flex: 1, height: "100%" }}>
            <ActionPanel ticketId={ticketId} refreshAll={api.refreshAll} />
          </Flex>
        </>}
      </Flex>
    </Flex>
    <TicketModal
      modalControl={modalControl.ticket} />
    <TicketLinkModal
      modalControl={modalControl.ticketLink} />
  </>)
}

export default TicketView;
