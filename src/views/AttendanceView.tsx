import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Send,
  Search,
  Filter,
  Users,
  Check
} from 'lucide-react';
import { Student, AttendanceStatus } from '../types';
import { useToast } from '../components/common/Toast';

interface AttendanceViewProps {
  students: Student[];
  onToggleAttendance: (studentId: string, day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => void;
  onSetAllPresent: (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  onToggleAttendance,
  onSetAllPresent,
}) => {
  const { showToast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState('Tuần 4');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [search, setSearch] = useState('');

  const days: { key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'; label: string; date: string }[] = [
    { key: 'monday', label: 'Thứ 2', date: '21/04' },
    { key: 'tuesday', label: 'Thứ 3', date: '22/04' },
    { key: 'wednesday', label: 'Thứ 4', date: '23/04' },
    { key: 'thursday', label: 'Thứ 5', date: '24/04' },
    { key: 'friday', label: 'Thứ 6', date: '25/04' },
  ];

  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    return matchSearch && matchGroup;
  });

  // Calculate stats for current week (Friday/latest day as sample)
  const total = students.length;
  const absences = students.filter((s) => s.totalAbsences > 0).length;
  const lates = students.filter((s) => s.totalLate > 0).length;
  const present = total - absences;
  const rate = Number(((present / total) * 100).toFixed(1));

  const handleSendSmsAbsentees = () => {
    showToast('Đang kết nối cổng tin nhắn Zalo/SMS tới phụ huynh học sinh vắng...', 'info');
    setTimeout(() => {
      showToast('Đã gửi thông báo vắng học tới 2 phụ huynh thành công!', 'success');
    }, 1000);
  };

  const handleExportExcel = () => {
    showToast('Đang kết xuất sổ điểm danh chi tiết tháng 4/2025...', 'info');
    setTimeout(() => {
      showToast('Đã tải xuống file Diem_Danh_Chi_Tiet_8A2.xlsx thành công!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">QUẢN LÝ CHUYÊN CẦN & ĐIỂM DANH</h2>
            <p className="text-xs text-[#6B7A90]">
              Điểm danh hàng ngày theo buổi, theo dõi học sinh đi trễ, nghỉ phép và cảnh báo vắng học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-[#172B4D] focus:outline-none"
          >
            <option value="Tuần 4">Tuần 4 (21/04 - 27/04/2025)</option>
            <option value="Tuần 3">Tuần 3 (14/04 - 20/04/2025)</option>
            <option value="Tuần 2">Tuần 2 (07/04 - 13/04/2025)</option>
            <option value="Tuần 1">Tuần 1 (31/03 - 06/04/2025)</option>
          </select>

          <button
            onClick={handleSendSmsAbsentees}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition"
          >
            <Send className="w-4 h-4 text-amber-600" />
            <span>Nhắn tin PH vắng</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1677FF] border border-blue-200 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for Attendance */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-slate-500">Sĩ số lớp</span>
          <div className="text-2xl font-black text-[#172B4D] mt-1">{total}</div>
          <span className="text-[10px] text-slate-400">100% học sinh</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-emerald-600">Có mặt trung bình</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{present}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">{rate}% tỷ lệ chuyên cần</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-amber-600">Nghỉ phép</span>
          <div className="text-2xl font-black text-amber-600 mt-1">1</div>
          <span className="text-[10px] text-slate-400">Có đơn xin phép</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-rose-600">Nghỉ không phép</span>
          <div className="text-2xl font-black text-rose-600 mt-1">1</div>
          <span className="text-[10px] text-rose-700 font-semibold">Cần nhắc nhở gấp</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-blue-600">Đi muộn</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{lates}</div>
          <span className="text-[10px] text-slate-400">Đã ghi sổ cờ đỏ</span>
        </div>
      </div>

      {/* Filter and Quick Fill */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Tổ:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 border border-[#E3ECF8] rounded-xl py-2 px-3 text-xs font-semibold text-[#172B4D] focus:outline-none"
            >
              <option value="all">Tất cả tổ</option>
              <option value="Tổ 1">Tổ 1</option>
              <option value="Tổ 2">Tổ 2</option>
              <option value="Tổ 3">Tổ 3</option>
              <option value="Tổ 4">Tổ 4</option>
            </select>
          </div>
        </div>

        {/* Quick điểm danh tất cả */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Điểm danh nhanh cả lớp:</span>
          {days.map((d) => (
            <button
              key={d.key}
              onClick={() => onSetAllPresent(d.key)}
              className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg font-bold text-slate-700 transition"
              title={`Điểm danh tất cả Có mặt ngày ${d.label}`}
            >
              ✓ {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                <th className="py-3 px-3">STT</th>
                <th className="py-3 px-3">Ảnh</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-2">Tổ</th>
                <th className="py-3 px-3">SĐT Phụ huynh</th>
                {days.map((d) => (
                  <th key={d.key} className="py-3 px-3 text-center">
                    <div>{d.label}</div>
                    <div className="text-[10px] font-normal text-slate-400">{d.date}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center">Có mặt</th>
                <th className="py-3 px-3 text-center">Vắng</th>
                <th className="py-3 px-3 text-center">Đi trễ</th>
                <th className="py-3 px-3 text-center">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {filtered.map((s, idx) => {
                const attendedDays = days.filter(
                  (d) => s.weeklyAttendance[d.key] === 'present' || s.weeklyAttendance[d.key] === 'late'
                ).length;
                const studentRate = Math.round((attendedDays / days.length) * 100);

                return (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <img
                        src={s.avatar}
                        alt={s.fullName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#172B4D] whitespace-nowrap">
                      {s.fullName}
                    </td>
                    <td className="py-2.5 px-2 text-slate-600">{s.group}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {s.parentPhone}
                    </td>

                    {/* Day toggles */}
                    {days.map((d) => {
                      const st = s.weeklyAttendance[d.key];
                      return (
                        <td key={d.key} className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onToggleAttendance(s.id, d.key)}
                            className="inline-flex items-center justify-center p-1 rounded-lg hover:scale-115 transition"
                            title={`Nhấn để chuyển trạng thái (${st})`}
                          >
                            {st === 'present' && (
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                ✓
                              </span>
                            )}
                            {st === 'late' && (
                              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                ⏱
                              </span>
                            )}
                            {st === 'excused' && (
                              <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                P
                              </span>
                            )}
                            {st === 'unexcused' && (
                              <span className="w-6 h-6 rounded-full bg-rose-700 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                                K
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">
                      {attendedDays}/5
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">
                      {s.totalAbsences}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-amber-600">
                      {s.totalLate}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          studentRate === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : studentRate >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {studentRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-[#E3ECF8] bg-slate-50 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#172B4D]">Chú thích ký hiệu:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span>Có mặt</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">⏱</span>
              <span>Đi trễ</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">P</span>
              <span>Nghỉ có phép</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px] font-bold">K</span>
              <span>Nghỉ không phép</span>
            </span>
          </div>

          <span className="italic text-slate-400">
            * Nhấp chuột trực tiếp vào từng ô để thay đổi trạng thái điểm danh
          </span>
        </div>
      </div>
    </div>
  );
};
