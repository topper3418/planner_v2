import apiUtils from "../util";

const { useCreate } = apiUtils;

const ACTION_TYPE_CREATE_URL = "/api/actions/types/";

const useCreateActionType = () => {
  const { data, loading, error, create } = useCreate(ACTION_TYPE_CREATE_URL);
  return { data, loading, error, create };
};

export default useCreateActionType;
