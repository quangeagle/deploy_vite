import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar1";

function ListNCC() {
  const [nccList, setNccList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNCC, setEditingNCC] = useState(null);
  const [editForm, setEditForm] = useState({
    NCC_name: "",
    NCC_address: "",
    NCC_phone: "",
  });

  useEffect(() => {
    const fetchNCC = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/NCC");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu");
        const data = await response.json();
        setNccList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNCC();
  }, []);

  const handleEditClick = (ncc) => {
    setEditingNCC(ncc._id);
    setEditForm({
      NCC_name: ncc.NCC_name,
      NCC_address: ncc.NCC_address,
      NCC_phone: ncc.NCC_phone,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePhoneNumber = (phone) => {
    // Định dạng regex cho số điện thoại (giả định: bắt đầu bằng 0 và có độ dài từ 10-11)
    const phoneRegex = /^(0[1-9]\d{8,9})$/;
    return phoneRegex.test(phone);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của số điện thoại
    if (!validatePhoneNumber(editForm.NCC_phone)) {
      alert("Số điện thoại không hợp lệ! Vui lòng nhập lại.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/NCC/${editingNCC}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      if (!response.ok) throw new Error("Không thể cập nhật");

      const updatedNCC = await response.json();
      setNccList(
        nccList.map((ncc) => (ncc._id === editingNCC ? updatedNCC : ncc))
      );
      setEditingNCC(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteNCC = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhà cung cấp này?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/NCC/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa");
      setNccList(nccList.filter((ncc) => ncc._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

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
          Danh sách nhà cung cấp
        </h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Tên nhà cung cấp
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Địa chỉ
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Số điện thoại
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {nccList.map((NCC, index) => (
                <tr
                  key={NCC._id || index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-left">
                    {NCC.NCC_name}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {NCC.NCC_address}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {NCC.NCC_phone}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
                        onClick={() => handleEditClick(NCC)}
                      >
                        Sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200"
                        onClick={() => deleteNCC(NCC._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingNCC && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Chỉnh sửa nhà cung cấp
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">
                  Tên nhà cung cấp:
                </label>
                <input
                  type="text"
                  name="NCC_name"
                  value={editForm.NCC_name}
                  onChange={handleEditChange}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Địa chỉ:</label>
                <input
                  type="text"
                  name="NCC_address"
                  value={editForm.NCC_address}
                  onChange={handleEditChange}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Số ĐT:</label>
                <input
                  type="text"
                  name="NCC_phone"
                  value={editForm.NCC_phone}
                  onChange={handleEditChange}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-full outline-none"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition duration-200"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNCC(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default ListNCC;
