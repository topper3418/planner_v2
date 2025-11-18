import apiUtils from "../util";

const { useFetchOne } = apiUtils;

// url
const ACTION_TYPES_URL = "/api/actions/types/";

const useFetchActionType = (actionTypeId = undefined) => {
  const { data, loading, error, fetchOne } = useFetchOne(
    ACTION_TYPES_URL,
    actionTypeId,
  );

  // return state and the fetch function
  return { data, loading, error, fetchOne };
};

export default useFetchActionType;
