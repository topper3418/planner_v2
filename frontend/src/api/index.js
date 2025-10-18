import thingApi from "./thing";
import ticketApi from "./ticket";
import commentApi from "./comment";
import actionApi from "./action";

const useApi = {
  thing: thingApi,
  ticket: ticketApi,
  comment: commentApi,
  action: actionApi,
};

export default useApi;
