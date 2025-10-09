import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import useFetchThingTree from '../api/useFetchThingTree';
import NewThingModal from '../components/newThingModel';
import useUpdateThing from '../api/useUpdateThing';


const ThingTree = ({
  checkedThingIds,
  setCheckedThingIds,
  selectedThingId,
  setSelectedThingId
}) => {
  const [keysChanged, setKeysChanged] = useState(false);
  const [createThingModalOpen, setCreateThingModalOpen] = useState(false);

  const {
    data: treeData,
    allIds,
    loading: treeDataLoading,
    error: treeDataError,
    refetch: treeDataRefetch
  } = useFetchThingTree();

  const {
    updateThing
  } = useUpdateThing();

  useEffect(() => {
    if (allIds.length > 0 && checkedThingIds.length === 0 && !keysChanged) {
      setCheckedThingIds(allIds);
    }
  }, [allIds]);

  const onCheck = (checkedKeys) => {
    setKeysChanged(true);
    setCheckedThingIds(checkedKeys);
  };

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
        {(checkedThingIds.length > 0 || selectedThingId !== null) &&
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
        checkable
        draggable
        onDrop={onDrop}
        checkedKeys={checkedThingIds}
        onCheck={onCheck}
        defaultExpandAll={true}
        selectedKeys={selectedThingId !== null ? [selectedThingId] : []}
        onSelect={onSelect}
        multiple
        error={treeDataError}
        loading={treeDataLoading}
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
