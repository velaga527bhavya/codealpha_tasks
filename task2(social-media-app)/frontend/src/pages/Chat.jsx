import React, { useEffect, useState } from 'react'; 
import socket from '../socket';
import { getMessages, sendMessage, getUserByUsername } from '../api';

const Chat = () => {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const currentUserId = localStorage.getItem('userId');

  // When recipientUsername changes, fetch the recipient's ObjectId
  useEffect(() => {
    async function fetchRecipientId() {
      if (recipientUsername.trim() !== '') {
        try {
          const res = await getUserByUsername(recipientUsername);
          setRecipientId(res.data._id);
        } catch (error) {
          console.error('Error fetching user by username:', error.response?.data || error.message);
          setRecipientId('');
        }
      } else {
        setRecipientId('');
      }
    }
    fetchRecipientId();
  }, [recipientUsername]);

  // When recipientId is set, fetch conversation from the database
  useEffect(() => {
    async function fetchConversation() {
      if (recipientId) {
        try {
          const response = await getMessages(recipientId);
          setChatMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error.response?.data || error.message);
        }
      }
    }
    fetchConversation();
  }, [recipientId]);

  // Listen for incoming messages via socket
  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      // Only add message if it belongs to the current conversation
      if (msg.receiver === recipientId || msg.sender === recipientId) {
        setChatMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off('chatMessage');
  }, [recipientId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientId || !messageText) return;
    const msg = { receiver: recipientId, content: messageText };
    try {
      const response = await sendMessage(msg);
      socket.emit('chatMessage', response.data);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      // Optionally, notify the user about the error here.
    }
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Chat</h1>
      <div className="chat-recipient-input">
        <input
          type="text"
          placeholder="Enter recipient's username"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
          className="chat-input"
        />
      </div>
      <div className="chat-messages">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender === currentUserId ? 'sent' : 'received'}`}>
            <span className="chat-message-sender">
              {msg.sender === currentUserId ? 'You' : 'Them'}:
            </span>
            <span className="chat-message-content">
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="chat-form">
        <input
          type="text"
          placeholder="Type your message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;







