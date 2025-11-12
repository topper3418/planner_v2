import { useState } from "react";

const useUserBuffer = () => {
  const [mutateUserName, setMutateUserName] = useState("");
  const userModalReset = () => {
    setMutateUserName("");
  };
  const mutateUser = {
    username: mutateUserName,
    set: {
      username: setMutateUserName,
    },
    reset: userModalReset,
  };
  return mutateUser;
};

export default useUserBuffer;
