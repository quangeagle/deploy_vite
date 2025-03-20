import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import Sidebar from "../components/sidebar1";

function ListOrder() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Sử dụng navigate để chuyển hướng

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu đơn hàng");
        const data = await response.json();
        setOrderList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Lỗi: {error}</p>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Danh sách đơn hàng
        </h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Mã đơn hàng
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Tên khách hàng
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Tổng tiền
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Thanh toán
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-left">{order._id}</td>
                  <td className="py-2 px-4 border-b text-left">
                    {order.customer}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {order.items
                      .reduce(
                        (total, item) =>
                          total + item.product_id.price * item.quantity,
                        0
                      )
                      .toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {order.is_payment ? "Đã thanh toán" : "Chưa thanh toán"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ListOrder;
