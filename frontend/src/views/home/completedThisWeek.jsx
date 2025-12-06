import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import useApi from "../../api";
import { Card } from 'antd';

const CompletedThisWeek = () => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const actionParams = {
    include: ["ticket"],
    action_type_name: "Completed",
    performed_after: lastWeek.toISOString(),
    page_size: 1000,
  }
  const api = {
    action: {
      list: useApi.action.fetchMany(actionParams, { lazy: false }),
    }
  }

  console.log("CompletedThisWeek actions:", api.action.list.data);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        // no legend
        display: false,
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },        // X axis label color
        grid: { color: 'white' },         // X grid lines
        border: { color: 'white' }        // X axis line color (v3.7+)
      },
      y: {
        ticks: { color: 'white' },        // Y axis label color
        grid: { color: 'white' },
        border: { color: 'white' }        // Y axis line color
      }
    }
  };

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // labels should be the last 7 day strings
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(daysOfWeek[date.getDay()]);
  }
  // Now matches data order: 6 days ago → today
  // list of actions from api have date strings
  // count the number of actions per day
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const count = api.action.list.data?.filter(action => {
      const actionDate = new Date(action.performed_at);
      return actionDate.toISOString().split('T')[0] === dateString;
    }).length ?? 0;

    data.push(count);  // push in order: oldest → newest
  }

  const datasetData = labels.map((_, index) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - index));
    const dateStr = targetDate.toISOString().split('T')[0];

    return api.action.list.data?.filter(a =>
      new Date(a.performed_at).toISOString().split('T')[0] === dateStr
    ).length ?? 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completed Tickets',
        data: datasetData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  return (
    <Card
      title={`Completed Tickets This Week (${api.action.list.data?.length || 0})`}
      style={{ minHeight: "400px", width: "50%" }}>
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        <Bar options={options} data={chartData} />
      </div>
    </Card>
  );
}

export default CompletedThisWeek;
