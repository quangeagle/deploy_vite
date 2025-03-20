import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductBlock from "./ProductBlock";
import Header from "./Header";
import Footer from "./Footer";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Fetch sản phẩm theo danh mục
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/category/${categoryId}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (categoryId) fetchProducts();
  }, [categoryId]);

  // Fetch tên danh mục
  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/categories/${categoryId}`
        );
        setCategoryName(response.data.name);
      } catch (error) {
        console.error("Error fetching category name:", error);
      }
    };

    if (categoryId) fetchCategoryName();
  }, [categoryId]);

  // Hàm sắp xếp danh sách sản phẩm
  const sortProducts = (option) => {
    const sortedProducts = [...products];
    if (option === "name") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  // Xử lý khi thay đổi loại sắp xếp
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
    sortProducts(option);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
          {/* Tiêu đề */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              {categoryName || "Danh mục"}
            </h2>
            <p className="text-gray-600">
              Khám phá những sản phẩm chất lượng từ danh mục này
            </p>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4"></div>
          </div>

          {/* Dropdown sắp xếp */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-lg text-gray-700">
              Hiển thị {products.length} sản phẩm
            </p>
            <div>
              <label htmlFor="sort" className="mr-2 text-gray-800 font-medium">
                Sắp xếp:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg p-2 shadow-sm text-gray-700 hover:bg-gray-100"
              >
                <option value="">Mặc định</option>
                <option value="name">Theo tên (A-Z)</option>
                <option value="price-asc">Theo giá (tăng dần)</option>
                <option value="price-desc">Theo giá (giảm dần)</option>
              </select>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductBlock
                  key={product._id}
                  product={product}
                  className="transition-transform transform hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden bg-white shadow-md p-4"
                />
              ))
            ) : (
              <p className="text-center text-gray-600">
                Không tìm thấy sản phẩm trong danh mục này.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
