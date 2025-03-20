import { useState } from "react";
import Sidebar from "../components/sidebar1";

function ViewOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    if (!orderId.trim()) {
      setError("Vui lòng nhập mã đơn hàng");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/details/${orderId}`
      );
      if (!response.ok) {
        if (response.status === 404)
          throw new Error("Không tìm thấy đơn hàng này");
        throw new Error("Lỗi trong quá trình lấy dữ liệu");
      }

      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      setError(error.message);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Tra cứu đơn hàng
        </h1>

        {/* Input tìm kiếm */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            Nhập mã đơn hàng:
          </label>
          <div className="flex">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="VD: 12345"
              className="p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 flex-1 outline-none"
            />
            <button
              onClick={fetchOrderDetails}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-200"
            >
              Tra cứu
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        {/* Hiển thị chi tiết đơn hàng */}
        {loading ? (
          <p className="text-lg">Đang tải...</p>
        ) : orderDetails ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Chi tiết đơn hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <p>
                <strong>Mã đơn hàng:</strong> {orderDetails._id}
              </p>
              <p>
                <strong>Tên khách hàng:</strong> {orderDetails.customer}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {orderDetails.address}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {orderDetails.phone}
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {new Date(orderDetails.date).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <strong>Giờ đặt:</strong> {orderDetails.time}
              </p>
              <p>
                <strong>Thanh toán:</strong>{" "}
                {orderDetails.is_payment ? "Đã thanh toán" : "Chưa thanh toán"}
              </p>
              <p>
                <strong>Phương thức:</strong> {orderDetails.payment_method}
              </p>
            </div>
            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800">
              Sản phẩm:
            </h3>
            <table className="min-w-full border-collapse bg-gray-100">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                  <th className="py-2 px-4 border-b text-center">Số lượng</th>
                  <th className="py-2 px-4 border-b text-right">Giá</th>
                  <th className="py-2 px-4 border-b text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-200 transition duration-200"
                  >
                    <td className="py-2 px-4 border-b">
                      {item.product_id.product_name}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {item.product_id.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {(item.product_id.price * item.quantity).toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-right font-bold">
                    Tổng cộng:
                  </td>
                  <td className="py-2 px-4 text-right font-bold">
                    {orderDetails.items
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
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default ViewOrder;
