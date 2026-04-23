import api from './axios';

export const fetchNotifications = (userId) =>
  api.get('/notifications', { params: { userId } });

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = (userId) =>
  api.patch(`/notifications/users/${userId}/read-all`);
