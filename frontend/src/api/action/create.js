import apiUtils from "../util";

const { useCreate } = apiUtils;

const ACTION_CREATE_URL = "/api/actions/";

const useCreateAction = () => {
  const { data, loading, error, create } = useCreate(ACTION_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateAction;
