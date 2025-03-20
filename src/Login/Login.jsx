// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPhone, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { useState } from "react";
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [errorMessage, setErrorMessage] = useState(''); // Trạng thái lỗi
//     const navigate = useNavigate();
//     axios.defaults.withCredentials = true;

//     const handleSubmit = () => {
//         if (!username || !password) { // Kiểm tra nếu chưa nhập tài khoản hoặc mật khẩu
//             setErrorMessage("Vui lòng nhập tài khoản và mật khẩu.");
//             return;
//         }

//         axios.post('http://localhost:5000/api/auth/login', { username, password })
//             .then(res => {
//                 if (res.data.login) {
//                     console.log("User ID in Login:", res.data.userId);
//                     // Lưu thông tin người dùng và token vào localStorage
//                     localStorage.setItem('username', res.data.username); // Lưu tên người dùng
//                     localStorage.setItem('userId', res.data.userId); // Lưu ID người dùng
//                     localStorage.setItem('role', res.data.role); // Lưu vai trò (nếu có)
//                     localStorage.setItem('token', res.data.token); // Lưu token (nếu có)

//                     setErrorMessage(""); // Xóa lỗi nếu đăng nhập thành công

//                     switch (res.data.role) {
//                         case 'adminPage1':
//                             navigate('/dashboard');
//                             break;
//                         default:
//                             navigate('/home');
//                             break;
//                     }
//                 } else {
//                     setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.");
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//                 setErrorMessage("Tài khoản hoặc mật khẩu không chính xác , Vui lòng thử lại.");
//             });
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
//                 <h3 className="text-2xl font-bold text-center mb-6">ĐĂNG NHẬP</h3>

//                 {errorMessage && (
//                     <p className="text-red-500 text-center mb-4">{errorMessage}</p>
//                 )}

//                 <input
//                     type="text"
//                     placeholder="Tên đăng nhập / Số điện thoại"
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                 />
//                 <div className="relative">
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Mật khẩu"
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                     />
//                     <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute top-3 right-3 cursor-pointer text-gray-500"
//                     >
//                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//                     </span>
//                 </div>

//                 <button
//                     className="w-full h-12 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 transition duration-200"
//                     onClick={handleSubmit}
//                 >
//                     ĐĂNG NHẬP
//                 </button>

//                 <p className="text-center text-sm mt-4">
//                     Liên hệ tổng đài Hỗ trợ khách hàng khi quên Tài khoản/Mật khẩu
//                 </p>
//                 <p className="text-center text-sm">Hotline: (028) 3622 4567</p>
//                 <div className="mt-8">
//                     <h3 className="text-xl font-bold text-center mb-4">ĐĂNG KÝ</h3>
//                     <div className="flex justify-center">
//                         <Link to="/dk" className="flex flex-col items-center text-center">
//                             <p className="text-lg font-semibold">CHƯA CÓ TÀI KHOẢN</p>
//                             <FontAwesomeIcon className="text-2xl" icon={faPhone} />
//                             <p className="text-sm">Quý khách sẽ được cung cấp mã số thẻ mới khi đăng ký.</p>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = () => {
        if (!username || !password) {
            setErrorMessage("Vui lòng nhập tài khoản và mật khẩu.");
            return;
        }

        axios.post('http://localhost:5000/api/auth/login', { username, password })
            .then(res => {
                if (res.data.login) {
                    console.log("User ID in Login:", res.data.userId);
                    // Lưu thông tin người dùng và token vào localStorage
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('token', res.data.token);

                    setErrorMessage(""); // Xóa lỗi nếu đăng nhập thành công

                    switch (res.data.role) {
                        case 'adminPage1':
                            navigate('/dashboard');
                            break;
                        default:
                            navigate('/home');
                            break;
                    }
                } else {
                    setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.");
                }
            })
            .catch(err => {
                console.log(err);
                setErrorMessage("Tài khoản hoặc mật khẩu không chính xác , Vui lòng thử lại.");
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-center mb-6">ĐĂNG NHẬP</h3>

                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}

                <input
                    type="text"
                    placeholder="Tên đăng nhập / Số điện thoại"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 cursor-pointer text-gray-500"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button
                    className="w-full h-12 bg-yellow-500 text-white font-bold rounded-md hover:bg-yellow-600 transition duration-200"
                    onClick={handleSubmit}
                >
                    ĐĂNG NHẬP
                </button>

                <div className="flex justify-between mt-4">
                    <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>

                <p className="text-center text-sm mt-4">
                    Liên hệ tổng đài Hỗ trợ khách hàng khi quên Tài khoản/Mật khẩu
                </p>
                <p className="text-center text-sm">Hotline: (028) 3622 4567</p>
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-center mb-4">ĐĂNG KÝ</h3>
                    <div className="flex justify-center">
                        <Link to="/dk" className="flex flex-col items-center text-center">
                            <p className="text-lg font-semibold">CHƯA CÓ TÀI KHOẢN</p>
                            <FontAwesomeIcon className="text-2xl" icon={faPhone} />
                            <p className="text-sm">Quý khách sẽ được cung cấp mã số thẻ mới khi đăng ký.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
