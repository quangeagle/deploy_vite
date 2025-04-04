


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faStar,
  faHeart,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Header from "./header";


function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null); // State mới để lưu trữ thông tin kho
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const maxQuantity = 24;
  const account_id = localStorage.getItem("userId");
  // const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    axios.get(`https://deploy-be-0hfo.onrender.com/api/products/${id}`)
      .then(response => {
        console.log("Product data:", response.data);
        setProduct(response.data);
      })
      .catch(error => console.error("Error fetching product:", error));
  
    axios.get(`https://deploy-be-0hfo.onrender.com/api/kho/quantity/${id}`)
      .then(response => {
        console.log("Inventory data:", response.data);
        setInventory(response.data);
      })
      .catch(error => console.error("Error fetching inventory:", error));
  }, [id]);
  

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) =>
      Math.min(prevQuantity + 1, inventory?.quantity || maxQuantity)
    );
  };

  const addToCart = () => {
    if (account_id) {
      axios
        .post("https://deploy-be-0hfo.onrender.com/api/carts", {
          account_id,
          product_id: product._id,
          quantity,
        })
        .then((response) => {
          if (response.data.success) {
            navigate("/cart");
          } else {
            console.error("Error adding to cart:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
        });
    } else {
      console.log("Please log in to add items to the cart.");
      navigate("/login");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return <div>{product?.description}</div>;
      case "reviews":
        return (
          <div>
            <p>Nang 15/08/2018</p>
            <p>Luon dang tin cay, rat hai long ve san pham</p>
            <p>⭐⭐⭐⭐⭐</p>
            <p>Viết đánh giá</p>
            <p>Bạn vui lòng đăng nhập để đánh giá sản phẩm</p>
          </div>
        );
      case "qa":
        return <div>Phần hỏi đáp.</div>;
      default:
        return null;
    }
  };

  if (product === null || inventory === null) return <p>Loading...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm!</p>;
  if (!inventory) return <p>Không có thông tin tồn kho!</p>;
  

  // useEffect(() => {
  //   if (!account_id || !product || !product._id) return;
  
  //   axios.get(`https://deploy-be-0hfo.onrender.com/wishlist/${account_id}`)
  //     .then(response => {
  //       const favoriteProducts = response.data.map(item => item.product_id);
  //       setIsFavorite(favoriteProducts.includes(product._id));
  //     })
  //     .catch(error => console.error("Error fetching favorites:", error));
  // }, [account_id, product]);
  
  // const toggleFavorite = () => {
  //   if (!account_id) {
  //     navigate("/login");
  //     return;
  //   }
  
  //   if (isFavorite) {
  //     // Gửi yêu cầu DELETE để xóa sản phẩm khỏi wishlist
  //     axios
  //       .delete(`https://deploy-be-0hfo.onrender.com/wishlist/${account_id}/${product._id}`)
  //       .then(() => {
  //         setIsFavorite(false);
  //       })
  //       .catch((error) => console.error("Error removing from wishlist:", error));
  //   } else {
  //     // Gửi yêu cầu POST để thêm sản phẩm vào wishlist
  //     axios
  //       .post("https://deploy-be-0hfo.onrender.com/wishlist/add", {
  //         account_id,
  //         product_id: product._id,
  //       })
  //       .then(() => {
  //         setIsFavorite(true);
  //       })
  //       .catch((error) => console.error("Error adding to wishlist:", error));
  //   }
  // };
  return (
    <>
      <Header />
      <div className="bg-slate-100">
        <div className="h-auto w-full bg-slate-100 mb-11">
          <p className="text-xs text-gray-500 ml-32 mt-5 font-extr">
            <span className="mr-2">TRANG CHỦ</span>
            <FontAwesomeIcon icon={faChevronRight} />
            <span className="text-black ml-3">{product.product_name}</span>
          </p>
          <div className="w-4/5 h-auto bg-white ml-32 mt-5 flex flex-row mb-8">
            <img
              className="flex-2 w-1/3"
              src={product.img}
              alt={product.product_name}
            />
            <div className="pl-12 left-1 w-2/5 mt-5">
              <h1 className="font-bold">{product.product_name}</h1>
              <h2 className="text-red-600 text-2xl mt-2 border-b-2 border-gray-200 pb-4">
                {product.newPrice || product.price}₫
              </h2>
              <div className="flex flex-row text-orange-500 text-xs mt-5">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <p className="text-black hover:text-orange-400 hover:cursor-pointer ml-3">
                  Dựa trên 1 đánh giá /
                </p>
                <p className="text-black hover:text-orange-400 hover:cursor-pointer ml-3">
                  Viết đánh giá
                </p>
              </div>
              <div className="mt-4 flex flex-row">
                <div className="flex items-center quantity-control2">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 h-8 bg-gray-200 rounded quantity-decrease2"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border rounded h-8 quantity-value2"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 h-8 bg-gray-200 rounded quantity-increase2"
                  >
                    +
                  </button>
                </div>
                {quantity === maxQuantity && (
                  <div className="mt-2 text-sm text-yellow-800 bg-yellow-200 p-2 rounded flex items-center thongbaosoluong">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="mr-1 text-base"
                    />
                    <span className="font-semibold thongbaosoluong2">
                      Giới hạn 24 sản phẩm/ngày, vui lòng quay lại ngày mai.
                    </span>
                  </div>
                )}

                {quantity === inventory.quantity && (
                  <div className="mt-2 text-sm text-red-800 bg-red-200 p-2 rounded flex items-center thongbaosoluong3">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="mr-1 text-base"
                    />
                    <span className="font-semibold thongbaosoluong4">
                      Giới hạn mua tối đa là {inventory.quantity}.
                    </span>
                  </div>
                )}

                <div className="pl-2">
                  <button
                    onClick={addToCart}
                    className="h-8 px-4 py-1 bg-yellow-500 text-white rounded ml-2"
                  >
                    Thêm vào giỏ
                  </button>

                  <button
                    onClick={addToCart}
                    className="h-8 px-4 py-1 bg-yellow-600 text-white rounded ml-2"
                  >
                    Mua ngay
                  </button>
                  <button className="h-8 px-2 py-1 rounded ml-5">
                <FontAwesomeIcon icon={faHeart} />
              </button>
                </div>
              </div>
            </div>
            <div className="flex-1">{/* Nội dung khác nếu cần */}</div>
          </div>
          <div className="w-4/5 bg-white ml-32 mt-5 flex flex-col">
            <nav className="border-b border-gray-200">
              <ul className="flex">
                <li
                  className={`mr-1 ${
                    activeTab === "description" ? "border-black border-b-2" : ""
                  }`}
                >
                  <button
                    className="bg-white inline-block py-2 px-4 text-black font-semibold"
                    onClick={() => setActiveTab("description")}
                  >
                    <h2 className="text-xl font-bold">Chi Tiết Sản Phẩm</h2>
                  </button>
                </li>
                <li
                  className={`mr-1 ${
                    activeTab === "reviews" ? "border-black border-b-2" : ""
                  }`}
                >
                  <button
                    className="bg-white inline-block py-2 px-4 text-black font-semibold"
                    onClick={() => setActiveTab("reviews")}
                  >
                    Đánh giá (1)
                  </button>
                </li>
                <li
                  className={`mr-1 ${
                    activeTab === "qa" ? "border-black border-b-2" : ""
                  }`}
                >
                  <button
                    className="bg-white inline-block py-2 px-4 text-black font-semibold"
                    onClick={() => setActiveTab("qa")}
                  >
                    Hỏi/Đáp
                  </button>
                </li>
              </ul>
            </nav>
            <div className="p-4">{renderTabContent()}</div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default DetailProduct;

