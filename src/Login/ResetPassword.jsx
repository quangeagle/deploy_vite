// import { useState } from "react";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ResetPassword = () => {
//     const [otp, setOtp] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();

//     const handleResetPassword = () => {
//         if (!otp || !newPassword) {
//             setErrorMessage("Vui lòng nhập OTP và mật khẩu mới.");
//             return;
//         }
//         const email = localStorage.getItem('resetEmail');
//         axios.post('http://localhost:5000/api/accounts/verify-otp-password-reset', { otp, newPassword,email })
//             .then(res => {
//                 if (res.data.success) {
//                     setSuccessMessage("Mật khẩu của bạn đã được thay đổi thành công.");
//                     localStorage.removeItem('resetEmail');
//                     setErrorMessage('');
//                     setTimeout(() => {
//                         navigate('/login');  // Quay lại trang đăng nhập
//                     }, 2000);
//                 } else {
//                     setErrorMessage(res.data.message);
//                 }
//             })
//             .catch(err => {
//                 console.log("Error response:", err.response);
//                 setErrorMessage("Không thể thay đổi mật khẩu, vui lòng thử lại.");
//                 setErrorMessage("Không thể thay đổi mật khẩu, vui lòng thử lại.");
//             });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
//                 <h3 className="text-2xl font-bold text-center mb-6">ĐỔI MẬT KHẨU</h3>

//                 {errorMessage && (
//                     <p className="text-red-500 text-center mb-4">{errorMessage}</p>
//                 )}

//                 {successMessage && (
//                     <p className="text-green-500 text-center mb-4">{successMessage}</p>
//                 )}

//                 <input
//                     type="text"
//                     placeholder="Nhập OTP"
//                     onChange={(e) => setOtp(e.target.value)}
//                     className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                 />

//                 <input
//                     type="password"
//                     placeholder="Mật khẩu mới"
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                 />

//                 <button
//                     className="w-full h-12 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 transition duration-200"
//                     onClick={handleResetPassword}
//                 >
//                     ĐỔI MẬT KHẨU
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ResetPassword;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Bước hiện tại: 1 là nhập OTP, 2 là đổi mật khẩu
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối cùng
    setOtp(updatedOtp);
  };

  const handleVerifyOtp = () => {
    const otpCode = otp.join("");
    const email = localStorage.getItem("resetEmail");
    console.log("Sending OTP Code:", otpCode); // In ra OTP code để kiểm tra
    console.log("Email:", email); // In ra email để kiểm tra

    if (!otpCode || !email) {
      setErrorMessage("Vui lòng nhập OTP hợp lệ.");
      return;
    }

    axios
      .post("http://localhost:5000/api/accounts/verify-otp-password-reset", {
        email,
        otp: otpCode,
      })
      .then((res) => {
        if (res.data.success) {
          setStep(2); // Chuyển sang bước đặt lại mật khẩu
          setSuccessMessage(
            "Xác thực OTP thành công! Vui lòng nhập mật khẩu mới."
          );
          setErrorMessage("");
        } else {
          setErrorMessage(res.data.message || "OTP không hợp lệ.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Có lỗi xảy ra khi xác thực OTP.");
        setErrorMessage(
          err.response?.data?.message || "Có lỗi xảy ra khi xác thực OTP."
        );
      });
  };

  const handleResetPassword = () => {
    const email = localStorage.getItem("resetEmail");
    if (!newPassword || !email) {
      setErrorMessage("Vui lòng nhập mật khẩu mới.");
      return;
    }

    axios
      .post("http://localhost:5000/api/accounts/reset-password", {
        email,
        newPassword,
      })
      .then((res) => {
        if (res.data.success) {
          setSuccessMessage("Mật khẩu của bạn đã được thay đổi thành công.");
          localStorage.removeItem("resetEmail");
          setTimeout(() => {
            navigate("/"); // Quay lại trang đăng nhập
          }, 2000);
        } else {
          setErrorMessage(res.data.message || "Không thể đặt lại mật khẩu.");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Có lỗi xảy ra khi đặt lại mật khẩu.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-center mb-6">
          ĐẶT LẠI MẬT KHẨU
        </h3>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}

        {step === 1 && (
          <>
            {/* <p className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white text-center font-bold p-3 mb-6 rounded-lg shadow-md">
              NHẬP MÃ OTP
            </p> */}

            <div className="flex justify-center space-x-4 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 border-2 border-transparent text-center rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition-all transform hover:scale-105 ease-in-out shadow-lg"
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
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg mt-4 shadow-md hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-700 transition-all ease-in-out"
              onClick={handleVerifyOtp}
            >
              Xác nhận OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <button
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-md hover:from-yellow-600 hover:to-yellow-700 transition duration-200"
              onClick={handleResetPassword}
            >
              Đổi mật khẩu
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
