import { useState } from "react";

const useThingBuffer = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [docsLink, setDocsLink] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [parentId, setParentId] = useState(null);
  const reset = () => {
    setName("");
    setDescription("");
    setDocsLink("");
    setCategoryId(null);
    setParentId(null);
  };
  const thing = {
    name,
    description,
    docsLink,
    categoryId,
    parentId,
    set: {
      name: setName,
      description: setDescription,
      docsLink: setDocsLink,
      categoryId: setCategoryId,
      parentId: setParentId,
    },
    reset,
  };
  return thing;
};

export default useThingBuffer;
