import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar1";

const AddProduct = () => {
  const [ProductName, setProductName] = useState("");
  const [ProductPrice, setProductPrice] = useState(""); // Lưu giá dưới dạng chuỗi
  const [ProductImg, setProductImg] = useState(""); // Lưu dưới dạng chuỗi (URL)
  const [ProductDes, setProductDes] = useState("");
  const [ProductDis, setProductDis] = useState("");
  const [ProductNewPrice, setProductNewPrice] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  }, []);

  // const formatCurrency = (value) => {
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(value);
  // };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validateForm = () => {
    const newErrorMessages = {};

    if (!ProductName.trim()) {
      newErrorMessages.ProductName = "Tên sản phẩm không được để trống.";
    }
    if (!ProductPrice.trim()) {
      newErrorMessages.ProductPrice = "Giá sản phẩm không được để trống.";
    }
    if (!ProductImg.trim()) {
      newErrorMessages.ProductImg = "Hình ảnh sản phẩm không được để trống.";
    }

    setErrorMessages(newErrorMessages);
    return Object.keys(newErrorMessages).length === 0;
  };

  const handleProductPriceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Lọc bỏ ký tự không phải số
    setProductPrice(rawValue); // Lưu giá trị thô
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= 1000) {
      setProductDes(text);
      setCharCount(text.length);
    }
  };

  const handleImageChange = (e) => {
    setProductImg(e.target.value); // Lưu URL hình ảnh
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const CategoryId = document.getElementById("CategoryId").value;
    if (!CategoryId) {
      setErrorMessages((prev) => ({
        ...prev,
        CategoryId: "Vui lòng chọn danh mục sản phẩm.",
      }));
      return;
    }

    try {
      const formData = {
        product_name: ProductName,
        price: parseFloat(ProductPrice), // Chuyển giá về số thực
        img: ProductImg, // Sử dụng URL hình ảnh
        des_product: ProductDes,
        category: CategoryId,
        discount: ProductDis,
        newPrice: ProductNewPrice.replace(/[^0-9]/g, ""), // Chuyển đổi giá mới về dạng số
      };

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Thêm sản phẩm thành công!");
        setProductName("");
        setProductPrice("");
        setProductImg("");
        setProductDes("");
        setProductDis("");
        setCharCount(0);
        setProductNewPrice("");
        setErrorMessages({});
      } else {
        setSuccessMessage("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      setSuccessMessage("Lỗi kết nối, vui lòng thử lại.");
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm</h1>
        <form
          className="bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {/* Tên sản phẩm */}
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
              placeholder="Nhập tên sản phẩm"
              value={ProductName}
              onChange={(e) => setProductName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.ProductName ? "border-red-500" : ""
                }`}
            />
            {errorMessages.ProductName && (
              <p className="text-red-500 text-sm">
                {errorMessages.ProductName}
              </p>
            )}
          </div>

          {/* Giá sản phẩm */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
              htmlFor="ProductPrice"
            >
              Giá sản phẩm
            </label>
            <input
              type="text" // Để nhập giá dưới dạng văn bản
              id="ProductPrice"
              placeholder="Nhập giá sản phẩm"
              value={formatCurrency(ProductPrice) + " VNĐ"} // Hiển thị giá đã định dạng
              onChange={handleProductPriceChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.ProductPrice ? "border-red-500" : ""
                }`}
            />
            {errorMessages.ProductPrice && (
              <p className="text-red-500 text-sm">
                {errorMessages.ProductPrice}
              </p>
            )}
          </div>

          {/* Chọn danh mục sản phẩm */}
          <div className="mb-4">
            <label
              htmlFor="CategoryId"
              className="block text-gray-700 text-[17px] font-bold mb-2 text-left"
            >
              Danh mục sản phẩm
            </label>
            <select
              id="CategoryId"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {errorMessages.CategoryId && (
              <p className="text-red-500 text-sm">{errorMessages.CategoryId}</p>
            )}
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
              value={ProductImg}
              onChange={handleImageChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040] ${errorMessages.ProductImg ? "border-red-500" : ""
                }`}
            />
            {errorMessages.ProductImg && (
              <p className="text-red-500 text-sm">{errorMessages.ProductImg}</p>
            )}
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
              value={ProductDes}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffd040]"
              maxLength={1000}
            />
            <p className="text-gray-500 text-sm">{charCount}/1000 ký tự</p>
          </div>

          {/* Thông báo thành công hoặc lỗi */}
          {successMessage && (
            <div className="mb-4">
              <p className="text-green-500">{successMessage}</p>
            </div>
          )}

          {/* Nút thêm sản phẩm */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#ffd040] text-white font-bold rounded-md hover:bg-[#ffbd40]"
          >
            Thêm sản phẩm
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
