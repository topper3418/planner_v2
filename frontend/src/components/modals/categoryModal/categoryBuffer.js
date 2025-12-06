import { useState } from "react";

const useCategoryBuffer = () => {
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const userModalReset = () => {
    setId(null);
    setName("");
    setDescription("");
    setColor("");
  };
  const buffer = {
    id,
    name,
    description,
    color,
    set: {
      id: setId,
      name: setName,
      description: setDescription,
      color: setColor,
    },
    reset: userModalReset,
  };
  return buffer;
};

export default useCategoryBuffer;
