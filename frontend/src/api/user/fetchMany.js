import apiUtils from "../util";

const { useFetch } = apiUtils;

const USERS_URL = "/api/users/";

const useFetchUsers = () => {
  const { data, loading, error, fetchData } = useFetch(USERS_URL);

  return { data, loading, error, fetchData };
};

export default useFetchUsers;
