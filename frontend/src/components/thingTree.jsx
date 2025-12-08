import { useEffect, useState } from 'react';
import { Button, Card, Flex, Tree } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useApi from '../api/';
import useViewNavigation from '../navigation';


const ThingTree = ({
  api,
}) => {
  const { thing: thingApi } = api;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigation = useViewNavigation();
  const { thingId } = navigation.urlParams;
  // helper for selecting a thing
  const selectThing = (newThingId) => {
    if (newThingId && newThingId != thingId) {
      navigation.navigateWithParams(`/things/${newThingId}`);
    } else {
      navigation.navigateWithParams(`/things/`);
    }
  }

  const checkedThingIds = navigation.getQueryParam.thingIds

  const onCheck = (checkedKeys) => {
    if (checkedKeys.length === 0) {
      navigation.setQueryParam.thingIds(null);
    } else {
      navigation.setQueryParam.thingIds(checkedKeys);
    }

  };

  useEffect(() => {
    if (!thingApi.tree.loading && initialLoad) {
      setExpandedKeys(thingApi.tree.allIds);
      setInitialLoad(false);
    }
  }, [thingApi.tree.loading]);

  const onSelect = (selectedKeys) => {
    const newSelectedThingId = selectedKeys[selectedKeys.length - 1]
    selectThing(newSelectedThingId);
  }

  return (<>
    <Card
      title="Things"
      style={{ height: '100%' }}
      extra={<Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => beginAddThing(true)} />
      }>
      <Flex
        vertical
        gap="10px"
        style={{
          height: "100%",
          width: "250px",
        }}>
        <Tree
          checkable={true}
          checkedKeys={checkedThingIds}
          onCheck={onCheck}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={thingId !== null ? [Number(thingId)] : []}
          onSelect={onSelect}
          height={570}
          multiple
          error={thingApi.tree.error}
          treeData={thingApi.tree.data}
          titleRender={(node) => {
            // show ticket count if expanded
            if (expandedKeys.includes(node.key)) {
              return `${node.thing.name} (${node.thing.ticket_count})`;
            } else {
              // otherwise show the sum of the ticket counts of all children, recursively
              const getTotalTicketCount = (node) => {
                let total = node.thing.ticket_count || 0;
                if (node.children) {
                  node.children.forEach((child) => {
                    total += getTotalTicketCount(child);
                  });
                }
                return total;
              };
              return `${node.thing.name} (${getTotalTicketCount(node)})`;
            }
          }}
          style={{
            flexGrow: 1,
            padding: '10px',
            minWidth: '250px',
          }}
        />
      </Flex>
    </Card>
  </>);
};
export default ThingTree;
