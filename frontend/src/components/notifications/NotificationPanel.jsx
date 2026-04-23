import React, { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notifications';

const NotificationPanel = ({ userId, open, onClose }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!open || !userId) return;
    const load = async () => {
      try {
        const { data } = await fetchNotifications(userId);
        setItems(data ?? []);
      } catch (error) {
        setItems([]);
      }
    };
    load();
  }, [open, userId]);

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const handleMarkOne = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    } catch (error) {
      // Ignore for now; UI is still usable.
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead(userId);
      setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch (error) {
      // Ignore for now; UI is still usable.
    }
  };

  if (!open) return null;

  return (
    <div className="absolute right-8 top-20 w-[380px] max-h-[520px] bg-white border border-gray-100 rounded-3xl shadow-2xl z-40 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-[#061224]">Notifications</p>
          <p className="text-xs text-gray-500">{unreadCount} unread</p>
        </div>
        <button onClick={handleMarkAll} className="text-xs font-bold text-blue-600 flex items-center gap-1">
          <CheckCheck className="w-4 h-4" />
          Mark all read
        </button>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {items.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No notifications yet.</div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMarkOne(item.id)}
              className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                item.read ? 'bg-white' : 'bg-blue-50/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <Bell className={`w-4 h-4 mt-1 ${item.read ? 'text-gray-300' : 'text-blue-500'}`} />
                <div>
                  <p className="text-sm font-bold text-[#061224]">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.message}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <button onClick={onClose} className="w-full py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#061224]">
        Close Panel
      </button>
    </div>
  );
};

export default NotificationPanel;
