import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar1'; // Import Sidebar component

const ListUser = () => {
    const [users, setUsers] = useState([]); // Trạng thái cho danh sách người dùng
    const [userCount, setUserCount] = useState(0); // Trạng thái cho số lượng người dùng
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(''); // Trạng thái lỗi

    // Hàm gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/accounts/list"); // Gọi endpoint danh sách người dùng
            if (response.data.success) {
                setUsers(response.data.accounts); // Thiết lập danh sách người dùng
                setUserCount(response.data.accounts.length); // Cập nhật số lượng người dùng
            } else {
                setError('Không thể tải danh sách người dùng');
            }
        } catch (err) {
            console.error(err); // Ghi lỗi ra console
            setError('Không thể tải danh sách người dùng'); // Thiết lập thông báo lỗi
        } finally {
            setLoading(false); // Đặt loading thành false
        }
    };

    useEffect(() => {
        fetchUsers(); // Gọi hàm fetchUsers khi component được mount
    }, []);

    if (loading) {
        return <div>Đang tải...</div>; // Hiển thị khi đang tải
    }

    if (error) {
        return <div>{error}</div>; // Hiển thị lỗi nếu có
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
                <div className="bg-white p-4 rounded shadow flex flex-col justify-center items-center">
                    <h2 className="text-lg font-semibold mb-2 text-blue-400">Tổng số người dùng đã đăng ký</h2>
                    <p className="text-2xl text-red-500">{userCount}</p>
                </div>
                <table className="mt-4 w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Họ tên</th>
                            <th className="border border-gray-300 p-2">Tên đăng nhập</th>
                            <th className="border border-gray-300 p-2">Số điện thoại</th>
                            <th className="border border-gray-300 p-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className="border border-gray-300 p-2">{user.name}</td>
                                    <td className="border border-gray-300 p-2">{user.username}</td>
                                    <td className="border border-gray-300 p-2">{user.phone}</td>
                                    <td className="border border-gray-300 p-2">{user.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="border border-gray-300 p-2 text-center">Không có người dùng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default ListUser;
