import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead } from '../api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      const res = await getNotifications();
      setNotifications(res.data);
    }
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    const res = await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? res.data : n))
    );
  };

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.map((n) => (
        <div key={n._id} style={{ background: n.isRead ? '#eee' : '#fff', padding: '0.5rem', margin: '0.5rem 0' }}>
          <p>{n.message}</p>
          {!n.isRead && <button onClick={() => handleMarkRead(n._id)}>Mark as Read</button>}
        </div>
      ))}
    </div>
  );
};

export default Notifications;

