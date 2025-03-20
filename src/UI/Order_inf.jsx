import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";

function Order_inf() {
  const [formData, setFormData] = useState({
    customer: "",
    address: "",
    phone: "",
    payment_method: "COD",
    date: "", 
    time: "", 
  });
  const [phoneError, setPhoneError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const account_id = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (account_id) {
      fetchCartItems();
    }
  }, [account_id]);

  const fetchCartItems = () => {
    axios
      .get(`http://localhost:5000/api/carts/account/${account_id}`)
      .then((response) => {
        const items = (response.data.items || []).filter(
          (item) => item.product
        );
        setCartItems(items);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      });
  };

 
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Check if there is a discounted price, if not use the regular price
      const price = item.product.newPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      if (!/^0\d{9}$/.test(value)) {
        setPhoneError("Số điện thoại phải đúng 10 số và bắt đầu bằng số 0");
      } else {
        setPhoneError("");
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!account_id || cartItems.length === 0) {
      alert("Giỏ hàng trống hoặc chưa đăng nhập!");
      return;
    }
    
    const totalAmount = calculateTotal();
    
    try {
      const orderResponse = await axios.post("http://localhost:5000/api/orders", {
        ...formData,
        cart_items: cartItems.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity,
        })),
        isPayment: formData.payment_method === "COD" ? false : null,
      });
      
      if (orderResponse.data.order && orderResponse.data.order._id) {
        const orderId = orderResponse.data.order._id;
        localStorage.setItem("orderId", orderId);
        
        if (formData.payment_method === "ZaloPay") {
          try {
            // Sending request to ZaloPay
            const paymentResponse = await axios.post("http://localhost:5000/payment", {
              amount: totalAmount,
              orderId: orderId,
            });
            
            if (paymentResponse.data.order_url) {
              window.location.href = paymentResponse.data.order_url;
            } else {
              console.error("Failed to receive ZaloPay order URL:", paymentResponse);
              alert("Lỗi khi chuyển hướng đến ZaloPay.");
            }
          } catch (paymentError) {
            console.error("Error during ZaloPay payment request:", paymentError);
            alert("Lỗi khi tạo đơn hàng thanh toán qua ZaloPay.");
          }
        } else {
          alert("Đặt hàng thành công!");
          setCartItems([]);
          navigate("/Order_suc?status=1");
        }
      } else {
        alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };
  





  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  today.setDate(today.getDate() + 3); 
  const maxDate = today.toISOString().split("T")[0]; 

  const minTime = "09:00"; 
  const maxTime = "18:00";

  return (
    <>
      <Header />
      <div className="flex max-w-6xl mx-auto mt-10 gap-6 pb-10">
     
        <div className="w-1/2 bg-gray-100 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Thông Tin Đơn Hàng
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Khách Hàng
              </label>
              <input
                type="text"
                name="customer"
                placeholder="Nhập tên khách hàng"
                value={formData.customer}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa Chỉ
              </label>
              <input
                type="text"
                name="address"
                placeholder="Nhập địa chỉ"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điện Thoại
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              />
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phương Thức Thanh Toán
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              >
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="ZaloPay">ZaloPay</option>
           
              </select>
            </div>
         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày Giao Hàng
              </label>
              <input
                type="date"
                name="date"
                value={formData.delivery_date}
                onChange={handleChange}
                required
                min={minDate} 
                max={maxDate}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
         
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giờ Giao Hàng
              </label>
              <input
                type="time"
                name="time"
                value={formData.delivery_time}
                onChange={handleChange}
                required
                min={minTime} 
                max={maxTime}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Đặt hàng
            </button>
          </form>
        </div>

                  <div className="w-1/2 bg-gray-100 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">Giỏ Hàng</h2>
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <img
                      src={item.product.img}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 mx-4">
                      <p className="font-medium">{item.product.product_name}</p>
                    
                      <p className="text-gray-500">
                        {item.product.newPrice 
                          ? <>
                              <span className="line-through text-red-500">{item.product.price}₫</span> 
                              <span className="text-black">{item.product.newPrice}₫</span>
                            </>
                          : `${item.product.price}₫`
                        }
                      </p>
                    </div>
                    <div className="font-semibold text-lg">
              
                      {item.quantity * (item.product.newPrice || item.product.price)}₫
                    </div>
                  </div>
                ))}
                <div className="text-right mt-4">
                  <p className="font-bold text-xl text-red-500">
                    Tổng cộng: {calculateTotal()}₫
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Giỏ hàng đang trống.</p>
            )}
          </div>
      </div>
      <Footer />
    </>
  );
}

export default Order_inf;
