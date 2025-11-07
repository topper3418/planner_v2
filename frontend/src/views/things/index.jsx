import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import useApi from '../../api/';

import components from '../../components/';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const {
  ThingTree,
  CommentPanel,
  ActionPanel,
  tables: { TicketTable, ChilrenTable },
  details: { ThingDetails, TicketDetails }
} = components;

const ThingView = () => {

  const {
    thingId,
    ticketId,
    checkedThingIds,
    setCheckedThingIds,
    selectThing,
    thingData,
    thingLoading,
    thingError,
    fetchThing,
    ticketData,
    ticketLoading,
    ticketError,
    fetchTicket,
    onRow,
    beginAddTicket,
    setBeginAddTicket
  } = useThingViewHooks()

  const tickeTableBeginAddTicket = () => {
    setBeginAddTicket(true);
  }

  return (<>
    <Flex gap="10px" style={{ overflowY: 'hidden' }}>
      <ThingTree
        rorderable={true}
        checkedThingIds={checkedThingIds}
        setCheckedThingIds={setCheckedThingIds}
        selectedThingId={thingId}
        refreshTrigger={ticketId}
        setSelectedThingId={selectThing} />
      <Flex gap="10px" style={{ height: '100%', minHeight: 0, overflowX: 'auto' }}>
        {thingId && <>
          <Flex vertical gap="10px">
            <ThingDetails
              thing={thingData}
              loading={thingLoading}
              error={thingError}
              refreshThing={fetchThing} />
            <ChilrenTable
              selectedThingId={thingId}
              setSelectedThingId={selectThing} />
          </Flex>
        </>}
        <Flex vertical>
          <Flex style={{
            height: ticketId || beginAddTicket ? '50%' : '100%',
          }}>
            <TicketTable
              checkedThingIds={thingId ? undefined : checkedThingIds}
              selectedThingId={thingId}
              tableMode={ticketId ? "compact" : "full"}
              selectedTicketId={ticketId}
              beginAddTicket={tickeTableBeginAddTicket}
              scrollHeight={ticketId || beginAddTicket ? 110 : 400}
              onRow={onRow} />
          </Flex>
          {(ticketId || beginAddTicket) && <TicketDetails
            addMode={beginAddTicket}
            setAddMode={setBeginAddTicket}
            ticket={beginAddTicket ? {} : ticketData}
            thing={thingData}
            loading={ticketLoading}
            error={ticketError}
            thingId={thingId}
            refreshTicket={fetchTicket} />}
        </Flex>
        {ticketId && <Flex
          vertical
          gap="10px"
          style={{ flex: 1, height: "100%" }}>
          <Flex style={{
            maxHeight: '50%',
            minHeight: '50%'
          }}>
            <CommentPanel ticketId={ticketId} />
          </Flex>
          <Flex style={{
            maxHeight: '50%',
            minHeight: '50%'
          }}>
            <ActionPanel ticketId={ticketId} />
          </Flex>
        </Flex>
        }
      </Flex>
    </Flex>
  </>);
}


const useThingViewHooks = () => {
  // initialize state
  const { thingId, ticketId } = useParams();
  const [checkedThingIds, setCheckedThingIds] = useState([]);
  const [beginAddTicket, setBeginAddTicket] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // custom hooks
  const {
    data: thingData,
    loading: thingLoading,
    error: thingError,
    getThing
  } = useApi.thing.fetchOne(thingId);
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    getTicket
  } = useApi.ticket.fetchOne(ticketId);

  // helpers for fetching data
  const fetchThing = () => {
    if (thingId) {
      getThing(thingId);
    }
  }
  const fetchTicket = () => {
    if (ticketId) {
      getTicket(ticketId);
    }
  }

  // Effects to fetch data when IDs change
  useEffect(() => {
    if (thingId) fetchThing();
  }, [thingId]);

  useEffect(() => {
    if (ticketId) fetchTicket()
  }, [ticketId])

  // helpers
  const selectThing = (newThingId) => {
    if (newThingId) {
      navigate(`/things/${newThingId}`);
    } else {
      navigate(`/`);
    }
  }

  const selectTicket = (newTicketId) => {
    if (thingId) {
      if (!newTicketId || newTicketId === ticketId) {
        navigate(`/${thingId}`);
        return;
      }
      navigate(`/things/${thingId}/tickets/${newTicketId}`);
    } else {
      if (!newTicketId || newTicketId === ticketId) {
        navigate(`/`);
        return;
      }
      navigate(`/tickets/${newTicketId}`);
    }
  }

  const onRow = (record) => {
    return {
      onClick: () => {
        if (record.id != ticketId) {
          if (thingId) {
            navigate(`/${thingId}/tickets/${record.id}`)
          } else {
            navigate(`/tickets/${record.id}`)
          }
        } else {
          // Clicking the same ticket deselects it
          if (thingId) {
            navigate(`/${thingId}`);
          } else {
            navigate(`/`);
          }
        }
      }
    }
  }

  return {
    ticketId,
    thingId,
    selectTicket,
    onRow,
    selectThing,
    checkedThingIds,
    setCheckedThingIds,
    selectThing,
    thingData,
    thingLoading,
    thingError,
    fetchThing,
    ticketData,
    ticketLoading,
    ticketError,
    location,
    fetchTicket,
    onRow: onRow,
    beginAddTicket,
    setBeginAddTicket
  }

}


export default ThingView;
