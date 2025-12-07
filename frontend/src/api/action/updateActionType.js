import apiUtils from "../util";

const { useUpdate } = apiUtils;

const ACTION_TYPE_UPDATE_URL = "/api/actions/types";

const useUpdateActionType = () => {
  const { data, loading, error, update } = useUpdate(ACTION_TYPE_UPDATE_URL);
  return { data, loading, error, update };
};

export default useUpdateActionType;
