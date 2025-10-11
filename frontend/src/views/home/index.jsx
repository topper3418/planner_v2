import { useEffect, useState } from 'react';
import { Flex } from 'antd';
import api from '../../api/';

import components from '../../components/';
import { useLocation, useNavigate } from "react-router-dom";

const {
  ThingTree,
  tables: { TicketTable, ChilrenTable },
  details: { ThingDetails }
} = components;

const HomeView = () => {
  const [checkedThingIds, setCheckedThingIds] = useState([]);
  const [selectedThingId, setSelectedThingId] = useState(null);
  const {
    data: thingData,
    loading: thingLoading,
    error: thingError,
    getThing
  } = api.useFetchThing();
  const navigate = useNavigate();

  const selectThing = (thingId) => {
    setSelectedThingId(thingId);
    if (thingId) {
      navigate(`/things/${thingId}`);
    } else {
      navigate(`/`);
    }
  }


  const fetchThing = () => {
    if (selectedThingId) {
      getThing(selectedThingId);
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
        rorderable={true}
        checkedThingIds={checkedThingIds}
        setCheckedThingIds={setCheckedThingIds}
        selectedThingId={selectedThingId}
        setSelectedThingId={selectThing} />
      <Flex gap="10px" style={{ height: '100%' }} wrap>
        <TicketTable
          checkedThingIds={checkedThingIds}
          selectedThingId={selectedThingId} />
      </Flex>
    </Flex>
  </>);
}


export default HomeView;
