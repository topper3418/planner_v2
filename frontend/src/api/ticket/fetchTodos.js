import apiUtils from "../util";

const { useFetch } = apiUtils;

const TICKETS_TODOS_URL = "/api/tickets/todos/";

const useFetchTicketTodos = ({ date } = {}) => {
  if (!date) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;
  const { data, loading, error, fetchData } = useFetch(
    TICKETS_TODOS_URL + dateString,
  );

  return { data, loading, error, fetchData };
};

export default useFetchTicketTodos;
