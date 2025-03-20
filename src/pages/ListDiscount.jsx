import Sidebar from "../components/sidebar1";
import { useState, useEffect } from "react";
import axios from "axios";

const ListDiscount = () => {
  const [promotions, setPromotions] = useState([]); // Lưu danh sách khuyến mãi
  const [categories, setCategories] = useState({}); // Lưu thông tin các danh mục theo ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy danh sách khuyến mãi từ API
  useEffect(() => {
    // Lấy danh sách khuyến mãi
    axios
      .get("http://localhost:5000/promotion/list") // Thay bằng endpoint API của bạn
      .then((res) => {
        setPromotions(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", err);
        setError("Không thể tải danh sách khuyến mãi. Vui lòng thử lại sau.");
      })
      .finally(() => setLoading(false)); // Đặt loading thành false khi hoàn tất

    // Lấy danh sách danh mục
    axios
      .get("http://localhost:5000/api/categories") // API lấy danh mục
      .then((res) => {
        const categoryData = res.data.reduce((acc, category) => {
          acc[category._id] = category.category_name; // Lưu danh mục theo ID
          return acc;
        }, {});
        setCategories(categoryData);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục:", err);
        setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      });
  }, []);

  // Hàm xóa khuyến mãi
  const deletePromotion = (promotionId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      axios
        .delete(`http://localhost:5000/promotion/delete/${promotionId}`) // Đảm bảo đúng endpoint
        .then(() => {
          alert("Khuyến mãi đã được xóa!");
          setPromotions(promotions.filter((promo) => promo._id !== promotionId)); // Cập nhật lại danh sách
        })
        .catch((err) => {
          console.error("Lỗi khi xóa khuyến mãi:", err);
          setError("Không thể xóa khuyến mãi. Vui lòng thử lại sau.");
        });
    }
  };

  // Hàm kiểm tra trạng thái hoạt động của khuyến mãi và trả về className phù hợp
  const getPromotionStatus = (endDate) => {
    const currentDate = new Date();
    const promotionEndDate = new Date(endDate);
    if (promotionEndDate >= currentDate) {
      return "text-green-500"; // Màu xanh lá cho "Đang hoạt động"
    } else {
      return "text-yellow-500"; // Màu vàng cho "Đã hết hạn"
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-row">
        <Sidebar />
        <div className="container flex flex-col mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Danh Sách Khuyến Mãi
          </h1>

          {loading && (
            <div className="text-center text-gray-500">Đang tải...</div>
          )}
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          {!loading && promotions.length === 0 && (
            <div className="text-center text-gray-500">
              Hiện chưa có khuyến mãi nào.
            </div>
          )}

          <div className="space-y-4">
            {promotions.map((promo) => (
              <div
                key={promo._id}
                className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-bold">{promo.code}</h2>
                  <p>
                    <strong>Giảm giá:</strong> {promo.discount}%
                  </p>
                  <p>
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {new Date(promo.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ngày kết thúc:</strong>{" "}
                    {new Date(promo.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Danh mục áp dụng:</strong>{" "}
                    {categories[promo.category] || "Không xác định"}
                  </p>
                  <p className={`font-bold ${getPromotionStatus(promo.endDate)}`}>
                    <strong>Status:</strong>{" "}
                    {getPromotionStatus(promo.endDate) === "text-green-500"
                      ? "Đang hoạt động"
                      : "Đã hết hạn"}
                  </p>
                </div>

                {/* Nút xóa */}
                <button
                  onClick={() => deletePromotion(promo._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDiscount;
