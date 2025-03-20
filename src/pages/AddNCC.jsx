import { useState } from "react";
import Sidebar from '../components/sidebar1';


const AddNCC = () => {
  const [NCCName, setNCCName] = useState("");
  const [NCCPhone, setNCCPhone] = useState("");
  const [NCCAddress, setNCCAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  // Hàm kiểm tra hợp lệ của thông tin
  const validateForm = () => {
    const newErrorMessages = {};
    const phoneRegex = /^0\d{9}$/; // Số điện thoại bắt đầu bằng 0 và có 10 chữ số

    if (!NCCName.trim()) {
      newErrorMessages.NCCName = "Tên nhà cung cấp không được để trống.";
    }
    if (!phoneRegex.test(NCCPhone)) {
      newErrorMessages.NCCPhone = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
    }
    if (!NCCAddress.trim()) {
      newErrorMessages.NCCAddress = "Địa chỉ không được để trống.";
    }

    setErrorMessages(newErrorMessages); // Cập nhật thông báo lỗi
    return Object.keys(newErrorMessages).length === 0; // Trả về true nếu không có lỗi
  };

  // Hàm xử lý gửi dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Nếu không hợp lệ, dừng lại

    try {
      const response = await fetch("http://localhost:5000/api/NCC", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NCC_name: NCCName,
          NCC_phone: NCCPhone,
          NCC_address: NCCAddress,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Thêm nhà cung cấp thành công!");
        setNCCName("");
        setNCCPhone("");
        setNCCAddress("");
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
        <h1 className="text-3xl font-bold mb-6">Thêm nhà cung cấp</h1>
        <form
          className="bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
              htmlFor="NCCName"
            >
              Tên nhà cung cấp
            </label>
            <input
              type="text"
              id="NCCName"
              placeholder="Nhập tên nhà cung cấp"
              value={NCCName}
              onChange={(e) => setNCCName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.NCCName ? "border-red-500" : ""}`}
            />
            {errorMessages.NCCName && <p className="text-red-500 text-sm">{errorMessages.NCCName}</p>} {/* Thông báo lỗi cho tên nhà cung cấp */}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
              htmlFor="NCCPhone"
            >
              Số điện thoại nhà cung cấp
            </label>
            <input
              type="text" // Sử dụng type text để dễ dàng validate số điện thoại
              id="NCCPhone"
              placeholder="Nhập số điện thoại"
              value={NCCPhone}
              onChange={(e) => setNCCPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.NCCPhone ? "border-red-500" : ""}`}
            />
            {errorMessages.NCCPhone && <p className="text-red-500 text-sm">{errorMessages.NCCPhone}</p>} {/* Thông báo lỗi cho số điện thoại */}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
              htmlFor="NCCAddress"
            >
              Địa chỉ nhà cung cấp
            </label>
            <input
              type="text"
              id="NCCAddress"
              placeholder="Nhập địa chỉ nhà cung cấp"
              value={NCCAddress}
              onChange={(e) => setNCCAddress(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.NCCAddress ? "border-red-500" : ""}`}
            />
            {errorMessages.NCCAddress && <p className="text-red-500 text-sm">{errorMessages.NCCAddress}</p>} {/* Thông báo lỗi cho địa chỉ */}
          </div>
          <button
            type="submit"
            className="bg-[#ffd040] text-white font-bold py-2 px-4 rounded hover:bg-[#e6b800] focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
          >
            Thêm nhà cung cấp
          </button>
        </form>
        {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      </main>
    </div>
  );
};

export default AddNCC;
