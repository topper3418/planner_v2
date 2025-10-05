import { useEffect, useState } from 'react';
import { Button, Flex, Tree } from 'antd';
import useTreeData from './thingTreeHook';
import NewThingModal from './newThingModel';
import useUpdateThing from './updateThing';


const ThingTree = ({ checkedThingIds, setCheckedThingIds }) => {
  const [keysChanged, setKeysChanged] = useState(false);
  const [createThingModalOpen, setCreateThingModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
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
    console.log("setting to selectedKey", selectedKeys[selectedKeys.length - 1]);
    setSelectedKey(selectedKeys[selectedKeys.length - 1]);
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
        {checkedThingIds.length > 0 &&
          <Button
            style={{ marginRight: '10px' }}
            onClick={() => {
              setSelectedKeys(null);
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
        selectedKeys={selectedKey !== null ? [selectedKey] : []}
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
