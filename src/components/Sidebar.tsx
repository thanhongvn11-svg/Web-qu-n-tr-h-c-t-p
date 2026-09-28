import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Clock,
  ShieldCheck,
  Trophy,
  UserCheck,
  BarChart3,
  FileText,
  Bot,
  Settings,
  Sparkles,
  BookOpen,
  X,
  School
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  concernCount?: number;
  awardCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  currentRole,
  concernCount = 4,
  awardCount = 5,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'students', label: 'Học sinh', icon: Users, badge: '38' },
    { id: 'academics', label: 'Học tập', icon: GraduationCap },
    { id: 'attendance', label: 'Chuyên cần', icon: Clock },
    { id: 'conduct', label: 'Nề nếp - Rèn luyện', icon: ShieldCheck, badge: concernCount > 0 ? `${concernCount}` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'awards', label: 'Thi đua / Tuyên dương', icon: Trophy, badge: awardCount > 0 ? `${awardCount}` : undefined, badgeColor: 'bg-emerald-500' },
    { id: 'profiles', label: 'Phụ huynh & Cá nhân', icon: UserCheck },
    { id: 'statistics', label: 'Thống kê', icon: BarChart3 },
    { id: 'reports', label: 'Báo cáo', icon: FileText },
    { id: 'ai_assistant', label: 'Trợ lý AI GVCN', icon: Bot, isAi: true },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#06367A] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-[#0B2D64] shadow-2xl lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header in sidebar for mobile or top branding */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#042452]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1677FF] flex items-center justify-center text-white shadow-md">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wide text-white block">
                LỚP HỌC 8A2
              </span>
              <span className="text-[11px] text-blue-200 block font-medium">
                THCS Gia An
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-blue-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-[#1677FF] text-white shadow-md shadow-blue-900/30'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.isAi ? 'text-amber-300' : 'text-blue-200'
                  }`}
                />
                <span className="truncate flex-1 text-left">{item.label}</span>
                {item.isAi && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 shadow-xs">
                    AI
                  </span>
                )}
                {item.badge && !item.isAi && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${
                      item.badgeColor || (isActive ? 'bg-white/30 text-white' : 'bg-blue-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Banner Inspiration (Exact match to screenshot) */}
        <div className="p-4 border-t border-white/10 bg-[#042452]">
          <div className="relative rounded-2xl p-4 text-center bg-gradient-to-b from-blue-900/60 to-blue-950/90 border border-blue-400/20 overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-200">
                <BookOpen className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            <p className="text-xs font-bold text-white tracking-wide italic leading-snug">
              “Vì một lớp học hạnh phúc và thành công!”
            </p>
            <p className="text-[10px] text-blue-200 mt-1">
              GVCN: Nguyễn Thị Hồng Anh
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
