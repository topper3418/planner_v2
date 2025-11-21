import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import useApi from '../api/';
import { useParams } from 'react-router-dom';
import useViewNavigation from '../navigation';


const ThingTree = ({
  refreshTrigger,
  beginAddThing,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const navigation = useViewNavigation();
  const { thingId } = navigation.urlParams;
  // helper for selecting a thing
  const selectThing = (newThingId) => {
    if (newThingId && newThingId != thingId) {
      navigation.navigate(`/things/${newThingId}`);
    } else {
      navigation.navigate(`/`);
    }
  }
  const {
    data: treeData,
    allIds,
    loading: treeDataLoading,
    error: treeDataError,
    refetch: treeDataRefetch
  } = useApi.thing.fetchTree();

  const checkedThingIds = navigation.getQueryParam.thingIds

  const onCheck = (checkedKeys) => {
    if (checkedKeys.length === 0) {
      navigation.setQueryParam.thingIds(null);
    } else {
      navigation.setQueryParam.thingIds(checkedKeys);
    }

  };

  useEffect(() => {
    if (!treeDataLoading && initialLoad) {
      setExpandedKeys(allIds);
      setInitialLoad(false);
    }
  }, [treeDataLoading]);

  useEffect(() => {
    treeDataRefetch();
  }, [refreshTrigger]);

  const onSelect = (selectedKeys) => {
    const newSelectedThingId = selectedKeys[selectedKeys.length - 1]
    selectThing(newSelectedThingId);
  }

  return (<>
    <Flex
      vertical
      gap="10px"
      style={{
        padding: "10px 0 0 10px",
        height: "100%",
        width: "250px",
      }}>
      <Flex justify='end'>
        {(checkedThingIds?.length > 0 || thingId !== null) &&
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              navigation.setQueryParam.thingIds(null);
              setSelectedThingId(null);
            }}>
            Clear Selection
          </Button>
        }
        <Button type="primary" onClick={() => beginAddThing(true)}>
          New Thing
        </Button>
      </Flex>
      <Tree
        checkable={true}
        checkedKeys={checkedThingIds}
        onCheck={onCheck}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        selectedKeys={thingId !== null ? [Number(thingId)] : []}
        onSelect={onSelect}
        height={600}
        multiple
        error={treeDataError}
        treeData={treeData}
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
  </>);
};
export default ThingTree;
