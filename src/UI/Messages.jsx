import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Kiểm tra kết nối Socket
socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Lắng nghe tin nhắn mới từ server
    socket.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { message, role: 'user' };
      socket.emit('sendMessage', msgData); // Gửi tin nhắn đến server
      setMessages((prevMessages) => [...prevMessages, msgData]); // Cập nhật UI
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
            <strong>{msg.role === 'admin' ? 'Admin' : 'User'}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
