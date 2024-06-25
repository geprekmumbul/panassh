import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function CustBar({ data, forceRender }) {
  let bgColor = [];
  let tempDataGlobal = Object.values(data.global_temp).map(
    (temp) => temp - data.global_mean_temp
  );
  let labels = Object.keys(data.global_temp);

  for (var i = 0; i < Object.keys(tempDataGlobal).length; i++) {
    if (tempDataGlobal[i] > 0.0) {
      bgColor.push('rgb(255, 64, 43)');
    } else {
      bgColor.push('rgb(41, 205, 255)');
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Difference',
        data: tempDataGlobal,
        backgroundColor: bgColor,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      onComplete: function () {
        ChartJS.defaults.borderColor = '#FFFFFF';
        ChartJS.defaults.color = '#FFFFFF';
      },
    },

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Annual mean difference from 1900-2013 mean',
      },
    },
    // eslint-disable-next-line no-dupe-keys
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: 'Difference from 1900-2013 mean (°C)',
        },
        stacked: true,
      },
    },
  };

  return (
    <Bar
      options={options}
      data={chartData}
      width={'100%'}
      height={'100%'}
      key={forceRender} // Add key prop to force re-render
    />
  );
}
