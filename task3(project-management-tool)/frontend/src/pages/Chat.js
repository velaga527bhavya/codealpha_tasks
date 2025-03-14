import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { getMessages, sendMessage, getUserByUsername } from '../api';

const Chat = () => {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchRecipient() {
      if (recipientUsername.trim() !== '') {
        try {
          const res = await getUserByUsername(recipientUsername);
          setRecipientId(res.data._id);
        } catch (error) {
          console.error('Error fetching user:', error.response?.data || error.message);
          setRecipientId('');
        }
      }
    }
    fetchRecipient();
  }, [recipientUsername]);

  useEffect(() => {
    async function fetchMessages() {
      if (recipientId) {
        try {
          const res = await getMessages(recipientId);
          setChatMessages(res.data);
        } catch (error) {
          console.error('Error fetching messages:', error.response?.data || error.message);
        }
      }
    }
    fetchMessages();
  }, [recipientId]);

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      if (msg.sender === recipientId || msg.receiver === recipientId) {
        setChatMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('chatMessage');
  }, [recipientId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientId || !messageText) return;
    try {
      const res = await sendMessage({ receiver: recipientId, content: messageText });
      socket.emit('chatMessage', res.data);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <h1>Chat</h1>
      <div>
        <input 
          type="text" 
          placeholder="Recipient Username" 
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
        />
      </div>
      <div>
        {chatMessages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender === currentUserId ? 'You' : 'Them'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Type your message" 
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
