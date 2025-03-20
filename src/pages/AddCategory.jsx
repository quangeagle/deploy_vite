import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar1";
import axios from "axios";

const AddCategory = () => {
  const [CategoryName, setCategoryName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [NCCs, setNCCs] = useState([]);

  useEffect(() => {
    // Fetch NCCs created by admin
    axios
      .get("http://localhost:5000/api/NCC")
      .then((res) => setNCCs(res.data))
      .catch((err) => console.error("Error fetching NCC:", err));
  }, []);

  // Hàm kiểm tra hợp lệ của thông tin
  const validateForm = () => {
    const newErrorMessages = {};

    if (!CategoryName.trim()) {
      newErrorMessages.CategoryName = "Tên nhà cung cấp không được để trống.";
    }

    setErrorMessages(newErrorMessages); // Cập nhật thông báo lỗi
    return Object.keys(newErrorMessages).length === 0; // Trả về true nếu không có lỗi
  };

  // Hàm xử lý gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Nếu không hợp lệ, dừng lại

    const NCCId = document.getElementById("NCCId").value;

    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_name: CategoryName,
          NCC: NCCId,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Thêm danh mục thành công!");
        setCategoryName("");
        setErrorMessages({}); // Reset thông báo lỗi
      } else {
        setSuccessMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      setSuccessMessage("Lỗi kết nối, vui lòng thử lại.", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Thêm danh mục</h1>
        <form
          className="bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Nhập tên danh mục  */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
              htmlFor="CategoryName"
            >
              Tên danh mục
            </label>
            <input
              type="text"
              id="CateogryName"
              placeholder="Nhập tên nhà cung cấp"
              value={CategoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${
                errorMessages.CategoryName ? "border-red-500" : ""
              }`}
            />
            {errorMessages.CategoryName && (
              <p className="text-red-500 text-sm">
                {errorMessages.CategoryName}
              </p>
            )}{" "}
          </div>

          {/* Chọn nhà cung cấp  */}
          <div className="mb-4">
            <label
              htmlFor="NCCId"
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
            >
              Nhà cung cấp
            </label>
            <select
              id="NCCId"
              name="NCCId"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
              placeholder="Chọn nhà cung cấp"
            >
              <option value="">Chọn nhà cung cấp</option>
              {NCCs.map((NCC) => (
                <option
                  className="text-slate-950"
                  key={NCC._id}
                  value={NCC._id}
                >
                  {NCC.NCC_name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#ffd040] text-white font-bold py-2 px-4 rounded hover:bg-[#e6b800] focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
          >
            Thêm danh mục
          </button>
        </form>
        {successMessage && (
          <p className="mt-4 text-green-500">{successMessage}</p>
        )}
      </main>
    </div>
  );
};

export default AddCategory;
