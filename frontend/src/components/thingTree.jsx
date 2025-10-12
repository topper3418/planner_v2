import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import NewThingModal from '../components/newThingModel';
import api from '../api/';
import { useParams } from 'react-router-dom';


const ThingTree = ({
  checkedThingIds,
  setCheckedThingIds,
  selectedThingId,
  setSelectedThingId,
  rorderable
}) => {
  const [keysChanged, setKeysChanged] = useState(false);
  const [createThingModalOpen, setCreateThingModalOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const { thingId } = useParams();

  const {
    data: treeData,
    allIds,
    loading: treeDataLoading,
    error: treeDataError,
    refetch: treeDataRefetch
  } = api.useFetchThingTree();

  const {
    updateThing
  } = api.useUpdateThing();

  useEffect(() => {
    if (allIds?.length > 0 && checkedThingIds?.length === 0 && !keysChanged) {
      setCheckedThingIds(allIds);
    }
  }, [allIds]);

  const onCheck = (checkedKeys) => {
    setKeysChanged(true);
    setCheckedThingIds(checkedKeys);
  };

  useEffect(() => {
    if (!treeDataLoading && initialLoad) {
      setExpandedKeys(allIds);
      setInitialLoad(false);
    }
  }, [treeDataLoading]);

  const onDrop = async (info) => {
    const { dragNode, node: dropNode, dropToGap } = info;
    const dropKey = dropNode.key;

    if (dropToGap) console.log('Dropped to gap, making root');
    if (dropKey) console.log('Dropped on node:', dropKey);

    // Determine new parent ID: null for root, dropKey for child drop
    const newParentId = dropKey ? dropKey : null;

    try {
      // Update thing's parent via API
      const updatedThing = {
        ...dragNode.thing,
        parent_id: newParentId, // Assuming thing has parentId field
      };
      console.log('Updating thing:', updatedThing);
      await updateThing(updatedThing);

      // Refetch tree data to reflect server state
      await treeDataRefetch();
    } catch (err) {
      console.error('Failed to update thing parent:', err);
    }
  };

  const onSelect = (selectedKeys) => {
    console.log('Selected: ', selectedKeys);
    const newSelectedThingId = selectedKeys[selectedKeys.length - 1]
    console.log("setting to selectedKey", newSelectedThingId);
    setSelectedThingId(newSelectedThingId);
  }


  return (<>
    <Flex
      vertical
      gap="10px"
      style={{
        padding: "10px 0 0 10px",
        height: "100%",
      }}>
      <Flex justify='end'>
        {(checkedThingIds?.length > 0 || selectedThingId !== null) &&
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              setCheckedThingIds([]);
              setSelectedThingId(null);
              setKeysChanged(true);
            }}>
            Clear Selection
          </Button>
        }
        <Button type="primary" onClick={() => setCreateThingModalOpen(true)}>
          New Thing
        </Button>
      </Flex>
      <Tree
        checkable={checkedThingIds !== undefined && setCheckedThingIds !== undefined}
        draggable={rorderable}
        onDrop={onDrop}
        checkedKeys={checkedThingIds}
        onCheck={onCheck}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        selectedKeys={thingId !== null ? [Number(thingId)] : []}
        onSelect={onSelect}
        multiple
        error={treeDataError}
        treeData={treeData}
        style={{
          flexGrow: 1,
          padding: '10px',
          minWidth: '250px',
        }}
      />
    </Flex>
    <NewThingModal
      open={createThingModalOpen}
      setOpen={setCreateThingModalOpen}
      onSubmit={treeDataRefetch}
    />
  </>);
};
export default ThingTree;
