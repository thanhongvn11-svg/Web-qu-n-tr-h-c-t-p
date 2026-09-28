import React, { useState } from 'react';
import {
  Settings,
  School,
  BookOpen,
  Users,
  Shield,
  RotateCcw,
  Save,
  CheckCircle2,
  Lock,
  Database
} from 'lucide-react';
import { UserRole } from '../types';
import { useToast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface SettingsViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentRole,
  onRoleChange,
  onResetData,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'class' | 'academic' | 'subjects' | 'roles' | 'database'>('class');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form states
  const [className, setClassName] = useState('8A2');
  const [grade, setGrade] = useState('Khối 8');
  const [classSize, setClassSize] = useState('38');
  const [homeroomTeacher, setHomeroomTeacher] = useState('Nguyễn Thị Hồng Anh');
  const [schoolName, setSchoolName] = useState('THCS Gia An');
  const [roomNumber, setRoomNumber] = useState('P201');
  const [academicYear, setAcademicYear] = useState('2026–2027');

  const subjectList = [
    'Toán học',
    'Ngữ văn',
    'Tiếng Anh',
    'Khoa học tự nhiên',
    'Lịch sử & Địa lí',
    'Giáo dục công dân',
    'Tin học',
    'Công nghệ',
    'Giáo dục thể chất',
    'Âm nhạc',
    'Mỹ thuật',
    'Hoạt động trải nghiệm',
  ];

  const rolesMatrix = [
    {
      role: 'ADMIN',
      title: 'Quản trị viên (BGH)',
      permissions: 'Toàn quyền cấu hình hệ thống, tạo lớp, phân quyền giáo viên, truy xuất toàn bộ dữ liệu trường.',
      badge: 'bg-rose-100 text-rose-800',
    },
    {
      role: 'GVCN',
      title: 'Giáo viên chủ nhiệm (Cô Hồng Anh)',
      permissions: 'Quản lý toàn diện học sinh lớp 8A2, sổ điểm, chuyên cần, nề nếp thi đua, liên lạc phụ huynh và xuất báo cáo.',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      role: 'TEACHER',
      title: 'Giáo viên bộ môn',
      permissions: 'Xem danh sách học sinh và chỉ được phép nhập, chỉnh sửa điểm số đối với môn học mình phụ trách.',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      role: 'PARENT',
      title: 'Phụ huynh học sinh',
      permissions: 'Chỉ được xem thông tin hồ sơ, điểm số, chuyên cần và nhận thông báo liên quan trực tiếp đến con mình.',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    {
      role: 'STUDENT',
      title: 'Học sinh',
      permissions: 'Chỉ được xem kết quả học tập, rèn luyện cá nhân và các thông báo thi đua của lớp.',
      badge: 'bg-purple-100 text-purple-800',
    },
  ];

  const handleSaveClassInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Đã lưu thông tin cấu hình lớp học thành công!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">CÀI ĐẶT HỆ THỐNG QUẢN TRỊ LỚP HỌC</h2>
            <p className="text-xs text-[#6B7A90]">
              Cấu hình năm học, thông tin lớp 8A2, danh mục môn học và ma trận phân quyền người dùng
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khôi phục dữ liệu mẫu 8A2</span>
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-[#E3ECF8] shadow-xs">
        {[
          { id: 'class', label: 'Thông tin lớp học', icon: School },
          { id: 'subjects', label: 'Danh mục môn học', icon: BookOpen },
          { id: 'roles', label: 'Phân quyền & RLS', icon: Shield },
          { id: 'database', label: 'Cơ sở dữ liệu Supabase', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Class Info */}
      {activeTab === 'class' && (
        <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-6 max-w-3xl">
          <form onSubmit={handleSaveClassInfo} className="space-y-4">
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wide border-b border-[#E3ECF8] pb-3">
              Thông tin hành chính lớp học
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Tên trường học
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Năm học
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Tên lớp
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Khối
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Sĩ số lớp
                </label>
                <input
                  type="text"
                  value={classSize}
                  onChange={(e) => setClassSize(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Phòng học
                </label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                  Giáo viên chủ nhiệm (GVCN)
                </label>
                <input
                  type="text"
                  value={homeroomTeacher}
                  onChange={(e) => setHomeroomTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E3ECF8] flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thông tin lớp</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Subjects */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-6 max-w-3xl space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wide border-b border-[#E3ECF8] pb-3">
            Danh sách môn học khối 8 theo chương trình GDPT 2018
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {subjectList.map((subj, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-[#1677FF] text-xs font-bold flex items-center gap-2 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>{subj}</span>
              </span>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            Hệ thống tự động tính điểm trung bình môn, điểm trung bình chung học kỳ theo trọng số hệ số 1 (điểm miệng, 15 phút), hệ số 2 (kiểm tra 1 tiết giữa kỳ) và hệ số 3 (kiểm tra cuối kỳ).
          </div>
        </div>
      )}

      {/* Tab 3: Roles & RLS */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-6 max-w-4xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#E3ECF8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wide">
                Ma trận phân quyền hệ thống (Role-Based Access Control)
              </h3>
              <p className="text-xs text-[#6B7A90] mt-0.5">
                Được bảo vệ bởi cơ chế Row Level Security (RLS) của Supabase PostgreSQL
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Vai trò hiện tại:</span>
              <span className="px-2.5 py-1 rounded-md font-bold bg-blue-100 text-[#1677FF]">
                {currentRole}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {rolesMatrix.map((item) => (
              <div
                key={item.role}
                onClick={() => onRoleChange(item.role as UserRole)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  currentRole === item.role
                    ? 'border-[#1677FF] bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                    : 'border-[#E3ECF8] hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${item.badge}`}>
                      {item.role}
                    </span>
                    <h4 className="text-xs font-bold text-[#172B4D]">{item.title}</h4>
                    {currentRole === item.role && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7A90] max-w-2xl leading-relaxed">
                    {item.permissions}
                  </p>
                </div>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    currentRole === item.role
                      ? 'bg-[#1677FF] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {currentRole === item.role ? 'Đang kích hoạt' : 'Chuyển vai trò này'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Database Schema Info */}
      {activeTab === 'database' && (
        <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-6 max-w-4xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E3ECF8] pb-3">
            <Database className="w-5 h-5 text-[#1677FF]" />
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wide">
              Cấu trúc CSDL Supabase PostgreSQL (Section 18)
            </h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống đã chuẩn hóa toàn bộ các bảng dữ liệu liên kết thông qua <code>student_id</code> duy nhất:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { table: 'users', desc: 'id, email, full_name, role, avatar' },
              { table: 'students', desc: 'id, student_code, full_name, birthday, gender, group, parent_phone, address, status' },
              { table: 'scores', desc: 'id, student_id, math, literature, science, english, history_geo, gpa, semester' },
              { table: 'attendance', desc: 'id, student_id, date, status, note' },
              { table: 'behavior', desc: 'id, student_id, date, violation, action, points_deducted, status' },
              { table: 'achievements', desc: 'id, student_id, category, title, description, points_added, date' },
              { table: 'teacher_notes', desc: 'id, student_id, note, action_plan, created_at' },
              { table: 'weekly_reports', desc: 'id, week, date_range, general_comment, created_at' },
              { table: 'notifications', desc: 'id, title, description, type, read, created_at' },
            ].map((t) => (
              <div key={t.table} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono font-bold text-[#1677FF] block mb-1">{t.table}</span>
                <span className="text-[11px] text-slate-500 font-mono block">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Reset */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          onResetData();
          showToast('Đã khôi phục toàn bộ 38 học sinh và dữ liệu lớp 8A2 về mặc định!', 'success');
        }}
        title="Khôi phục dữ liệu mẫu ban đầu?"
        message="Hành động này sẽ thiết lập lại toàn bộ danh sách 38 học sinh, điểm số các môn, nề nếp thi đua và báo cáo về trạng thái nguyên bản."
        confirmText="Xác nhận khôi phục"
      />
    </div>
  );
};
