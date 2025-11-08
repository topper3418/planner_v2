import apiUtils from "../util";

const { useUpdate } = apiUtils;

const USER_UPDATE_URL = "/api/users";

const useUpdateUser = () => {
  const { data, loading, error, update } = useUpdate(USER_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateUser;
