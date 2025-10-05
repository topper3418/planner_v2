import { useState } from 'react';
import { Flex } from 'antd';
import ThingTree from './thingTree';
import IssueTable from './ticketTable';

const HomeView = () => {
  const [checkedThingIds, setCheckedThingIds] = useState([]);

  return (<>
    <Flex
      gap="10px"
      style={{ height: '100%', width: '100%' }}>
      <ThingTree
        checkedThingIds={checkedThingIds}
        setCheckedThingIds={setCheckedThingIds} />
      <IssueTable selectedThingIds={checkedThingIds} />
    </Flex>
  </>);
}


export default HomeView;
