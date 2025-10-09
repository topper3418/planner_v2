import { useState, useEffect } from "react";

const THING_TREE_URL = "/api/things/tree";

const dataToTree = (data) => {
  return data.map((item) => {
    const treeItem = {
      title: item.name,
      key: item.id,
      thing: item,
    };
    if (item.children && item.children.length > 0) {
      treeItem.children = dataToTree(item.children);
    }
    return treeItem;
  });
};

const useFetchThingTree = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allIds, setAllIds] = useState([]);

  const fetchData = async () => {
    const url = new URL(THING_TREE_URL, window.location.origin);
    const allIdsPlaceholder = [];
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `HTTP error on fetch tree view! status: ${response.status}`,
        );
      }
      const result = await response.json();
      const treeData = dataToTree(result);
      const extractIds = (nodes) => {
        nodes.forEach((node) => {
          allIdsPlaceholder.push(node.key);
          if (node.children) {
            extractIds(node.children);
          }
        });
      };
      extractIds(treeData);
      setAllIds(allIdsPlaceholder);
      setData(treeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { data, allIds, loading, error, refetch: fetchData };
};

export default useFetchThingTree;
