import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const account_id = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm trong giỏ hàng khi component được mount
  useEffect(() => {
    if (account_id) {
      fetchCartItems();
    }
  }, [account_id]);

  // Hàm lấy dữ liệu giỏ hàng
  const fetchCartItems = () => {
    axios
      .get(`http://localhost:5000/api/carts/account/${account_id}`)
      .then((response) => {
        const items = (response.data.items || []).filter((item) => item.product); // Lọc các sản phẩm hợp lệ
        setCartItems(items);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setCartItems([]); // Đặt giỏ hàng trống nếu lỗi
      });
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1
  
    // Tạo một bản sao của giỏ hàng và cập nhật số lượng
    const updatedCartItems = cartItems.map((item) => {
      if (item.product._id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  
    setCartItems(updatedCartItems); // Cập nhật UI ngay lập tức
  
    // Gọi API để cập nhật số lượng
    axios
      .patch(
        `http://localhost:5000/api/carts/account/${account_id}/item/${productId}`,
        { quantity: newQuantity }
      )
      .catch((error) => {
        console.error("Error updating quantity:", error);
        alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
      });
  };
  
  const removeItem = (productId) => {
    axios
      .delete(
        `http://localhost:5000/api/carts/account/${account_id}/item/${productId}` // Truyền đúng productId
      )
      .then((response) => {
        console.log("Item removed successfully", response.data);
        fetchCartItems(); // Cập nhật lại giỏ hàng sau khi xóa sản phẩm
      })
      .catch((error) => {
        console.error("Error removing item:", error);
        alert("Không thể xóa sản phẩm. Vui lòng thử lại sau!");
      });
  };
  
  
  
  // Hàm tính tổng tiền của giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.newPrice || item.product.price) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    const totalAmount = calculateTotal();

    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống. Bạn sẽ được chuyển về trang chủ.");
      navigate("/home"); // Điều hướng đến trang home khi giỏ hàng trống
    } else if (totalAmount < 100000) {
      alert(
        "Đơn hàng của bạn phải có tổng cộng trên 100.000đ để tiến hành thanh toán."
      );
    } else {
      navigate("/Order_inf"); // Điều hướng đến trang thanh toán nếu giỏ hàng không trống
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="bg-yellow-400 text-center py-4 rounded-md shadow-md">
          <h2 className="text-2xl font-bold text-white">Giỏ Hàng Của Bạn</h2>
        </div>

        <div className="mt-6 bg-white shadow-md rounded-md p-4">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-x-4 border-b pb-4"
                >
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={item.product.img}
                    alt={item.product.product_name}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 mx-4">
                    <Link
                      to={`/product/${item.product._id}`} // Link tới trang chi tiết sản phẩm
                      className="text-lg font-semibold"
                    >
                      {item.product.product_name}
                    </Link>
                    <p className="text-gray-500">
                      {(item.product.newPrice || item.product.price).toLocaleString()}₫
                    </p>
                  </div>

                  {/* Phần tăng/giảm số lượng */}
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  {/* Giá tiền */}
                  <div className="font-semibold text-lg">
                    {(item.quantity * (item.product.newPrice || item.product.price)).toLocaleString()}₫
                  </div>

                  {/* Nút xóa sản phẩm */}
                  <button
  onClick={() => removeItem(item.product._id)}  // Truyền chỉ ID của sản phẩm
  className="text-red-500 hover:underline ml-4"
>
  Xóa
</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Giỏ hàng của bạn đang trống.
            </p>
          )}
        </div>

        {/* Phần tổng tiền và nút thanh toán */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-md p-4 mt-4">
          <div>
            <h4 className="font-bold text-lg">Tổng cộng</h4>
            <p className="text-xl text-red-500">{calculateTotal().toLocaleString()}₫</p>
          </div>


          <button
            onClick={handleCheckout}
            className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md"
          >
            Thanh Toán
          </button>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShoppingCart;





// import React, { useState, useEffect } from "react";
// import Footer from "./Footer";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Header from "./Header";
// import { useNavigate } from "react-router-dom";

// const ShoppingCart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [inventory, setInventory] = useState({}); // State to hold product inventory info

//   const account_id = localStorage.getItem("userId");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (account_id) {
//       fetchCartItems();
//     }
//   }, [account_id]);

//   const fetchCartItems = () => {
//     axios
//       .get(`http://localhost:5000/api/carts/account/${account_id}`)
//       .then((response) => {
//         const items = (response.data.items || []).filter((item) => item.product);
//         setCartItems(items);
//         fetchProductInventory(items); // Fetch inventory for the items in the cart
//       })
//       .catch((error) => {
//         console.error("Error fetching cart items:", error);
//         setCartItems([]); // Reset cart if there's an error
//       });
//   };

//   // Fetch inventory for the products in the cart
//   const fetchProductInventory = (productId) => {
//     axios
//       .get(`http://localhost:5000/api/kho/quantity/${productId}`) // Requesting for a single product's inventory
//       .then((response) => {
//         // Assuming response.data is an object like { quantity: 10 }
//         setInventory(prevInventory => ({
//           ...prevInventory,
//           [productId]: response.data.quantity // Update inventory for the clicked product
//         }));
//       })
//       .catch((error) => {
//         console.error("Error fetching inventory:", error);
//       });
//   };
  

//   // Update the quantity in the cart, taking into account the inventory limit
//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) return;

//     const maxQuantity = inventory[productId] || 1; // Default to 1 if no inventory data is available
//     const adjustedQuantity = Math.min(newQuantity, maxQuantity);

//     // Update the UI immediately
//     const updatedCartItems = cartItems.map((item) => {
//       if (item.product._id === productId) {
//         return { ...item, quantity: adjustedQuantity };
//       }
//       return item;
//     });
//     setCartItems(updatedCartItems);

//     // Update the backend
//     axios
//       .patch(
//         `http://localhost:5000/api/carts/account/${account_id}/item/${productId}`,
//         { quantity: adjustedQuantity }
//       )
//       .catch((error) => {
//         console.error("Error updating quantity:", error);
//         alert("Không thể cập nhật số lượng. Vui lòng thử lại.");
//       });
//   };

//   const removeItem = (productId) => {
//     axios
//       .delete(`http://localhost:5000/api/carts/account/${account_id}/item/${productId}`)
//       .then(() => {
//         fetchCartItems(); // Refresh cart after removal
//       })
//       .catch((error) => {
//         console.error("Error removing item:", error);
//         alert("Không thể xóa sản phẩm. Vui lòng thử lại sau!");
//       });
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (item.product.newPrice || item.product.price) * item.quantity;
//     }, 0);
//   };

//   const handleCheckout = () => {
//     const totalAmount = calculateTotal();

//     if (cartItems.length === 0) {
//       alert("Giỏ hàng của bạn đang trống. Bạn sẽ được chuyển về trang chủ.");
//       navigate("/home");
//     } else if (totalAmount < 100000) {
//       alert("Đơn hàng của bạn phải có tổng cộng trên 100.000đ để tiến hành thanh toán.");
//     } else {
//       navigate("/Order_inf");
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container mx-auto py-6 px-4 max-w-4xl">
//         <div className="bg-yellow-400 text-center py-4 rounded-md shadow-md">
//           <h2 className="text-2xl font-bold text-white">Giỏ Hàng Của Bạn</h2>
//         </div>

//         <div className="mt-6 bg-white shadow-md rounded-md p-4">
//           {cartItems.length > 0 ? (
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex items-center justify-between gap-x-4 border-b pb-4"
//                 >
//                   <img
//                     src={item.product.img}
//                     alt={item.product.product_name}
//                     className="w-16 h-16 object-cover rounded-md"
//                   />

//                   <div className="flex-1 mx-4">
//                     <Link
//                       to={`/product/${item.product._id}`}
//                       className="text-lg font-semibold"
//                     >
//                       {item.product.product_name}
//                     </Link>
//                     <p className="text-gray-500">
//                       {(item.product.newPrice || item.product.price).toLocaleString()}₫
//                     </p>
//                   </div>

//                   <div className="flex items-center">
//                     <button
//                       onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
//                       className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
//                     >
//                       -
//                     </button>
//                     <span className="px-4">{item.quantity}</span>
//                     <button
//                       onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
//                       className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
//                     >
//                       +
//                     </button>
//                   </div>

//                   <div className="font-semibold text-lg">
//                     {(item.quantity * (item.product.newPrice || item.product.price)).toLocaleString()}₫
//                   </div>

//                   <button
//                     onClick={() => removeItem(item.product._id)}
//                     className="text-red-500 hover:underline ml-4"
//                   >
//                     Xóa
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">Giỏ hàng của bạn đang trống.</p>
//           )}
//         </div>

//         <div className="flex justify-between items-center bg-white shadow-md rounded-md p-4 mt-4">
//           <div>
//             <h4 className="font-bold text-lg">Tổng cộng</h4>
//             <p className="text-xl text-red-500">{calculateTotal().toLocaleString()}₫</p>
//           </div>

//           <button
//             onClick={handleCheckout}
//             className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md"
//           >
//             Thanh Toán
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default ShoppingCart;
