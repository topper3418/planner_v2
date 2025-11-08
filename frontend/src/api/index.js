import thingApi from "./thing";
import ticketApi from "./ticket";
import commentApi from "./comment";
import actionApi from "./action";
import milestoneApi from "./milestone";
import userApi from "./user";

const useApi = {
  thing: thingApi,
  ticket: ticketApi,
  comment: commentApi,
  action: actionApi,
  milestone: milestoneApi,
  user: userApi,
};

export default useApi;
