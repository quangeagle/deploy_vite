import { useEffect, useState } from "react";
import axios from "axios";
import SwiperSection from "./SwiperSection";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import ProductBlock from "./ProductBlock";
import Footer from "./Footer";
import Header from "./Header";

const groupProducts = (products, itemsPerGroup) => {
  return products.reduce((result, product, index) => {
    const groupIndex = Math.floor(index / itemsPerGroup);
    if (!result[groupIndex]) result[groupIndex] = [];
    result[groupIndex].push(product);
    return result;
  }, []);
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setGroupedProducts(groupProducts(res.data, 5));
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const swiperImages = [
    "logo2.png",
    "logo3.png",
    "logo10.png",
    "logo4.png",
    "logo8.png",
    "logo6.png",
    "logo5.png",
  ];

  return (
    <div className="bg-slate-100 relative">
      <Header />

      {/* Swiper Slider Section */}
      <div className="mb-10" style={{ height: "400px" }}>
        <SwiperSection images={swiperImages} />
      </div>

      {/* Top Image Cards */}
      <div className="sm:mx-8 lg:mx-32 mt-20"> {/* Adjusted margin-top */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
          {["sale1.jpg", "sale2.jpg", "sale3.jpg"].map((imgSrc, idx) => (
            <div
              key={idx}
              className="relative flex-1 h-52 overflow-hidden rounded-lg border border-gray-300"
            >
              <img
                src={imgSrc}
                alt={`Promotion ${idx + 1}`}
                className="w-full h-full object-cover transition-transform transform hover:scale-110 hover:opacity-80"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
                {idx === 0
                  ? "NO BRAND"
                  : idx === 1
                    ? "NÔNG SẢN SẠCH"
                    : "CHỈ CÓ TRÊN EMART"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="h-auto bg-white mx-4 sm:mx-8 lg:mx-32 mt-16">
        <div className="pt-5 pl-6 pb-4 font-bold text-xl border-b-4">
          SẢN PHẨM BÁN CHẠY
        </div>
        <div className="flex flex-wrap gap-6">
          {groupedProducts.map((group, idx) => (
            <div key={idx} className="flex flex-row items-center">
              {group.map((product) => (
                <div key={product._id} className="flex-1 p-2">
                  <ProductBlock product={product} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* New Products Section */}
      <div className="h-auto bg-white mx-4 sm:mx-8 lg:mx-32 my-24">
        <div className="pt-5 pl-6 pb-4 font-bold text-xl border-b-4">
          SẢN PHẨM MỚI
        </div>
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex-shrink-0">
            <img
              src="sale4.jpg"
              alt="New Product Promotion"
              className="w-full h-auto object-cover border border-gray-300 rounded-lg transition-shadow duration-300 hover:shadow-lg"
              style={{ maxWidth: "280px" }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 mt-4 md:mt-0">
            {products.slice(0, 4).map((product) => (
              <ProductBlock key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
