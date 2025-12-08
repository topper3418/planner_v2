import { Flex } from 'antd';

import components from '../../components/';
import useThingViewHooks from './hooks';

const {
  ThingTree,
  ActionPanel,
  tables: { TicketTable },
  details: { ThingDetails, TicketDetails },
  modals: { TicketModal, ThingModal }
} = components;

const ThingView = () => {

  const {
    ticketId,
    thingId,
    api,
    select,
    checkedThingIds,
    ticketModalControl,
    thingModalControl
  } = useThingViewHooks()

  return (<>
    <Flex gap="10px" style={{ overflowY: 'hidden', height: '100%', flexWrap: 'wrap' }}>
      <ThingTree api={api} />
      <Flex gap="10px" style={{
        height: '100%',
        minHeight: 0,
        overflowX: 'auto'
      }}>
        <Flex vertical gap="10px">
          {thingId &&
            <ThingDetails
              thing={api.thing.selected.data}
              loading={api.thing.selected.loading}
              error={api.thing.selected.error}
              beginEdit={thingModalControl.edit.open} />
          }
          {ticketId &&
            <TicketDetails
              ticket={api.ticket.selected.data}
              loading={api.ticket.selected.loading}
              error={api.ticket.selected.error}
              beginEdit={ticketModalControl.edit.open} />}
        </Flex>
        <TicketTable
          checkedThingIds={thingId ? undefined : checkedThingIds}
          selectedThingId={thingId}
          tableMode={ticketId || thingId ? "compact" : "full"}
          ticketListApi={api.ticket.list}
          selectedTicketId={ticketId}
          beginAddTicket={ticketModalControl.add.open}
          scrollHeight={500}
          onRow={(record) => ({
            onClick: () => {
              select.ticket(record.id);
            },
          })} />
        {ticketId && <Flex
          vertical
          gap="10px"
          style={{ flex: 1, height: "100%" }}>
          <ActionPanel ticketId={ticketId} refreshAll={api.refreshAll} />
        </Flex>
        }
      </Flex>
    </Flex >
    <TicketModal
      modalControl={ticketModalControl} />
    <ThingModal
      modalControl={thingModalControl} />
  </>);
}




export default ThingView;
