import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar1";

const CreatePromotion = () => {
  const [categories, setCategories] = useState([]);
  const [promotion, setPromotion] = useState({
    code: "",
    discount: 0,
    categoryId: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Lấy danh mục từ API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateInputs = () => {
    const { code, discount, categoryId, startDate, endDate } = promotion;
    if (!code || !discount || !categoryId || !startDate || !endDate) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    if (discount <= 0 || discount > 100) {
      setError("Giảm giá phải nằm trong khoảng 1-100%.");
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return false;
    }
    setError("");
    return true;
  };

  const createPromotion = () => {
    if (!validateInputs()) return;

    setLoading(true);
    setSuccess(false);

    axios
      .post("http://localhost:5000/promotion/add", promotion)
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setPromotion({
          code: "",
          discount: 0,
          categoryId: "",
          startDate: "",
          endDate: "",
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error("Lỗi khi tạo khuyến mãi:", err);
        setError("Không thể tạo khuyến mãi. Vui lòng thử lại sau.");
      });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-row">
        <Sidebar />
        <div className="container flex flex-col mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Tạo Khuyến Mãi
          </h1>

          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-600 text-center">
              Khuyến mãi đã được tạo thành công!
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              name="code"
              value={promotion.code}
              onChange={handleChange}
              placeholder="Tên khuyến mãi"
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="discount"
              value={promotion.discount}
              onChange={handleChange}
              placeholder="Discount (%)"
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="startDate"
              value={promotion.startDate}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="endDate"
              value={promotion.endDate}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              id="categoryId"
              name="categoryId"
              value={promotion.categoryId}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
              onChange={handleChange}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option
                  className="text-slate-950"
                  key={category._id}
                  value={category._id}
                >
                  {category.category_name}
                </option>
              ))}
            </select>

            <button
              onClick={createPromotion}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-md text-white transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Đang xử lý..." : "Tạo khuyến mãi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotion;
