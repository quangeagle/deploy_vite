import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar1";
import axios from "axios";

function ListKho() {
  const [khoList, setKhoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");

  useEffect(() => {
    const fetchKho = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/kho");
        setKhoList(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKho();
  }, []);

  // Hàm lấy thông tin chi tiết sản phẩm
  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${productId}`
      );
      return response.data; // { _id, product_name, img, ... }
    } catch (error) {
      console.error("Error fetching product details:", error);
      return {};
    }
  };

  const handleAddClick = (productId) => {
    setAddingProduct(productId);
    setQuantityToAdd("");
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value.replace(/\./g, ""), 10);
    if (value > 1000000) {
      setQuantityToAdd("1000000");
    } else if (value < 1) {
      setQuantityToAdd("1");
    } else {
      setQuantityToAdd(value.toString()); // Remove formatting
    }
  };

  const handleNewProductQuantityChange = (e) => {
    const value = parseInt(e.target.value.replace(/\./g, ""), 10);
    if (value > 1000000) {
      setNewProductQuantity("1000000");
    } else if (value < 1) {
      setNewProductQuantity("1");
    } else {
      setNewProductQuantity(value.toString()); // Remove formatting
    }
  };

  const handleAddSubmit = async () => {
    try {
      await axios.patch("http://localhost:5000/api/kho/add", {
        productId: addingProduct,
        quantity: parseInt(quantityToAdd),
      });
      setKhoList((prevKhoList) =>
        prevKhoList.map((item) =>
          item.Product._id === addingProduct
            ? { ...item, quantity: item.quantity + parseInt(quantityToAdd) }
            : item
        )
      );
      setAddingProduct(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Xử lý khi bấm nút "Thêm sản phẩm mới vào kho"
  const handleAddNewProduct = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/kho/add", {
        productId: newProductId,
        quantity: parseInt(newProductQuantity),
      });
      const newProduct = await fetchProductDetails(newProductId);
      setKhoList([...khoList, { ...response.data, Product: newProduct }]);
      setShowAddProductModal(false);
      setNewProductId("");
      setNewProductQuantity("");
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
          Quản lý kho
        </h1>

        {/* Nút mở modal thêm sản phẩm */}
        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition duration-200"
        >
          Thêm sản phẩm mới vào kho
        </button>

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
                  Số lượng
                </th>
                <th className="py-3 px-4 border-b text-center text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
  {khoList.map((item) => (
    <tr key={item.Product?._id || item.Product} className="hover:bg-gray-100 transition duration-200">
      <td className="py-2 px-4 border-b text-left">
        {/* Kiểm tra xem item.Product có tồn tại không và có ảnh không */}
        {item.Product?.img ? (
          <img
            src={item.Product.img}
            alt={item.Product.product_name}
            className="w-16 h-16 object-cover"
          />
        ) : (
          <span>Không có ảnh</span> // Hiển thị nếu không có ảnh
        )}
      </td>
      <td className="py-2 px-4 border-b text-left">
        {/* Kiểm tra sự tồn tại của tên sản phẩm */}
        {item.Product?.product_name || 'Chưa có tên'}
      </td>
      <td className="py-2 px-4 border-b text-center">
        {item.quantity}
      </td>
      <td className="py-2 px-4 border-b text-center">
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => handleAddClick(item.Product?._id || item.product)} // Sử dụng item.product khi không có Product
        >
          Nhập hàng
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {/* Modal thêm sản phẩm mới */}
        {showAddProductModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Thêm sản phẩm vào kho
              </h2>
              <input
                type="text"
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                placeholder="Nhập ID sản phẩm"
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
              />
              <input
                type="number"
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                placeholder="Nhập số lượng"
                value={newProductQuantity}
                onChange={handleNewProductQuantityChange}
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddNewProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {addingProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                Nhập số lượng
              </h2>
              <input
                type="number"
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
                placeholder="Nhập số lượng"
                value={quantityToAdd}
                onChange={handleQuantityChange}
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setAddingProduct(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ListKho;
