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
import { formatDate } from '../../util/formatting';

const CompletedThisWeek = () => {
  const lastWeek = new Date();
  const endOfDay = new Date();
  const tzOffset = lastWeek.getTimezoneOffset();
  lastWeek.setMinutes(lastWeek.getMinutes() - tzOffset);
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);
  endOfDay.setMinutes(endOfDay.getMinutes() - tzOffset);
  endOfDay.setHours(23, 59, 59, 999);

  const actionParams = {
    include: ["ticket"],
    action_type_name: "Completed",
    performed_after: lastWeek.toISOString(),
    performed_before: endOfDay.toISOString(),
    page_size: 1000,
  }
  const api = {
    action: {
      list: useApi.action.fetchMany(actionParams, { lazy: false }),
    }
  }

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

  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(formatDate(date.toISOString(), true, true));
  }

  const datasetData = labels.map((_, index) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - index));
    const dateStr = formatDate(targetDate.toISOString(), false, true);

    return api.action.list.data?.filter(a =>
      formatDate(a.performed_at, false, true) === dateStr
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
