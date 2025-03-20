import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar1";
import axios from "axios";

function ListProduct() {
  const [ProductList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    product_name: "",
    price: "",
    img: "",
    des_product: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [displayPrice, setDisplayPrice] = useState("");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Fetch categories created by admin
    axios
      .get("http://localhost:5000/api/categories") // Assuming this endpoint fetches all category
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching category:", err));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu");
        const data = await response.json();
        setProductList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    setDisplayPrice(formatCurrency(editForm.price || 0));
  }, [editForm.price]);

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      product_name: product.product_name,
      price: product.price,
      img: product.img,
      des_product: product.des_product,
      category: product.category._id,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleProductPriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Chỉ cho phép số
    setEditForm((prevForm) => ({ ...prevForm, price: rawValue })); // Lưu giá trị số thô
  };

  const handlePriceFocus = () => {
    setDisplayPrice(editForm.price);
  };

  const handlePriceBlur = () => {
    setDisplayPrice(formatCurrency(editForm.price || 0));
  };

  const handleImageChange = (e) => {
    setEditForm((prevForm) => ({ ...prevForm, img: e.target.value })); // Cập nhật URL hình ảnh
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 1000) {
      setEditForm((prev) => ({ ...prev, des_product: text })); // Cập nhật đúng thuộc tính des_product
      setCharCount(text.length);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );
      if (!response.ok) throw new Error("Không thể cập nhật");

      const updatedProduct = await response.json();
      setProductList(
        ProductList.map((product) =>
          product._id === editingProduct ? updatedProduct : product
        )
      );
      setEditingProduct(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Không thể xóa");
      setProductList(ProductList.filter((product) => product._id !== id));
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
          Danh sách sản phẩm
        </h1>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Hình ảnh sản phẩm
                </th>
                <th className="py-3 px-4 border-b text-left text-gray-700">
                  Tên sản phẩm
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Code
                </th>
                <th className="py-3 px-4 border-b text-right text-gray-700">
                  Giá sản phẩm
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {ProductList.map((product, index) => (
                <tr
                  key={product._id || index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-2 px-4 border-b text-left">
                    <img
                      src={product.img}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {product.product_name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {product._id}
                  </td>{" "}
                  <td className="py-2 px-4 border-b text-right">
                    {formatCurrency(product.price) + " VND"}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
                        onClick={() => handleEditClick(product)}
                      >
                        Sửa
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200"
                        onClick={() => deleteProduct(product._id)}
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

        {editingProduct && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Chỉnh sửa sản phẩm
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Nhập tên sản phẩm  */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
                  htmlFor="ProductName"
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  id="ProductName"
                  name="product_name"
                  placeholder="Nhập tên sản phẩm"
                  value={editForm.product_name}
                  onChange={handleEditChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] `}
                  required
                />
              </div>

              {/* Nhập giá sản phẩm  */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
                  htmlFor="ProductPrice"
                >
                  Giá sản phẩm
                </label>
                <input
                  type="text"
                  id="ProductPrice"
                  name="price"
                  placeholder="Nhập giá sản phẩm"
                  value={displayPrice}
                  onChange={handleProductPriceChange}
                  onFocus={handlePriceFocus}
                  onBlur={handlePriceBlur}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                  required
                />
              </div>

              {/* Nhập URL hình ảnh */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
                  htmlFor="ProductImg"
                >
                  URL hình ảnh sản phẩm
                </label>
                <input
                  type="text" // Sử dụng đầu vào văn bản
                  id="ProductImg"
                  placeholder="Nhập URL hình ảnh"
                  value={editForm.img}
                  onChange={handleImageChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] `}
                />
              </div>

              {/* Mô tả sản phẩm */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
                  htmlFor="ProductDes"
                >
                  Mô tả sản phẩm
                </label>
                <textarea
                  id="ProductDes"
                  placeholder="Nhập mô tả sản phẩm (tối đa 150 ký tự)"
                  value={editForm.des_product}
                  onChange={handleDescriptionChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                  maxLength={1000}
                />
                <p className="text-gray-500 text-sm">{charCount}/1000 ký tự</p>
              </div>

              {/* Chọn danh mục  */}
              <div className="mb-4">
                <label
                  htmlFor="CategoryId"
                  className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
                >
                  Danh mục
                </label>
                <select
                  id="CategoryId"
                  name="Category"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                  placeholder="Chọn danh mục"
                  onChange={handleEditChange}
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
                  onClick={() => setEditingProduct(null)}
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

export default ListProduct;
