import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import useTreeData from './thingTreeHook';
import NewThingModal from './newThingModel';
import useUpdateThing from './updateThing';


const ThingTree = ({ selectedThingIds, setSelectedThingIds }) => {
  const [keysChanged, setKeysChanged] = useState(false);
  const [createThingModalOpen, setCreateThingModalOpen] = useState(false);
  const {
    data: treeData,
    allIds,
    loading: treeDataLoading,
    error: treeDataError,
    refetch: treeDataRefetch
  } = useTreeData();
  const {
    updateThing
  } = useUpdateThing();

  useEffect(() => {
    if (allIds.length > 0 && selectedThingIds.length === 0 && !keysChanged) {
      setSelectedThingIds(allIds);
    }
  }, [allIds]);
  const onCheck = (checkedKeys) => {
    setKeysChanged(true);
    setSelectedThingIds(checkedKeys);
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

  return (<>
    <Flex
      vertical
      gap="10px"
      style={{
        padding: "10px 0 0 10px",
        height: "100%",
      }}>
      <Flex justify='end'>
        <Button type="primary" onClick={() => setCreateThingModalOpen(true)}>
          New Thing
        </Button>
      </Flex>
      <Tree
        checkable
        draggable
        onDrop={onDrop}
        checkedKeys={selectedThingIds}
        onCheck={onCheck}
        defaultExpandAll={true}
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
