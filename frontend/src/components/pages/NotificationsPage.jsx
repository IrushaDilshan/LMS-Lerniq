import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api/notificationApi";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this later with logged-in user's id from AuthContext
  const userId = 1;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications(userId);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      loadNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (loading) {
    return <p className="notifications-loading">Loading notifications...</p>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      <p className="notifications-subtitle">
        View booking, ticket status and comment updates.
      </p>

      {notifications.length === 0 ? (
        <p className="empty-message">No notifications found.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${
                notification.readStatus ? "read" : "unread"
              }`}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>

                <div className="notification-meta">
                  <span>{notification.type}</span>
                  <small>{notification.createdAt}</small>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.readStatus && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>
                    Mark as Read
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(notification.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;