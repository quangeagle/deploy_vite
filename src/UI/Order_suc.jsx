



import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function OrderSuccess() {
  const location = useLocation();
  const status = new URLSearchParams(location.search).get("status");

  const account_id = localStorage.getItem("userId");
  const orderId = localStorage.getItem("orderId");

  // Hàm gọi API cập nhật trạng thái thanh toán
  const handlePaymentSuccess = async (orderId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/orders/update-payment", {
        orderId: orderId,
        status: 1,
        accountId: account_id
      });

      console.log(response.data.message);

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái thanh toán.");
    }
  };

  if (status === "1" && orderId) {
    handlePaymentSuccess(orderId); 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-4">
          {status === "1" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#4CAF50"
              className="w-16 h-16 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#FF0000"
              className="w-16 h-16 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {status === "1" ? "Đặt Hàng Thành Công!" : "Thanh Toán Thất Bại"}
        </h1>
        <p className="text-gray-600 mb-6">
          {status === "1"
            ? "Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ để xác nhận thông tin và giao hàng sớm nhất có thể."
            : "Đơn hàng chưa được thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
        </p>

   
        {status === "1" && orderId && (
          <p className="text-gray-800 mb-4">
            Mã đơn hàng của bạn: <strong>{orderId}</strong>
          </p>
        )}

        <Link
          to="/home"
          className="block w-full py-2 px-4 rounded-lg text-white font-semibold bg-[#ffd040] hover:bg-[#e0bc36] transition duration-300"
        >
          {status === "1" ? "Về Trang Chủ" : "Thử Lại"}
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
