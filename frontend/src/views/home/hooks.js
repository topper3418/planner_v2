import { useEffect, useState } from "react";

import useApi from "../../api";
import components from "../../components";
import useTicketQueryParams from "../../queryParams/useTicketQueryParams";
import useViewNavigation from "../../navigation";

const {
  details: {
    controllers: { useMilestoneModalControl },
  },
} = components;

const useHomeViewHooks = () => {
  // URL State
  const navigation = useViewNavigation();
  const ticketParams = useTicketQueryParams(navigation.getQueryParam);
  // API object
  // or just do the api inside each object?
  const noUserTicketCountParams = {
    user_id: 0,
    open: true,
  };
  const api = {
    users: {
      list: useApi.user.fetchMany(),
    },
    tickets: {
      no_user_count: useApi.ticket.fetchCount(noUserTicketCountParams, {
        lazy: true,
      }),
    },
  };
  // get open schleduled tasks
  // get next upcoming milestone
  // get all milestones and their tickets, order by date
  // be able to navigate to any of the things clicke don
  // go to tickets, milestones, users, etc
  const [userNames, setUserNames] = useState(["No User"]);
  const [ticketCounts, setTicketCounts] = useState([0]);
  useEffect(() => {
    console.log("user count no user: ", api.tickets.no_user_count);
    if (api.tickets.no_user_count.count !== undefined) {
      console.log("count is there: ", api.tickets.no_user_count.count);
      setTicketCounts([
        api.tickets.no_user_count.count,
        ...ticketCounts.slice(1),
      ]);
    }
  }, [api.tickets.no_user_count.loading]);

  useEffect(() => {
    if (api.users.list.data) {
      console.log("usernames: ", api.users.list.data);
      const names = api.users.list.data.map((user) => user.username);
      const counts = api.users.list.data.map((user) => user.ticket_count || 0);
      setUserNames(["No User", ...names]);
      setTicketCounts([ticketCounts[0], ...counts]);
      api.tickets.no_user_count.fetchCount(noUserTicketCountParams);
    }
  }, [api.users.list.loading]);

  console.log("ticket counts: ", ticketCounts);

  const userTicketCountPieData = {
    labels: userNames,
    datasets: [
      {
        label: "Open Tickets by User",
        data: ticketCounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };
  return {
    api,
    ticketParams,
    userTicketCountPieData,
  };
};

export default useHomeViewHooks;
