import { useEffect, useState } from 'react';

import { apiFetch } from '../util/apiFetch';

const THING_TREE_URL = '/api/things/tree';

const dataToTree = (data) => (
  data.map((item) => {
    const treeItem = {
      title: item.name,
      key: item.id,
      thing: item,
    };
    if (item.children && item.children.length > 0) {
      treeItem.children = dataToTree(item.children);
    }
    return treeItem;
  })
);

const extractIds = (nodes, ids = []) => {
  nodes.forEach((node) => {
    ids.push(node.key);
    if (node.children) {
      extractIds(node.children, ids);
    }
  });
  return ids;
};

const useFetchThingTree = () => {
  const [data, setData] = useState(null);
  const [totalCount, setTotalCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allIds, setAllIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(THING_TREE_URL, {
        errorPrefix: 'HTTP error on fetch tree view',
      });
      const treeData = dataToTree(result.data);
      setAllIds(extractIds(treeData));
      setData(treeData);
      setTotalCount(result.count !== undefined ? result.count : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, allIds, totalCount, loading, error, fetchData };
};

export default useFetchThingTree;