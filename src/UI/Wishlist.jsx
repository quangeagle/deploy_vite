import React, { useState, useEffect } from "react";
import Footer from "./footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./header";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const account_id = localStorage.getItem("userId");

  useEffect(() => {
    if (account_id) {
      fetchWishlistItems();
    }
  }, [account_id]);

  const fetchWishlistItems = () => {
    axios
      .get(`https://deploy-be-0hfo.onrender.com/wishlist/${account_id}`)
      .then((response) => {
        setWishlistItems(response.data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching wishlist items:", error);
        setWishlistItems([]);
      });
  };

  const addToCart = (productId) => {
    axios
      .post(`https://deploy-be-0hfo.onrender.com/carts/account/${account_id}/add`, { productId })
      .then(() => {
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      });
  };

  const removeFromWishlist = (productId) => {
    axios
      .delete(`https://deploy-be-0hfo.onrender.com/wishlist/${account_id}/${productId}`)
      .then(() => {
        fetchWishlistItems();
      })
      .catch((error) => {
        console.error("Error removing from wishlist:", error);
        alert("Không thể xóa sản phẩm khỏi yêu thích. Vui lòng thử lại.");
      });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="bg-yellow-400 text-center py-4 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-white">Sản Phẩm Yêu Thích</h2>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-md p-4">
          {wishlistItems.length > 0 ? (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-x-4 border-b pb-4">
                  <img
                    src={item.product.img}
                    alt={item.product.product_name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div className="flex-1 mx-4">
                    <Link to={`/product/${item.product._id}`} className="text-lg font-semibold">
                      {item.product.product_name}
                    </Link>
                    <p className="text-gray-500">
                      {(item.product.newPrice || item.product.price).toLocaleString()}₫
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(item.product._id)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md"
                  >
                    Thêm vào giỏ
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="text-red-500 hover:underline ml-4"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Danh sách yêu thích của bạn đang trống.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
