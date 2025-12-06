import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import useApi from '../../api';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopThingTicketsPieChart = () => {

  const noParentThingTicketCountParams = {
    parent_id: 0,
    open: true,
    include: ['recursive_ticket_count'],
  };

  const api = {
    things: {
      list: useApi.thing.fetchMany(noParentThingTicketCountParams),
    },
  };

  const [thingNames, setThingNames] = useState();
  const [ticketCounts, setTicketCounts] = useState();

  useEffect(() => {
    if (api.things.list.data) {
      const names = api.things.list.data.map((thing) => thing.name);
      const counts = api.things.list.data.map((thing) => thing.recursive_ticket_count || 0);
      setThingNames(names);
      setTicketCounts(counts);
    }
  }, [api.things.list.loading]);


  const data = {
    labels: thingNames,
    datasets: [
      {
        label: "Open Tickets by thing",
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
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white', // Set the font color
        },
      },
    },
  };
  return <Pie data={data} options={options} />;
}

export default TopThingTicketsPieChart;
