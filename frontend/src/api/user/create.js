import apiUtils from "../util";

const { useCreate } = apiUtils;

const USER_CREATE_URL = "/api/users/";

const useCreateUser = () => {
  const { data, loading, error, create } = useCreate(USER_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateUser;
