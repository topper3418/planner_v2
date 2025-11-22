import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import useApi from '../../api';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserTicketsPieChart = () => {
  const [userNames, setUserNames] = useState(["No User"]);
  const [ticketCounts, setTicketCounts] = useState([0]);

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

  useEffect(() => {
    if (api.tickets.no_user_count.count !== undefined) {
      setTicketCounts([
        api.tickets.no_user_count.count,
        ...ticketCounts.slice(1),
      ]);
    }
  }, [api.tickets.no_user_count.loading]);

  useEffect(() => {
    if (api.users.list.data) {
      const names = api.users.list.data.map((user) => user.username);
      const counts = api.users.list.data.map((user) => user.ticket_count || 0);
      setUserNames(["No User", ...names]);
      setTicketCounts([ticketCounts[0], ...counts]);
      api.tickets.no_user_count.fetchCount(noUserTicketCountParams);
    }
  }, [api.users.list.loading]);

  const data = {
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
  return <Pie data={data} />;
}

export default UserTicketsPieChart;
