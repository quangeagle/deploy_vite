import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar1";
import axios from "axios";

function ListCategory() {
  const [CategoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ category_name: "", NCC: "" });
  const [NCCs, setNCCs] = useState([]);

  useEffect(() => {
    // Fetch NCCs created by admin
    axios
      .get("http://localhost:5000/api/NCC") // Assuming this endpoint fetches all NCC
      .then((res) => setNCCs(res.data))
      .catch((err) => console.error("Error fetching NCC:", err));
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu");
        const data = await response.json();
        setCategoryList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  const handleEditClick = (category) => {
    setEditingCategory(category._id);
    setEditForm({
      category_name: category.category_name,
      NCC: category.NCC._id,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${editingCategory}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      if (!response.ok) throw new Error("Không thể cập nhật");

      const updatedCategory = await response.json();
      setCategoryList(
        CategoryList.map((category) =>
          category._id === editingCategory ? updatedCategory : category
        )
      );
      setEditingCategory(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteCategory = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Không thể xóa");
      setCategoryList(CategoryList.filter((category) => category._id !== id));
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
          Danh sách danh mục
        </h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Tên danh mục
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Nhà cung cấp
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {CategoryList.map((category, index) => (
                <tr
                  key={category._id || index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-left">
                    {category.category_name}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {NCCs.find((ncc) => ncc._id === category.NCC)?.NCC_name ||
                      "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
                        onClick={() => handleEditClick(category)}
                      >
                        Sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200"
                        onClick={() => deleteCategory(category._id)}
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

        {editingCategory && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Chỉnh sửa danh mục
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
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
                  id="CategoryName"
                  name="category_name"
                  placeholder="Nhập tên danh mục"
                  value={editForm.category_name}
                  onChange={handleEditChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] `}
                  required
                />
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
                  name="NCC"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                  placeholder="Chọn nhà cung cấp"
                  onChange={handleEditChange}
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
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition duration-200"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

export default ListCategory;
