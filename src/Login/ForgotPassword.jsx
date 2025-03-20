import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = () => {
        if (!email) {
            setErrorMessage("Vui lòng nhập email.");
            return;
        }

        axios.post('http://localhost:5000/api/accounts/send-otp-password-reset', { email })
            .then(res => {
                if (res.data.success) {
                    setSuccessMessage("OTP đã được gửi đến email của bạn.");
                    localStorage.setItem('resetEmail', email);
                    setErrorMessage('');
                    setTimeout(() => {
                        navigate('/reset-password');  // Chuyển sang trang reset mật khẩu
                    }, 2000);
                } else {
                    setErrorMessage(res.data.message);
                }
            })
            .catch(err => {
                console.log(err);
                setErrorMessage("Không thể gửi OTP, vui lòng thử lại.");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-center mb-6">QUÊN MẬT KHẨU</h3>

                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}

                {successMessage && (
                    <p className="text-green-500 text-center mb-4">{successMessage}</p>
                )}

                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <button
                    className="w-full h-12 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 transition duration-200"
                    onClick={handleSendOtp}
                >
                    GỬI OTP
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
