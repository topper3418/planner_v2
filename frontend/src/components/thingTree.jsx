import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import useApi from '../api/';
import { useParams } from 'react-router-dom';


const ThingTree = ({
  checkedThingIds,
  setCheckedThingIds,
  selectedThingId,
  setSelectedThingId,
  refreshTrigger,
  beginAddThing,
}) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const { thingId } = useParams();

  const {
    data: treeData,
    allIds,
    loading: treeDataLoading,
    error: treeDataError,
    refetch: treeDataRefetch
  } = useApi.thing.fetchTree();

  const onCheck = (checkedKeys) => {
    setCheckedThingIds(checkedKeys);
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
    setSelectedThingId(newSelectedThingId);
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
        {(checkedThingIds?.length > 0 || selectedThingId !== null) &&
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              setCheckedThingIds([]);
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
        checkable={checkedThingIds !== undefined && setCheckedThingIds !== undefined}
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
