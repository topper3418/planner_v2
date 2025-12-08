import thingApi from "./thing";
import ticketApi from "./ticket";
import actionApi from "./action";
import milestoneApi from "./milestone";
import scheduleApi from "./schedule";
import userApi from "./user";

const useApi = {
  thing: thingApi,
  ticket: ticketApi,
  action: actionApi,
  milestone: milestoneApi,
  schedule: scheduleApi,
  user: userApi,
};

export default useApi;
