import apiUtils from "../util";

const { useFetch } = apiUtils;

const ACTION_TYPES_URL = "/api/actions/types/";

const useFetchActionTypes = () => {
  const { data, loading, error, fetchData } = useFetch(ACTION_TYPES_URL);

  return { data, loading, error, fetchData };
};

export default useFetchActionTypes;
