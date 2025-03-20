// import { useState } from "react";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//     const [username, setUsername] = useState('');
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [phone, setPhone] = useState('');

//     // Thêm các state để lưu trữ lỗi
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     // Hàm kiểm tra lỗi
//     const validate = () => {
//         const newErrors = {};
//         if (!name || name.trim() === "") {
//             newErrors.name = "Tên không được để trống.";
//         }
//         if (!username || username.length < 4) {
//             newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự.";
//         }
//         const phoneRegex = /^[0-9]{10}$/;
//         if (!phone || !phoneRegex.test(phone)) {
//             newErrors.phone = "Số điện thoại phải có 10 chữ số.";
//         }
//         const emailRegex = /^[^\s@]+@gmail\.com$/;
//         if (!email || !emailRegex.test(email)) {
//             newErrors.email = "Chỉ chấp nhận email @gmail.com.";
//         }
//         if (!password || password.length < 6) {
//             newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
//         }
//         return newErrors;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = validate();
//         if (Object.keys(validationErrors).length > 0) {
//             setErrors(validationErrors);
//             return;
//         }

//         // Nếu không có lỗi, gửi yêu cầu đến server
//         axios.post('http://localhost:5000/api/accounts/create', {
//             username, name, email, password, phone,
//         }, {
//             withCredentials: true
//         })
//             .then(res => {
//                 if (res.data.success) {
//                     navigate('/');
//                     alert('Đăng kí thành công');
//                 }
//             })
//             .catch(err => {
//                 if (err.response && err.response.data && err.response.data.message) {
//                     // Hiển thị thông báo lỗi từ server
//                     setErrors({ server: err.response.data.message });
//                 } else {
//                     console.error(err);
//                     alert('Đăng ký thất bại. Vui lòng thử lại.');
//                 }
//             });
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-slate-100">
//             <div className="bg-white w-[60%] p-8 shadow-md">
//                 <p className="bg-gray-400 text-white text-center font-bold p-3 mb-6">ĐĂNG KÍ TÀI KHOẢN</p>
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Tên</label>
//                         <input
//                             type="text"
//                             className="border border-gray-300 p-2 rounded w-full"
//                             placeholder="Nhập tên"
//                             onChange={(e) => setName(e.target.value)}
//                         />
//                         {errors.name && <p className="text-red-500">{errors.name}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
//                         <input
//                             type="text"
//                             className="border border-gray-300 p-2 rounded w-full"
//                             placeholder="Nhập tên đăng nhập"
//                             onChange={(e) => setUsername(e.target.value)}
//                         />
//                         {errors.username && <p className="text-red-500">{errors.username}</p>}
//                         {errors.server && <p className="text-red-500">{errors.server}</p>} {/* Hiển thị lỗi server */}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Số điện thoại</label>
//                         <input
//                             type="text"
//                             className="border border-gray-300 p-2 rounded w-full"
//                             placeholder="Nhập số điện thoại"
//                             onChange={(e) => setPhone(e.target.value)}
//                         />
//                         {errors.phone && <p className="text-red-500">{errors.phone}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Email</label>
//                         <input
//                             type="email"
//                             className="border border-gray-300 p-2 rounded w-full"
//                             placeholder="Nhập email"
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                         {errors.email && <p className="text-red-500">{errors.email}</p>}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 mb-2">Mật khẩu</label>
//                         <input
//                             type="password"
//                             className="border border-gray-300 p-2 rounded w-full"
//                             placeholder="Nhập mật khẩu"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         {errors.password && <p className="text-red-500">{errors.password}</p>}
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-300"
//                     >
//                         Register
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Signup;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name || name.trim() === "") {
      newErrors.name = "Tên không được để trống.";
    }
    if (!username || username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự.";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số.";
    }
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Chỉ chấp nhận email @gmail.com.";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    return newErrors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = {
      email,
      username,
      name,
      phone,
      password,
    };

    console.log("Dữ liệu gửi đi: ", dataToSend);

    axios
      .post("http://localhost:5000/api/accounts/send-otp", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("API Response:", response);
        setStep(2);
      })
      .catch((err) => {
        console.error(
          "Lỗi khi gửi OTP:",
          err.response ? err.response.data : err
        );
        alert("Không thể gửi OTP. Vui lòng thử lại.");
      });
  };

  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    axios
      .post("http://localhost:5000/api/accounts/verify-otp", {
        email,
        otp: otpCode,
        username,
        name,
        password,
        phone,
      })
      .then((res) => {
        if (res.data.success) {
          alert("Đăng ký thành công!");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("OTP không hợp lệ hoặc đã hết hạn.");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="bg-white w-[60%] p-8 shadow-md">
        {step === 1 && (
          <>
            <p className="bg-gray-400 text-white text-center font-bold p-3 mb-6">
              ĐĂNG KÝ TÀI KHOẢN
            </p>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-gray-700 mb-2">Tên</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nhập tên"
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nhập tên đăng nhập"
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && (
                  <p className="text-red-500">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nhập số điện thoại"
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nhập email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  className="border border-gray-300 p-2 rounded w-full"
                  placeholder="Nhập mật khẩu"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-300"
              >
                Gửi OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white text-center font-bold p-3 mb-6 rounded-lg shadow-md">
              NHẬP MÃ OTP
            </p>
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="flex justify-center space-x-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="border-2 border-transparent text-center w-16 h-16 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105 ease-in-out shadow-lg"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onInput={(e) => {
                      if (e.target.value) {
                        const nextInput = document.getElementById(
                          `otp-input-${index + 1}`
                        );
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index]) {
                        const prevInput = document.getElementById(
                          `otp-input-${index - 1}`
                        );
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    id={`otp-input-${index}`}
                    style={{
                      backgroundColor: digit ? "#ffd040" : "#fff8e1", // Light yellow for filled inputs
                      transition: "background-color 0.3s ease", // Smooth background transition
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full mt-4 shadow-md hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700 transition-all ease-in-out"
              >
                Xác nhận OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
