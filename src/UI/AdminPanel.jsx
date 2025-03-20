import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true,
  transports: ['websocket', 'polling'], // Đảm bảo kết nối sử dụng cả hai phương thức
});

function AdminPanel() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      if (token) {
        console.log('Sending token to server:', token);
        socket.emit('login', token); // Gửi token qua socket
        console.log("token" , token)
      }
      else {
        console.log('Token không hợp lệ hoặc không tồn tại');
      }
      socket.on('receiveMessage', (msg) => {
        console.log("Admin received message:", msg);  // Log tin nhắn nhận từ user
        setMessages((prevMessages) => [...prevMessages, msg]); // Cập nhật danh sách tin nhắn
      });
  
      return () => {
        socket.off('receiveMessage'); // Ngừng lắng nghe sự kiện khi component unmount
      };
    }, [token]);
  
    const sendMessage = () => {
      if (message.trim()) {
        const msgData = { message, role: 'adminPage1' };
        socket.emit('sendMessage', msgData); // Gửi tin nhắn từ admin
        setMessages((prevMessages) => [...prevMessages, msgData]); // Hiển thị tin nhắn admin
        setMessage('');
      }
    };
  
    return (
      <div>
        <h2>Admin Panel</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reply to user"
        />
        <button onClick={sendMessage}>Send Reply</button>
        <div>
          <h3>Messages</h3>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.role === 'admin' ? 'Admin' : 'User'}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  
export default AdminPanel;
