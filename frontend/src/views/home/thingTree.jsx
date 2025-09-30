import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import useTreeData from './thingTreeHook';
const ThingTree = ({ selectedThingIds, setSelectedThingIds }) => {
  const [keysChanged, setKeysChanged] = useState(false);
  const {
    data, allIds, loading, error
  } = useTreeData();
  useEffect(() => {
    console.log('All IDs:', allIds);
    if (allIds.length > 0 && selectedThingIds.length === 0 && !keysChanged) {
      setSelectedThingIds(allIds);
    }
  }, [allIds]);
  const onSelect = (selectedKeys, info) => {
    setKeysChanged(true);
    setSelectedThingIds(selectedKeys);
    console.log('onSelect', selectedKeys, info);
  };
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  return (
    <Tree
      checkable
      onSelect={onSelect}
      selectedKeys={selectedThingIds}
      onCheck={onCheck}
      error={error}
      loading={loading}
      treeData={data}
      style={{
        height: '100%',
        padding: '10px',
        minWidth: '250px',
      }}
    />
  );
};
export default ThingTree;
