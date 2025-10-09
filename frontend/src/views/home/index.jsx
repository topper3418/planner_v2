import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import ThingTree from '../../components/thingTree';
import TicketTable from './ticketTable';
import ThingDetails from '../../components/thingDetails.jsx';
import ChilrenTable from './childrenTable';
import useFetchThing from "../../api/useFetchThing";
import useFetchTicket from '../../api/useFetchTicket';

const HomeView = () => {
  const [checkedThingIds, setCheckedThingIds] = useState([]);
  const [selectedThingId, setSelectedThingId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const {
    data: thingData,
    loading: thingLoading,
    error: thingError,
    getThing
  } = useFetchThing();
  const {
    data: ticketData,
    loading: ticketLoading,
    error: ticketError,
    getTicket
  } = useFetchTicket();

  console.log("selectedThingId in HomeView:", selectedThingId);

  const fetchThing = () => {
    if (selectedThingId) {
      getThing(selectedThingId);
    }
  }

  const fetchTicket = () => {
    if (selectedTicketId) {
      getTicket(selectedTicketId);
    }
  }

  useEffect(() => {
    fetchThing();
  }, [selectedThingId]);

  return (<>
    <Flex
      gap="10px"
      style={{ height: '100%', width: '100%' }}>
      <ThingTree
        checkedThingIds={checkedThingIds}
        setCheckedThingIds={setCheckedThingIds}
        selectedThingId={selectedThingId}
        setSelectedThingId={setSelectedThingId} />
      <Flex gap="10px" style={{ height: '100%' }} wrap>
        {selectedThingId && <>
          <ThingDetails
            thing={thingData}
            loading={thingLoading}
            error={thingError}
            refreshThing={fetchThing} />
          <ChilrenTable
            selectedThingId={selectedThingId}
            setSelectedThingId={setSelectedThingId} />
        </>}
        <TicketTable
          checkedThingIds={checkedThingIds}
          selectedThingId={selectedThingId} />
      </Flex>
    </Flex>
  </>);
}


export default HomeView;
