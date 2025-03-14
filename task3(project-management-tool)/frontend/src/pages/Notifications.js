import React, { useState, useEffect } from 'react';
import { getNotifications } from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="container">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications at the moment.</p>
      ) : (
        notifications.map((note) => (
          <div key={note._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <p>{note.message}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
