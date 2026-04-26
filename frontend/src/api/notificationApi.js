import axios from "./axios";

export const createNotification = async (notificationData) => {
  const response = await axios.post("/notifications", notificationData);
  return response.data;
};

export const getUserNotifications = async (userId) => {
  const response = await axios.get(`/notifications/user/${userId}`);
  return response.data;
};

export const getUnreadNotificationCount = async (userId) => {
  const response = await axios.get(`/notifications/user/${userId}/unread-count`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axios.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const deleteNotification = async (notificationId) => {
  await axios.delete(`/notifications/${notificationId}`);
};