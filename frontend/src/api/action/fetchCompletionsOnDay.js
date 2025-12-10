import apiUtils from "../util";

const { useFetch } = apiUtils;

const ACTIONS_URL = "/api/actions/completions/";

const useFetchCompletionsOnDay = ({ date } = {}) => {
  if (!date) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  const { data, loading, error, fetchData } = useFetch(
    ACTIONS_URL + dateString,
  );

  return { data, loading, error, refetch: fetchData };
};

export default useFetchCompletionsOnDay;
