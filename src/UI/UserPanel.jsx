import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket', 'polling'], // Đảm bảo kết nối sử dụng cả hai phương thức
});

function UserPanel() {
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
      // Lắng nghe tin nhắn và cập nhật state
      socket.on('receiveMessage', (msg) => {
        console.log("Received message:", msg);  // Log tin nhắn nhận được
        setMessages((prevMessages) => [...prevMessages, msg]); // Cập nhật tin nhắn mới
      });
  
      // Cleanup khi component unmount
      return () => {
        socket.off('receiveMessage'); // Ngừng lắng nghe sự kiện khi component unmount
      };
    }, [token]);
  
    const sendMessage = () => {
      if (message.trim()) {
        const msgData = { message, role: 'user' };
        socket.emit('sendMessage', msgData); // Gửi tin nhắn từ user
        setMessages((prevMessages) => [...prevMessages, msgData]); // Hiển thị tin nhắn người dùng
        setMessage('');
      }
    };
  
    return (
      <div>
        <h2>Chat with Admin</h2>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
        <div>
          <h3>Messages</h3>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.role === 'adminPage1' ? 'Admin' : 'User'}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  

export default UserPanel;
