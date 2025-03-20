import {} from "react";
import { Bar } from "react-chartjs-2";
import PropTypes from 'prop-types'; // Nhập prop-types

const TrafficChart = ({ trafficData }) => {
  // Chuyển đổi dữ liệu traffic thành định dạng biểu đồ
  const chartData = {
    labels: trafficData.map((traffic) => new Date(traffic.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Số lượng traffic theo ngày",
        data: trafficData.map((traffic) => traffic.amount), // Hoặc một trường khác mà bạn muốn thể hiện
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Biểu đồ lưu lượng truy cập theo ngày</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Xác định kiểu dữ liệu cho props
TrafficChart.propTypes = {
  trafficData: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TrafficChart;
