import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  LogOut, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Clock, 
  ShieldCheck,
  Menu,
  School
} from 'lucide-react';
import { SystemNotification, UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: SystemNotification[];
  onNotificationClick: (notif: SystemNotification) => void;
  onMarkAllRead: () => void;
  onOpenSearchModal: () => void;
  onToggleSidebar: () => void;
  onNavigate: (view: string, studentId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onOpenSearchModal,
  onToggleSidebar,
  onNavigate,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<UserRole, { title: string; subtitle: string }> = {
    GVCN: { title: 'Cô Nguyễn Thị Hồng Anh', subtitle: 'Giáo viên chủ nhiệm lớp 8A2' },
    ADMIN: { title: 'Thầy Hiệu trưởng', subtitle: 'Quản trị hệ thống BGH' },
    TEACHER: { title: 'Thầy Trần Đình Trọng', subtitle: 'Giáo viên bộ môn Toán' },
    PARENT: { title: 'Ông Nguyễn Văn Bình', subtitle: 'Phụ huynh em Nguyễn Văn A' },
    STUDENT: { title: 'Nguyễn Văn A', subtitle: 'Học sinh lớp 8A2' },
  };

  return (
    <header className="bg-[#06367A] text-white border-b border-[#0D47A1] sticky top-0 z-40 shadow-md">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-3">
        {/* Left: Mobile Toggle & Brand Header */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-white/10 text-white lg:hidden transition"
            title="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
              <School className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="font-extrabold text-base lg:text-lg tracking-wide flex items-center gap-2">
                TRỢ LÝ CHỦ NHIỆM LỚP 8A2
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-500/30 text-blue-200 rounded-md border border-blue-400/30">
                  2026-2027
                </span>
              </div>
              <div className="text-xs text-blue-200 font-medium tracking-wider">
                THCS GIA AN
              </div>
            </div>
          </div>
        </div>

        {/* Center: Slogan or Quick Search Bar */}
        <div className="hidden xl:flex items-center text-xs lg:text-sm font-medium text-blue-100/90 italic tracking-wide">
          <span>“Đồng hành cùng học sinh – Kiến tạo tương lai”</span>
        </div>

        {/* Quick Search trigger */}
        <div className="flex-1 max-w-xs md:max-w-sm hidden md:block">
          <button
            onClick={onOpenSearchModal}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs text-blue-100 transition shadow-inner"
          >
            <Search className="w-4 h-4 text-blue-200" />
            <span className="truncate">Tìm kiếm học sinh, số điện thoại, báo cáo...</span>
            <kbd className="hidden lg:inline-block ml-auto px-1.5 py-0.5 text-[10px] bg-white/15 rounded text-white font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Search on mobile */}
          <button
            onClick={onOpenSearchModal}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 text-white transition"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-white/10 text-white transition"
              title="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5 text-blue-100" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#172B4D] rounded-2xl shadow-2xl border border-[#E3ECF8] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3.5 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-[#E3ECF8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#172B4D]">Thông báo lớp 8A2</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-[#1677FF] text-white rounded-full">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-[#1677FF] hover:underline font-semibold"
                    >
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#E3ECF8]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6B7A90]">
                      Không có thông báo mới nào
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-blue-50/60 cursor-pointer transition flex items-start gap-3 ${
                          !notif.read ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !notif.read ? 'bg-[#1677FF]' : 'bg-slate-300'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#172B4D]">{notif.title}</p>
                          <p className="text-xs text-[#6B7A90] mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-white/10 transition border border-transparent hover:border-white/15"
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                alt="Teacher Avatar"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-300/40"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold leading-tight">{roleLabels[currentRole].title}</div>
                <div className="text-[11px] text-blue-200 leading-tight">
                  {roleLabels[currentRole].subtitle}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-200" />
            </button>

            {/* User & Role Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white text-[#172B4D] rounded-2xl shadow-2xl border border-[#E3ECF8] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-[#E3ECF8] bg-slate-50">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Đang đăng nhập với vai trò:
                  </p>
                  <p className="text-sm font-bold text-[#1677FF] mt-0.5">
                    {roleLabels[currentRole].title}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-[#1677FF]">
                    {currentRole}
                  </span>
                </div>

                {/* Role Switcher (Section 19 in Requirements) */}
                <div className="p-2 border-b border-[#E3ECF8]">
                  <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi vai trò kiểm thử:
                  </p>
                  {(['GVCN', 'TEACHER', 'ADMIN', 'PARENT', 'STUDENT'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                        currentRole === r
                          ? 'bg-blue-50 text-[#1677FF] font-bold'
                          : 'text-[#172B4D] hover:bg-slate-100'
                      }`}
                    >
                      <span>{roleLabels[r].subtitle} ({r})</span>
                      {currentRole === r && <Check className="w-4 h-4 text-[#1677FF]" />}
                    </button>
                  ))}
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cài đặt tài khoản & Phân quyền
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
