import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, Clock, CheckCircle, AlertCircle, Info, ChevronRight, X, Mail } from 'lucide-react';

const HeaderActions = ({ currentUser }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const notificationRef = useRef(null);
    const messageRef = useRef(null);

    // Initial role-based mock data
    useEffect(() => {
        let roleNotifications = [];
        let roleMessages = [];

        if (currentUser?.role === 'ADMIN') {
            roleNotifications = [
                { id: 1, type: 'alert', title: 'Critical: Database Load High', time: '2m ago', icon: <AlertCircle className="w-4 h-4 text-rose-500" />, read: false },
                { id: 2, type: 'info', title: '5 Unassigned Hardware Tickets', time: '15m ago', icon: <Info className="w-4 h-4 text-blue-500" />, read: false },
                { id: 3, type: 'success', title: 'Weekly Backup Successful', time: '3h ago', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, read: true },
                { id: 4, type: 'info', title: 'New Technician (User #44) Online', time: '5h ago', icon: <Clock className="w-4 h-4 text-amber-500" />, read: true },
            ];
            roleMessages = [
                { id: 1, from: 'System Monitor', text: 'Health Check: All nodes operational. API latency within limits.', time: '1m ago', unread: true },
                { id: 2, from: 'Director Ops', text: 'Monthly maintenance report is due by Friday.', time: '4h ago', unread: false },
            ];
        } else if (currentUser?.role === 'TECHNICIAN') {
            roleNotifications = [
                { id: 1, type: 'alert', title: 'Emergency Dispatch: Block G', time: '1m ago', icon: <AlertCircle className="w-4 h-4 text-rose-500" />, read: false },
                { id: 2, type: 'info', title: 'New Hardware Ticket Assigned', time: '10m ago', icon: <Info className="w-4 h-4 text-blue-500" />, read: false },
                { id: 3, type: 'success', title: 'Ticket #442 Resolved by Admin', time: '2h ago', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, read: true },
                { id: 4, type: 'info', title: 'Inventory Restock: Networking Gear', time: '6h ago', icon: <Clock className="w-4 h-4 text-amber-500" />, read: true },
            ];
            roleMessages = [
                { id: 1, from: 'Admin Support', text: 'Hey, please check the router in Block C before your shift ends.', time: '5m ago', unread: true },
                { id: 2, from: 'Dispatch Central', text: 'Route optimization updated for current weather conditions.', time: '1h ago', unread: false },
            ];
        } else {
            // Student / Other
            roleNotifications = [
                { id: 1, type: 'success', title: 'Ticket Status: Resolved', time: '30m ago', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, read: false },
                { id: 2, type: 'info', title: 'Technician Assigned to Your Ticket', time: '1h ago', icon: <Info className="w-4 h-4 text-blue-500" />, read: false },
                { id: 3, type: 'alert', title: 'Scheduled Power Outage: Library', time: '4h ago', icon: <AlertCircle className="w-4 h-4 text-rose-500" />, read: true },
                { id: 4, type: 'info', title: 'Portal Maintenance Tomorrow', time: '1d ago', icon: <Clock className="w-4 h-4 text-amber-500" />, read: true },
            ];
            roleMessages = [
                { id: 1, from: 'IT Helpdesk', text: 'We have received your ticket regarding the keyboard. A tech will visit soon.', time: '1h ago', unread: true },
                { id: 2, from: 'Campus Life', text: 'New amenities added to the student hub booking system.', time: '1d ago', unread: false },
            ];
        }

        setNotifications(roleNotifications);
        setMessages(roleMessages);
    }, [currentUser]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
            if (messageRef.current && !messageRef.current.contains(event.target)) setShowMessages(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadNotifications = notifications.filter(n => !n.read).length;
    const unreadMessages = messages.filter(m => m.unread).length;

    return (
        <div className="flex items-center gap-3 pr-6 border-r border-gray-100">
            {/* ── Notification Bell ── */}
            <div className="relative" ref={notificationRef}>
                <button 
                    onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); }}
                    className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-[#061224] hover:bg-gray-50'}`}
                >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                    )}
                </button>

                {/* Dropdown */}
                {showNotifications && (
                    <div className="absolute top-[calc(100%+12px)] right-0 w-[380px] bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-[#061224] uppercase tracking-widest">Notifications</h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">You have {unreadNotifications} unread alerts</p>
                            </div>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Mark all as read</button>
                        </div>
                        
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer group ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                        <div className="mt-1 w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                            {notif.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${!notif.read ? 'font-black' : ''}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> {notif.time}
                                            </p>
                                        </div>
                                        {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center">
                                    <Bell className="w-10 h-10 text-gray-100 mx-auto mb-3" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All caught up!</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50/50 text-center border-t border-gray-50">
                            <button className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-[#061224] flex items-center justify-center gap-2 mx-auto">
                                View all activity <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Message Square ── */}
            <div className="relative" ref={messageRef}>
                <button 
                    onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); }}
                    className={`p-2.5 rounded-xl transition-all relative ${showMessages ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-[#061224] hover:bg-gray-50'}`}
                >
                    <MessageSquare className="w-5 h-5" />
                    {unreadMessages > 0 && (
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white"></span>
                    )}
                </button>

                {/* Dropdown */}
                {showMessages && (
                    <div className="absolute top-[calc(100%+12px)] right-[-60px] w-[350px] bg-white rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                        <div className="p-6 border-b border-gray-50">
                            <h3 className="text-sm font-black text-[#061224] uppercase tracking-widest">Inbox</h3>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{unreadMessages} active conversations</p>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto">
                            {messages.map(msg => (
                                <div key={msg.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50/50">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-xs font-black text-gray-900">{msg.from}</p>
                                            <p className="text-[9px] font-bold text-gray-400">{msg.time}</p>
                                        </div>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                                            {msg.text}
                                        </p>
                                    </div>
                                    {msg.unread && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5" />}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-gray-50/50 text-center">
                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Open Messenger</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderActions;
