import apiUtils from "../util";
import { toLocalDateString } from "../../util/dates";

const { useFetch } = apiUtils;

const TICKETS_TODOS_URL = "/api/tickets/todos/";

const useFetchTicketTodos = ({ date } = {}) => {
  const dateString = toLocalDateString(date || new Date());
  const { data, loading, error, fetchData } = useFetch(
    TICKETS_TODOS_URL + dateString,
  );

  return { data, loading, error, fetchData };
};

export default useFetchTicketTodos;
