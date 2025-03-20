import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar1";

function AddDiscount() {
  const [name, setName] = useState(""); // Thêm state cho tên mã giảm giá
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  // Lấy danh sách danh mục từ backend để hiển thị trong dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/categories") // Điều chỉnh endpoint API theo nhu cầu
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // Xác thực các trường nhập liệu
  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại

    // Kiểm tra tên mã giảm giá
    if (!name) errors.name = "Tên mã giảm giá là bắt buộc.";
    // Kiểm tra giá trị giảm giá
    if (discount === "" || discount < 0)
      errors.discount = "Phần trăm giảm giá phải là số dương.";
    if (!category) errors.category = "Cần chọn danh mục.";
    if (!startDate) errors.startDate = "Ngày bắt đầu là bắt buộc.";
    if (startDate && startDate < today)
      errors.startDate = "Ngày bắt đầu phải là ngày hiện tại hoặc ngày sau đó.";
    if (!endDate) errors.endDate = "Ngày kết thúc là bắt buộc.";
    if (endDate && endDate <= today)
      errors.endDate = "Ngày kết thúc phải lớn hơn ngày hiện tại.";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.date = "Ngày kết thúc phải sau ngày bắt đầu.";
    }
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/api/discounts", {
        // Điều chỉnh endpoint API theo nhu cầu
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, // Gửi tên mã giảm giá
          discount: parseInt(discount),
          category,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Mã giảm giá đã được thêm thành công!");
        setName(""); // Reset trường tên mã giảm giá
        setDiscount("");
        setCategory("");
        setStartDate("");
        setEndDate("");
        setErrorMessages({});
      } else {
        setSuccessMessage("Lỗi khi thêm mã giảm giá, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setSuccessMessage("Lỗi kết nối, vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl font-bold mb-4">Thêm Mã Giảm Giá</h1>
          <form onSubmit={handleSubmit}>
            {/* Trường nhập tên mã giảm giá */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Tên Mã Giảm Giá
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errorMessages.name ? "border-red-500" : ""
                }`}
                placeholder="Nhập tên mã giảm giá"
              />
              {errorMessages.name && (
                <p className="text-red-500 text-sm">{errorMessages.name}</p>
              )}
            </div>

            {/* Trường nhập mã giảm giá */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Giảm giá (%)
              </label>
              <input
                type="text" // Change type to text
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errorMessages.discount ? "border-red-500" : ""
                }`}
                placeholder="Nhập phần trăm giảm giá"
                inputMode="numeric" // Optional: To display numeric keyboard on mobile devices
              />
              {errorMessages.discount && (
                <p className="text-red-500 text-sm">{errorMessages.discount}</p>
              )}
            </div>

            {/* Dropdown danh mục */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Danh Mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errorMessages.category ? "border-red-500" : ""
                }`}
              >
                <option value="">Chọn một danh mục</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errorMessages.category && (
                <p className="text-red-500 text-sm">{errorMessages.category}</p>
              )}
            </div>

            {/* Trường nhập ngày bắt đầu */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Ngày Bắt Đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errorMessages.startDate ? "border-red-500" : ""
                }`}
              />
              {errorMessages.startDate && (
                <p className="text-red-500 text-sm">
                  {errorMessages.startDate}
                </p>
              )}
            </div>

            {/* Trường nhập ngày kết thúc */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Ngày Kết Thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errorMessages.endDate ? "border-red-500" : ""
                }`}
              />
              {errorMessages.endDate && (
                <p className="text-red-500 text-sm">{errorMessages.endDate}</p>
              )}
              {errorMessages.date && (
                <p className="text-red-500 text-sm">{errorMessages.date}</p>
              )}
            </div>

            {/* Nút gửi */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md font-bold hover:bg-blue-600"
            >
              Thêm Mã Giảm Giá
            </button>
          </form>

          {/* Thông báo thành công */}
          {successMessage && (
            <p className="mt-4 text-green-500 font-bold">{successMessage}</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default AddDiscount;
