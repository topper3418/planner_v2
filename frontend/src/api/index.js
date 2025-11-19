import thingApi from "./thing";
import ticketApi from "./ticket";
import commentApi from "./comment";
import actionApi from "./action";
import milestoneApi from "./milestone";
import scheduleApi from "./schedule";
import userApi from "./user";

const useApi = {
  thing: thingApi,
  ticket: ticketApi,
  comment: commentApi,
  action: actionApi,
  milestone: milestoneApi,
  schedule: scheduleApi,
  user: userApi,
};

export default useApi;
