import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  fetchNotificationsForUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationService";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    if (!user) return;
    const { data, error } = await fetchNotificationsForUser(user.id);
    if (error) console.error(error);
    else setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAll = async () => {
    await markAllNotificationsAsRead(user.id);
    loadNotifications();
  };

  return (
    <div className="notifications-page">
      <Header />
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <>
          <button className="mark-all-btn" onClick={handleMarkAll}>
            Mark All as Read
          </button>
          <ul className="notifications-list">
            {notifications.map((n) => (
              <li key={n.id} className={n.read ? "read" : "unread"}>
                <div className="notification-message">{n.message}</div>
                <div className="notification-meta">
                  <span>{new Date(n.created_at).toLocaleString()}</span>
                  {!n.read && (
                    <button
                      className="mark-read-btn"
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
