import { useEffect, useState } from 'react';
import { Flex, Modal } from 'antd';
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
    selectedThingId,
    setSelectedThingId,
    checkedThingIds,
    setCheckedThingIds,
    selectedTicketId,
    setSelectedTicketId,
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
    navToTicket,
    beginAddTicket,
    setBeginAddTicket
  } = useThingViewHooks()

  return (<>
    <Flex gap="10px" style={{ overflowY: 'hidden' }}>
      <ThingTree
        rorderable={true}
        checkedThingIds={checkedThingIds}
        setCheckedThingIds={setCheckedThingIds}
        selectedThingId={selectedThingId}
        setSelectedThingId={selectThing} />
      <Flex gap="10px" style={{ height: '100%', minHeight: 0, overflowX: 'auto' }}>
        {selectedThingId && <>
          <Flex vertical gap="10px">
            <ThingDetails
              thing={thingData}
              loading={thingLoading}
              error={thingError}
              refreshThing={fetchThing} />
            <ChilrenTable
              selectedThingId={selectedThingId}
              setSelectedThingId={setSelectedThingId} />
          </Flex>
        </>}
        <Flex vertical>
          <Flex style={{
            maxHeight: selectedThingId || selectedTicketId ? '50%' : '100%',
            minHeight: selectedThingId || selectedTicketId ? '50%' : '100%'
          }}>
            <TicketTable
              checkedThingIds={selectedThingId ? undefined : checkedThingIds}
              selectedThingId={selectedThingId}
              tableMode={selectedTicketId ? "compact" : "full"}
              selectedTicketId={selectedTicketId}
              beginAddTicket={() => setBeginAddTicket(true)}
              scrollHeight={selectedThingId || selectedTicketId ? 110 : 400}
              onRow={navToTicket} />
          </Flex>
          {selectedTicketId && <TicketDetails
            addMode={beginAddTicket}
            ticket={beginAddTicket ? {} : ticketData}
            loading={ticketLoading}
            error={ticketError}
            thingId={selectedThingId}
            refreshTicket={fetchTicket} />}
        </Flex>
        {selectedTicketId && <Flex
          vertical
          gap="10px"
          style={{ flex: 1, height: "100%" }}>
          <Flex style={{
            maxHeight: '50%',
            minHeight: '50%'
          }}>
            <CommentPanel ticketId={selectedTicketId} />
          </Flex>
          <Flex style={{
            maxHeight: '50%',
            minHeight: '50%'
          }}>
            <ActionPanel ticketId={selectedTicketId} />
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
  const [selectedThingId, setSelectedThingId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
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
  } = useApi.thing.fetchOne(selectedThingId);
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    getTicket
  } = useApi.ticket.fetchOne(selectedTicketId);
  console.log("ticketData:", ticketData)

  // helpers for fetching data
  const fetchThing = () => {
    if (selectedThingId) {
      getThing(selectedThingId);
    }
  }
  const fetchTicket = () => {
    console.log("fetch ticket called")
    if (selectedTicketId) {
      getTicket(selectedTicketId);
    }
  }

  // Effects to fetch data when IDs change
  useEffect(() => {
    if (selectedThingId) fetchThing();
  }, [selectedThingId]);

  useEffect(() => {
    if (selectedTicketId) fetchTicket()
  }, [selectedTicketId])

  // Effects to handle route params
  useEffect(() => {
    if (thingId && /^\d+$/.test(thingId)) {
      setSelectedThingId(thingId);
    } else {
      setSelectedThingId(null);
    }
  }, [thingId]);

  useEffect(() => {
    if (ticketId && /^\d+$/.test(ticketId)) {
      setSelectedTicketId(ticketId);
    } else {
      setSelectedTicketId(null);
    }
    // For /things (no params), both remain null
  }, [ticketId]);


  // helpers
  const selectThing = (newThingId) => {
    setSelectedThingId(newThingId);
    if (newThingId) {
      navigate(`/${newThingId}`);
    } else {
      navigate(`/`);
    }
  }
  const navToTicket = (record) => {
    return {
      onClick: () => {
        setSelectedTicketId(record.id)
        if (thingId) {
          navigate(`/${thingId}/tickets/${record.id}`)
        } else {
          navigate(`/tickets/${record.id}`)
        }
      }
    }
  }

  return {
    selectedThingId,
    setSelectedThingId,
    selectedTicketId,
    setSelectedThingId,
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
    navToTicket,
    beginAddTicket,
    setBeginAddTicket
  }

}


export default ThingView;
