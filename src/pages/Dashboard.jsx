// Dashboard.js
import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import Sidebar from '../components/sidebar1'; // Import Sidebar component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

// Dữ liệu biểu đồ doanh số
const salesData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Doanh số ($)",
      data: [12000, 15000, 10000, 18000, 19000, 22000],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0); // Trạng thái cho số lượng người dùng

  // Hàm gọi API để lấy số lượng người dùng
  const fetchUserCount = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/accounts/count"); // Gọi endpoint mới
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Data received:", data);

      // Kiểm tra nếu data.count có sẵn
      if (data && data.count !== undefined) {
        setUserCount(data.count);
      } else {
        console.error("Count not found in response data");
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  useEffect(() => {
    fetchUserCount(); // Gọi API khi component được mount
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div className="bg-white p-4 rounded shadow flex flex-col justify-center items-center">
            <h2 className="text-lg font-semibold mb-2 text-blue-400">Số lượng người dùng</h2>
            <p className="text-2xl text-red-500">{userCount}</p>
            <h2 className="text-lg font-semibold mb-2 text-blue-400">Hiện đã tạo tài khoản sử dụng</h2>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Doanh số</h2>
            <Bar data={salesData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
