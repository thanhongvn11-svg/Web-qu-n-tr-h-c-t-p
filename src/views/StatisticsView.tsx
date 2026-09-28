import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Award,
  Users,
  Clock,
  ShieldCheck,
  Download
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import { Student } from '../types';
import { MONTHLY_GPA_TREND } from '../data/mockData';
import { useToast } from '../components/common/Toast';

interface StatisticsViewProps {
  students: Student[];
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ students }) => {
  const { showToast } = useToast();
  const [timeFilter, setTimeFilter] = useState('Học kỳ II');

  // Academic breakdown
  const pieData = [
    { name: 'Tốt', value: 24, percent: '63.2%', color: '#10B981' },
    { name: 'Khá', value: 11, percent: '28.9%', color: '#1677FF' },
    { name: 'Trung bình', value: 3, percent: '7.9%', color: '#F59E0B' },
    { name: 'Yếu', value: 0, percent: '0%', color: '#EF4444' },
  ];

  // Subject averages
  const subjectsData = [
    { subject: 'Toán', dtb: 8.1, color: '#1677FF' },
    { subject: 'Ngữ văn', dtb: 7.3, color: '#F97316' },
    { subject: 'KHTN', dtb: 7.6, color: '#10B981' },
    { subject: 'Tiếng Anh', dtb: 6.7, color: '#A855F7' },
    { subject: 'LS&ĐL', dtb: 7.8, color: '#EC4899' },
    { subject: 'GDCD', dtb: 7.5, color: '#06B6D4' },
    { subject: 'Tin học', dtb: 7.2, color: '#F59E0B' },
    { subject: 'Công nghệ', dtb: 7.0, color: '#6366F1' },
  ];

  // Attendance monthly trend
  const attendanceTrend = [
    { month: 'T9', rate: 98.2 },
    { month: 'T10', rate: 97.5 },
    { month: 'T11', rate: 96.8 },
    { month: 'T12', rate: 95.4 },
    { month: 'T1', rate: 97.0 },
    { month: 'T2', rate: 96.5 },
    { month: 'T3', rate: 96.2 },
    { month: 'T4', rate: 96.0 },
  ];

  const handleExportStats = () => {
    showToast('Đang kết xuất báo cáo thống kê phân tích số liệu lớp 8A2...', 'info');
    setTimeout(() => {
      showToast('Đã tải xuống file Thong_Ke_Tong_Hop_8A2.pdf thành công!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">THỐNG KÊ TỔNG HỢP & PHÂN TÍCH</h2>
            <p className="text-xs text-[#6B7A90]">
              Biểu đồ trực quan kết quả học tập, chuyên cần, nề nếp và so sánh giữa các tổ lớp 8A2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-[#172B4D] focus:outline-none"
          >
            <option value="Tuần này">Tuần này</option>
            <option value="Tháng này">Tháng này (Tháng 4/2025)</option>
            <option value="Học kỳ I">Học kỳ I</option>
            <option value="Học kỳ II">Học kỳ II</option>
            <option value="Cả năm">Cả năm học 2026-2027</option>
          </select>

          <button
            onClick={handleExportStats}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1677FF] border border-blue-200 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo thống kê</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-slate-500">Tổng số học sinh</span>
          <div className="text-3xl font-black text-[#172B4D] mt-1">{students.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% đúng độ tuổi</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-slate-500">Tỷ lệ chuyên cần</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">96.0%</div>
          <span className="text-[11px] text-slate-400">Duy trì top 3 khối 8</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-slate-500">Điểm trung bình lớp</span>
          <div className="text-3xl font-black text-[#1677FF] mt-1">7.42</div>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ +0.3 điểm so với đầu kỳ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <span className="text-xs font-bold text-slate-500">Số lượt vi phạm</span>
          <div className="text-3xl font-black text-amber-600 mt-1">4</div>
          <span className="text-[11px] text-slate-400">Giảm 50% so với tháng trước</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Academic Donut */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <h3 className="text-sm font-bold text-[#172B4D] mb-4">
            Phân loại kết quả học tập (38 học sinh)
          </h3>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} học sinh`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-[#172B4D]">8A2</span>
              <span className="text-[10px] text-slate-400">THCS Gia An</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <strong className="text-[#172B4D]">{item.value} ({item.percent})</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <h3 className="text-sm font-bold text-[#172B4D] mb-4">
            So sánh điểm trung bình giữa các môn học
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectsData} margin={{ top: 15, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3ECF8" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val: any) => [`${val} điểm`, 'ĐTB môn']} />
                <Bar dataKey="dtb" radius={[6, 6, 0, 0]}>
                  {subjectsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line Chart: Attendance Trend */}
      <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#172B4D]">
            Diễn biến tỷ lệ chuyên cần theo từng tháng trong năm học
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Trung bình: 96.6%
          </span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3ECF8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
              <YAxis domain={[90, 100]} ticks={[90, 92, 94, 96, 98, 100]} tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Tỷ lệ có mặt']} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
                label={{ position: 'top', fill: '#172B4D', fontSize: 10, fontWeight: 'bold' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
