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
  import { Line } from 'react-chartjs-2';

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

  const CustLine = ({ data}) => {
    console.log(data);
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        onComplete: function () {
          ChartJS.defaults.borderColor = '#FFFFFF';
          ChartJS.defaults.color = '#FFFFFF';
        },
      },
      elements: {
        point:{
          radius: 0
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: `${data.properties.ADMIN} annual surface temperature`,
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
            text: 'Surface temperature (°C)',
          },
          stacked: true,
        },
      },
    };
  
    let labels = Object.keys(data.properties.TEMPERATURES);
  
    // Use data props instead of chartDataCountry state
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperature',
          data: Object.values(data.properties.TEMPERATURES),
          borderColor: 'rgb(255, 64, 43)',
        },
      ],
    };
  
    return (
      <Line
        options={options}
        data={chartData}
        width={'100%'}
        height={'50%'}
      />
    );
  };
  
  export default CustLine;