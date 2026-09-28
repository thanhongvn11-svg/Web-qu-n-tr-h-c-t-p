import React, { useState } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Download,
  Sparkles,
  ChevronRight,
  Send,
  Check,
  AlertCircle,
  FileText,
  Bookmark,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Student, AttendanceStatus, ViolationRecord, AchievementRecord } from '../types';
import { MONTHLY_GPA_TREND } from '../data/mockData';
import { useToast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onOpenAddStudent: () => void;
  onOpenEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onDeleteAllStudents?: () => void;
  onToggleAttendance: (studentId: string, day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => void;
  onNavigate: (view: string, studentId?: string) => void;
  onQuickAiPrompt: (promptText: string) => void;
  onOpenExcelImport?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onOpenAddStudent,
  onOpenEditStudent,
  onDeleteStudent,
  onDeleteAllStudents,
  onToggleAttendance,
  onNavigate,
  onQuickAiPrompt,
  onOpenExcelImport,
}) => {
  const { showToast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('hs-01');
  const [tableSearch, setTableSearch] = useState('');
  const [tablePage, setTablePage] = useState(1);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [alertTab, setAlertTab] = useState<'warnings' | 'suggestions'>('warnings');
  const [conductTab, setConductTab] = useState<'day' | 'week' | 'month'>('week');
  const [profileTab, setProfileTab] = useState<'general' | 'study' | 'conduct' | 'family' | 'notes'>('general');
  const [selectedSemester, setSelectedSemester] = useState('Học kỳ II');
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  // Currently focused student in Profile card
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0] || null;

  // Filter students for the table
  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(tableSearch.toLowerCase()) ||
      s.group.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const pageSize = 5;
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  // Subject averages for chart matching screenshot
  const subjectChartData = [
    { name: 'Toán', dtb: 8.1, fill: '#1677FF' },
    { name: 'Ngữ văn', dtb: 7.3, fill: '#F97316' },
    { name: 'KHTN', dtb: 7.6, fill: '#10B981' },
    { name: 'Tiếng Anh', dtb: 6.7, fill: '#A855F7' },
    { name: 'LS&ĐL', dtb: 7.8, fill: '#EC4899' },
    { name: 'GDCD', dtb: 7.5, fill: '#06B6D4' },
    { name: 'Tin học', dtb: 7.2, fill: '#F59E0B' },
    { name: 'CN', dtb: 7.0, fill: '#6366F1' },
  ];

  // Donut chart for Academic classification (Tốt: 24, Khá: 11, TB: 3, Yếu: 0)
  const academicPieData = [
    { name: 'Tốt', value: 24, percent: '63%', color: '#10B981' },
    { name: 'Khá', value: 11, percent: '29%', color: '#1677FF' },
    { name: 'Trung bình', value: 3, percent: '8%', color: '#F59E0B' },
    { name: 'Yếu', value: 0, percent: '0%', color: '#EF4444' },
  ];

  const handleAiGenerate = () => {
    if (!aiPromptInput.trim()) {
      showToast('Vui lòng nhập yêu cầu cho Trợ lý AI', 'info');
      return;
    }
    onQuickAiPrompt(aiPromptInput);
    setAiPromptInput('');
  };

  const handleExportAttendanceExcel = () => {
    showToast('Đang kết xuất bảng điểm danh tuần ra file Excel...', 'info');
    setTimeout(() => {
      showToast('Đã tải xuống file Diem_Danh_8A2_Tuan4.xlsx thành công!', 'success');
    }, 800);
  };

  const handleExportReport = () => {
    showToast('Đang kết xuất báo cáo tuần 4 sang file PDF...', 'info');
    setTimeout(() => {
      showToast('Đã xuất báo cáo tuần 4 thành công!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP CONTROLS & BREADCRUMBS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 px-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172B4D]">
          <span className="text-[#1677FF] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1677FF]"></span>
            Trang chủ
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600">Bảng điều khiển lớp 8A2</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="bg-slate-50 border border-[#E3ECF8] rounded-xl text-xs font-bold text-[#172B4D] py-2 pl-3 pr-8 focus:outline-none focus:border-[#1677FF]">
              <option value="8A2">Lớp 8A2 (Sĩ số: 38)</option>
              <option value="8A1">Lớp 8A1</option>
              <option value="8A3">Lớp 8A3</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-blue-50/60 border border-blue-200/60 rounded-xl px-3 py-2 text-xs font-semibold text-[#0D47A1]">
            <Calendar className="w-3.5 h-3.5 text-[#1677FF]" />
            <span>Tuần 4 (21/04 - 27/04/2025)</span>
          </div>
        </div>
      </div>

      {/* 2. BANNER & TOP KPI CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Welcome Teacher Banner */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-50 rounded-full pointer-events-none group-hover:scale-110 transition duration-500" />
          
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&auto=format&fit=crop&q=80"
                alt="THCS Gia An"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-md">
                GVCN LỚP 8A2
              </span>
              <h2 className="text-base font-extrabold text-[#172B4D] mt-1.5 leading-snug">
                Chào mừng cô <br />
                <span className="text-[#1677FF]">Nguyễn Thị Hồng Anh!</span>
              </h2>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E3ECF8] text-xs text-[#6B7A90] italic leading-relaxed">
            “Mỗi học sinh là một cá thể đặc biệt, hãy luôn quan tâm và đồng hành.”
          </div>
        </div>

        {/* 4 Colored KPI Cards */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Total Students */}
          <div 
            onClick={() => onNavigate('students')}
            className="bg-[#1677FF] text-white p-4 rounded-2xl shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                100%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black">38</div>
              <div className="text-xs font-semibold text-blue-100 mt-1">Tổng số học sinh</div>
            </div>
          </div>

          {/* Card 2: Good Academic */}
          <div 
            onClick={() => onNavigate('academics')}
            className="bg-[#10B981] text-white p-4 rounded-2xl shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/20">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                84.2%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black">32</div>
              <div className="text-xs font-semibold text-emerald-100 mt-1">Học tập tốt</div>
            </div>
          </div>

          {/* Card 3: Need Tracking */}
          <div 
            onClick={() => setAlertTab('warnings')}
            className="bg-[#F59E0B] text-white p-4 rounded-2xl shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/20">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                10.5%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black">4</div>
              <div className="text-xs font-semibold text-amber-100 mt-1">Cần theo dõi</div>
            </div>
          </div>

          {/* Card 4: Need Parent Discussion */}
          <div 
            onClick={() => onNavigate('profiles')}
            className="bg-[#EF4444] text-white p-4 rounded-2xl shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/20">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Gấp
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black">2</div>
              <div className="text-xs font-semibold text-rose-100 mt-1">Cần trao đổi PH</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK STATS ROW: ĐIỂM TB LỚP, CHUYÊN CẦN, HỌC SINH NỔI BẬT & CẦN QUAN TÂM */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Điểm trung bình lớp */}
        <div className="md:col-span-3 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B7A90]">Điểm trung bình lớp</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1677FF]">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="my-2">
            <span className="text-4xl font-black text-[#1677FF] tracking-tight">7,42</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
            <span>↑ +0,3</span>
            <span className="text-[11px] font-medium text-emerald-700">so với tuần trước</span>
          </div>
        </div>

        {/* Tình hình chuyên cần */}
        <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#6B7A90]">Tình hình chuyên cần</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1677FF]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-50/40 shrink-0">
              <span className="text-xl font-black text-[#172B4D]">96%</span>
            </div>
            <div className="space-y-1.5 text-xs font-medium text-[#172B4D]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Có mặt: <strong>36</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Nghỉ: <strong>1</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Đi muộn: <strong>1</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Học sinh nổi bật & Cần quan tâm */}
        <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Học sinh nổi bật</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-left">
                <div className="text-xs font-bold text-emerald-900 truncate">Nguyễn Văn A</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Tiến bộ +1.5</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-left">
                <div className="text-xs font-bold text-emerald-900 truncate">Trần Thị Bích Ngọc</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Tiến bộ +1.2</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-left">
                <div className="text-xs font-bold text-emerald-900 truncate">Lê Minh Hoàng</div>
                <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Tiến bộ +1.0</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E3ECF8]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Cần quan tâm</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-900">Phạm Thị C</div>
                  <div className="text-[11px] text-rose-600">Giảm 1.2 điểm</div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-04')}
                  className="text-[10px] text-rose-700 underline font-semibold"
                >
                  Xem
                </button>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-900">Trần Văn B</div>
                  <div className="text-[11px] text-rose-600">Nghỉ 3 buổi</div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-06')}
                  className="text-[10px] text-rose-700 underline font-semibold"
                >
                  Xem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN CHARTS: KẾT QUẢ THEO MÔN & XU HƯỚNG ĐIỂM TRUNG BÌNH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Kết quả học tập theo môn */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-[#1677FF]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172B4D]">
                Kết quả học tập theo môn (ĐTB lớp)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Học kỳ II</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3ECF8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} điểm`, 'ĐTB lớp']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E3ECF8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="dtb" radius={[6, 6, 0, 0]} label={{ position: 'top', fill: '#172B4D', fontSize: 11, fontWeight: 'bold' }}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Xu hướng điểm trung bình lớp & Badges */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-[#1677FF]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#172B4D]">
                Xu hướng điểm trung bình lớp
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1677FF] bg-blue-50 px-2 py-0.5 rounded-md">
                T9 → T4
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div className="sm:col-span-3 h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_GPA_TREND} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3ECF8" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[6.0, 9.0]} ticks={[6.0, 7.0, 7.5, 8.0, 9.0]} tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} điểm`, 'ĐTB tháng']}
                    contentStyle={{ borderRadius: 12, border: '1px solid #E3ECF8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gpa"
                    stroke="#1677FF"
                    strokeWidth={3}
                    dot={{ fill: '#1677FF', r: 4 }}
                    activeDot={{ r: 6 }}
                    label={{ position: 'top', fill: '#172B4D', fontSize: 10, fontWeight: 'bold' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Badges on right side matching screenshot */}
            <div className="space-y-2.5 sm:col-span-1">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-lg">
                  <span>↑</span>
                  <span>5</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-800 leading-tight mt-0.5">
                  Học sinh tiến bộ
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-lg">
                  <span>!</span>
                  <span>3</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-800 leading-tight mt-0.5">
                  Học sinh cần hỗ trợ
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-center">
                <div className="flex items-center justify-center gap-1 text-rose-600 font-bold text-lg">
                  <span>☎</span>
                  <span>2</span>
                </div>
                <div className="text-[11px] font-semibold text-rose-800 leading-tight mt-0.5">
                  Cần trao đổi PH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MIDDLE SECTION: DANH SÁCH HỌC SINH + HỒ SƠ HỌC SINH CHI TIẾT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bảng danh sách học sinh (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172B4D]">Danh sách học sinh</h3>
              </div>
              <div className="flex items-center gap-2">
                {students.length > 0 && onDeleteAllStudents && (
                  <button
                    onClick={() => setShowDeleteAllDialog(true)}
                    title="Xóa toàn bộ danh sách học sinh"
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  </button>
                )}
                {onOpenExcelImport && (
                  <button
                    onClick={onOpenExcelImport}
                    title="Nhập danh sách học sinh từ file Excel"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold shadow-xs transition"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Import Excel</span>
                  </button>
                )}
                <button
                  onClick={onOpenAddStudent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm học sinh</span>
                </button>
              </div>
            </div>

            {/* Quick search input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setTablePage(1);
                }}
                placeholder="Tìm kiếm theo tên, lớp, tổ..."
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                    <th className="py-2 px-1">STT</th>
                    <th className="py-2 px-2">Ảnh</th>
                    <th className="py-2 px-2">Họ và tên</th>
                    <th className="py-2 px-2">Ngày sinh</th>
                    <th className="py-2 px-1">Tổ</th>
                    <th className="py-2 px-2">Điện thoại</th>
                    <th className="py-2 px-2">Xếp loại</th>
                    <th className="py-2 px-2 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECF8] text-xs">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Chưa có học sinh nào. Bấm "+ Thêm học sinh" hoặc "Import Excel" để thêm vào lớp.
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((s, idx) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudentId(s.id)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition ${
                        selectedStudentId === s.id ? 'bg-blue-50/80 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-1 font-mono text-slate-400">
                        {(tablePage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-2.5 px-2">
                        <img
                          src={s.avatar}
                          alt={s.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                      </td>
                      <td className="py-2.5 px-2 font-bold text-[#172B4D] truncate max-w-[110px]">
                        {s.fullName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 whitespace-nowrap">
                        {s.birthday}
                      </td>
                      <td className="py-2.5 px-1 font-medium text-slate-600">
                        {s.group}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {s.parentPhone}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.academicRating === 'Tốt'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.academicRating === 'Khá'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {s.academicRating}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Xem chi tiết hồ sơ"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(s.id);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Sửa thông tin"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEditStudent(s);
                            }}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-md transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Xóa học sinh"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteStudent(s);
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-100 rounded-md transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E3ECF8] text-xs text-slate-500">
            <span>Hiển thị {paginatedStudents.length}/{filteredStudents.length} học sinh</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTablePage(i + 1)}
                  className={`w-6 h-6 rounded-md text-xs font-semibold transition ${
                    tablePage === i + 1
                      ? 'bg-[#1677FF] text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hồ sơ học sinh tương tác (7 cols) */}
        {selectedStudent && (
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
            <div>
              {/* Profile Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3ECF8]">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-[#172B4D]">
                        {selectedStudent.fullName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1677FF] text-[10px] font-bold font-mono">
                        {selectedStudent.studentCode}
                      </span>
                    </div>
                    <div className="text-xs text-[#6B7A90] mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>Ngày sinh: <strong>{selectedStudent.birthday}</strong></span>
                      <span>Tổ: <strong>{selectedStudent.group}</strong> - Lớp 8A2</span>
                    </div>
                    <div className="text-[11px] text-[#6B7A90] mt-0.5">
                      Địa chỉ: {selectedStudent.address}
                    </div>
                    <div className="text-[11px] text-[#6B7A90]">
                      Phụ huynh: <strong>{selectedStudent.parentName}</strong> -{' '}
                      <span className="text-[#1677FF] font-semibold">{selectedStudent.parentPhone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectStudent(selectedStudent.id)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1677FF] text-xs font-bold rounded-xl transition"
                >
                  Xem chi tiết hồ sơ →
                </button>
              </div>

              {/* Profile Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E3ECF8] pt-3 pb-2 text-xs font-bold">
                {[
                  { id: 'general', label: 'Thông tin chung' },
                  { id: 'study', label: 'Kết quả học tập' },
                  { id: 'conduct', label: 'Rèn luyện' },
                  { id: 'family', label: 'Hoàn cảnh' },
                  { id: 'notes', label: 'Ghi chú GVCN' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`px-3 py-1 rounded-lg transition ${
                      profileTab === tab.id
                        ? 'bg-[#1677FF] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sub-grid of scores & Teacher note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Left: Điểm các môn */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-[#E3ECF8]">
                  <span className="text-xs font-bold text-[#172B4D] mb-2 block">
                    Kết quả học tập (ĐTB)
                  </span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Toán:</span>
                      <strong className="text-[#1677FF]">{selectedStudent.scores.math}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Ngữ văn:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.literature}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">KHTN:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.science}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">Tiếng Anh:</span>
                      <strong className={selectedStudent.scores.english < 5 ? 'text-rose-600' : 'text-[#172B4D]'}>
                        {selectedStudent.scores.english}
                      </strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">LS&ĐL:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.historyGeo}</strong>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200">
                      <span className="text-slate-600">GDCD:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.civics}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-600">Tin học:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.informatics}</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-600">Công nghệ:</span>
                      <strong className="text-[#172B4D]">{selectedStudent.scores.technology}</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Nhận xét của GVCN */}
                <div className="space-y-3">
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                    <span className="text-xs font-bold text-[#0D47A1] mb-1 block">
                      Nhận xét của GVCN
                    </span>
                    <p className="text-xs text-[#172B4D] leading-relaxed">
                      {selectedStudent.teacherNote ||
                        'Học tập ổn định, có ý thức nề nếp tốt. Tích cực tham gia các phong trào thi đua của lớp.'}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Đề xuất hỗ trợ
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {selectedStudent.actionPlan ||
                        '• Động viên học sinh phát huy thế mạnh môn Toán.\n• Phối hợp với phụ huynh theo dõi nề nếp tự học tại nhà.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="pt-3 mt-3 border-t border-[#E3ECF8] flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Xếp loại học lực: <strong className="text-[#1677FF]">{selectedStudent.academicRating}</strong> (ĐTB: {selectedStudent.gpa})
              </span>
              <button
                onClick={() => {
                  showToast(`Đã lưu ghi chú cho học sinh ${selectedStudent.fullName}!`, 'success');
                }}
                className="px-3 py-1 bg-[#1677FF] text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                Cập nhật ghi chú
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. SECTION: THEO DÕI KẾT QUẢ HỌC TẬP & DONUT PHÂN LOẠI */}
      <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1677FF]" />
            <h3 className="text-sm font-bold text-[#172B4D]">Theo dõi kết quả học tập</h3>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-50 border border-[#E3ECF8] rounded-xl text-xs font-bold text-[#172B4D] py-1.5 px-3 focus:outline-none"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentCode})
                </option>
              ))}
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-50 border border-[#E3ECF8] rounded-xl text-xs font-semibold text-[#172B4D] py-1.5 px-3 focus:outline-none"
            >
              <option value="Học kỳ I">Học kỳ I</option>
              <option value="Học kỳ II">Học kỳ II</option>
              <option value="Cả năm">Cả năm</option>
            </select>

            <button
              onClick={() => onNavigate('academics')}
              className="px-3 py-1.5 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition"
            >
              Xem chi tiết sổ điểm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Detailed table of tests for student */}
          <div className="lg:col-span-8 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                  <th className="py-2 px-3">Môn học</th>
                  <th className="py-2 px-3 text-center">Điểm TB miệng</th>
                  <th className="py-2 px-3 text-center">Điểm 15p</th>
                  <th className="py-2 px-3 text-center">Điểm 1 tiết</th>
                  <th className="py-2 px-3 text-center">Điểm TB môn</th>
                  <th className="py-2 px-3 text-center">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECF8]">
                {[
                  { subject: 'Toán', oral: 8.5, test15m: 8.8, test45m: 8.7, tb: selectedStudent?.scores.math || 8.5, rating: 'Tốt' },
                  { subject: 'Ngữ văn', oral: 7.0, test15m: 7.2, test45m: 6.8, tb: selectedStudent?.scores.literature || 7.0, rating: 'Khá' },
                  { subject: 'KHTN', oral: 8.0, test15m: 8.5, test45m: 8.2, tb: selectedStudent?.scores.science || 8.2, rating: 'Tốt' },
                  { subject: 'Tiếng Anh', oral: 6.0, test15m: 6.5, test45m: 6.8, tb: selectedStudent?.scores.english || 6.4, rating: 'Khá' },
                  { subject: 'LS&ĐL', oral: 7.5, test15m: 8.0, test45m: 7.8, tb: selectedStudent?.scores.historyGeo || 7.8, rating: 'Khá' },
                  { subject: 'GDCD', oral: 8.0, test15m: 8.0, test45m: 8.2, tb: selectedStudent?.scores.civics || 8.0, rating: 'Tốt' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="py-2 px-3 font-bold text-[#172B4D]">{row.subject}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{row.oral}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{row.test15m}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{row.test45m}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#1677FF]">{row.tb}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.rating === 'Tốt'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {row.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Donut Chart - Tỷ lệ xếp loại học lực (38 học sinh) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 border border-[#E3ECF8] flex flex-col items-center">
            <h4 className="text-xs font-bold text-[#172B4D] mb-2 self-start">
              Tỷ lệ xếp loại học lực toàn lớp
            </h4>
            <div className="relative w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={academicPieData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {academicPieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} học sinh`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-[#172B4D]">38</span>
                <span className="text-[10px] text-slate-400 font-medium">học sinh</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mt-2 w-full px-2">
              {academicPieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium">{item.name}:</span>
                  </div>
                  <strong className="text-[#172B4D]">
                    {item.value} ({item.percent})
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. BOTTOM ROW: THEO DÕI CHUYÊN CẦN + NỀ NẾP + BÁO CÁO + CẢNH BÁO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Theo dõi chuyên cần (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172B4D]">Theo dõi chuyên cần</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  21/04/2025 - 27/04/2025
                </span>
                <button
                  onClick={handleExportAttendanceExcel}
                  className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1677FF] text-xs font-semibold rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Excel</span>
                </button>
              </div>
            </div>

            {/* Attendance quick grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                    <th className="py-2 px-1">STT</th>
                    <th className="py-2 px-2">Họ và tên</th>
                    <th className="py-2 px-1 text-center">T2</th>
                    <th className="py-2 px-1 text-center">T3</th>
                    <th className="py-2 px-1 text-center">T4</th>
                    <th className="py-2 px-1 text-center">T5</th>
                    <th className="py-2 px-1 text-center">T6</th>
                    <th className="py-2 px-2 text-center">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECF8]">
                  {students.slice(0, 5).map((s, idx) => {
                    const days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday')[] = [
                      'monday',
                      'tuesday',
                      'wednesday',
                      'thursday',
                      'friday',
                    ];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="py-2 px-1 font-mono text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-2 font-bold text-[#172B4D] truncate max-w-[120px]">
                          {s.fullName}
                        </td>
                        {days.map((day) => {
                          const status = s.weeklyAttendance[day];
                          return (
                            <td key={day} className="py-2 px-1 text-center">
                              <button
                                onClick={() => onToggleAttendance(s.id, day)}
                                title="Bấm để đổi trạng thái"
                                className="w-5 h-5 rounded-full inline-flex items-center justify-center transition hover:scale-110"
                              >
                                {status === 'present' && (
                                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                                    ✓
                                  </span>
                                )}
                                {status === 'late' && (
                                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                                    ⏱
                                  </span>
                                )}
                                {(status === 'excused' || status === 'unexcused') && (
                                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                                    ✕
                                  </span>
                                )}
                              </button>
                            </td>
                          );
                        })}
                        <td className="py-2 px-2 text-center">
                          {s.totalAbsences > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Nghỉ ({s.totalAbsences})
                            </span>
                          ) : s.totalLate > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                              Đi muộn ({s.totalLate})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Có mặt
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom legend */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E3ECF8] text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Có mặt
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Đi muộn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Nghỉ học
              </span>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-[#1677FF] font-bold hover:underline"
            >
              Xem tất cả 38 học sinh →
            </button>
          </div>
        </div>

        {/* Nề nếp - Rèn luyện (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172B4D]">Nề nếp - Rèn luyện</h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
                {(['day', 'week', 'month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setConductTab(tab)}
                    className={`px-2 py-1 rounded-md transition ${
                      conductTab === tab ? 'bg-white text-[#1677FF] shadow-xs' : 'hover:text-[#172B4D]'
                    }`}
                  >
                    {tab === 'day' ? 'Theo ngày' : tab === 'week' ? 'Theo tuần' : 'Theo tháng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Merit & Demerit points breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Điểm cộng */}
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    +
                  </span>
                  Điểm cộng
                </span>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Đi học đầy đủ</span>
                    <strong className="text-emerald-600">+2</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Làm việc tốt</span>
                    <strong className="text-emerald-600">+2</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Giúp đỡ bạn</span>
                    <strong className="text-emerald-600">+3</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thành tích đặc biệt</span>
                    <strong className="text-emerald-600">+5</strong>
                  </div>
                </div>
              </div>

              {/* Điểm trừ */}
              <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1 mb-2">
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    -
                  </span>
                  Điểm trừ
                </span>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Quên sách/vở</span>
                    <strong className="text-rose-600">-1</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Không làm bài</span>
                    <strong className="text-rose-600">-1</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Đi muộn</span>
                    <strong className="text-rose-600">-2</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vi phạm nội quy</span>
                    <strong className="text-rose-600">-3</strong>
                  </div>
                </div>
              </div>

              {/* Xếp hạng thi đua các tổ */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#0D47A1]">Thi đua tuần 4</span>
                    <span className="text-xs font-black text-[#1677FF]">18 điểm (Tốt)</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-emerald-700">1. Tổ 1</span>
                      <strong className="text-[#172B4D]">92 điểm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>2. Tổ 2</span>
                      <strong className="text-[#172B4D]">88 điểm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Tổ 3</span>
                      <strong className="text-[#172B4D]">85 điểm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>4. Tổ 4</span>
                      <strong className="text-[#172B4D]">80 điểm</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E3ECF8] flex items-center justify-between text-xs">
            <span className="text-slate-500">Ghi nhận 4 lượt vi phạm trong tuần</span>
            <button
              onClick={() => onNavigate('conduct')}
              className="text-[#1677FF] font-bold hover:underline"
            >
              Quản lý sổ nề nếp & vi phạm →
            </button>
          </div>
        </div>
      </div>

      {/* 8. BOTTOM: BÁO CÁO NHANH BẰNG AI & CẢNH BÁO ĐỀ XUẤT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Báo cáo & Báo cáo nhanh AI (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172B4D]">Báo cáo tuần & Đánh giá</h3>
              </div>
              <div className="flex items-center gap-2">
                <select className="bg-slate-50 border border-[#E3ECF8] rounded-xl text-xs font-semibold py-1 px-2.5">
                  <option>Tuần 4 (21/04 - 27/04/2025)</option>
                  <option>Tuần 3</option>
                  <option>Tuần 2</option>
                </select>
                <button
                  onClick={handleExportReport}
                  className="px-2.5 py-1 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition"
                >
                  Xuất file
                </button>
              </div>
            </div>

            {/* Quick Report Shortcuts */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => onNavigate('reports')}
                className="p-2.5 rounded-xl border border-[#E3ECF8] hover:border-[#1677FF] hover:bg-blue-50/50 text-center transition"
              >
                <FileText className="w-4 h-4 text-[#1677FF] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#172B4D] block truncate">Báo cáo tuần</span>
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="p-2.5 rounded-xl border border-[#E3ECF8] hover:border-[#1677FF] hover:bg-blue-50/50 text-center transition"
              >
                <Calendar className="w-4 h-4 text-[#1677FF] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#172B4D] block truncate">Báo cáo tháng</span>
              </button>
              <button
                onClick={() => onNavigate('reports')}
                className="p-2.5 rounded-xl border border-[#E3ECF8] hover:border-[#1677FF] hover:bg-blue-50/50 text-center transition"
              >
                <Award className="w-4 h-4 text-[#1677FF] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#172B4D] block truncate">Nhận xét học sinh</span>
              </button>
            </div>

            {/* Báo cáo nhanh bằng AI Input */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Báo cáo nhanh bằng AI</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                  placeholder="Nhập yêu cầu (ví dụ: tạo nhận xét học sinh, báo cáo tuần...)"
                  className="flex-1 bg-white border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
                <button
                  onClick={handleAiGenerate}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1677FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tạo bằng AI</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#E3ECF8] flex items-center justify-between text-xs text-slate-500">
            <span>AI hỗ trợ soạn báo cáo nề nếp, kết quả thi đua và nhận xét cá nhân hóa</span>
            <button
              onClick={() => onNavigate('ai_assistant')}
              className="text-[#1677FF] font-bold hover:underline"
            >
              Mở Trợ lý AI GVCN →
            </button>
          </div>
        </div>

        {/* Cảnh báo & Đề xuất (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-[#172B4D]">Cảnh báo & Đề xuất</h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setAlertTab('warnings')}
                  className={`px-3 py-1 rounded-md transition ${
                    alertTab === 'warnings' ? 'bg-white text-rose-600 shadow-xs' : 'hover:text-[#172B4D]'
                  }`}
                >
                  Cảnh báo
                </button>
                <button
                  onClick={() => setAlertTab('suggestions')}
                  className={`px-3 py-1 rounded-md transition ${
                    alertTab === 'suggestions' ? 'bg-white text-emerald-600 shadow-xs' : 'hover:text-[#172B4D]'
                  }`}
                >
                  Đề xuất
                </button>
              </div>
            </div>

            {/* Alert items list matching screenshot */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <div>
                    <span className="text-xs font-bold text-rose-950">Nguyễn Văn A:</span>
                    <span className="text-xs text-rose-800 ml-1">Điểm TB giảm 1,2 điểm trong 2 tháng gần đây.</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-01')}
                  className="text-xs text-[#1677FF] font-bold hover:underline shrink-0"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-rose-200 bg-rose-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <div>
                    <span className="text-xs font-bold text-rose-950">Trần Văn B:</span>
                    <span className="text-xs text-rose-800 ml-1">Nghỉ học 3 buổi trong tháng (1 không phép).</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-06')}
                  className="text-xs text-[#1677FF] font-bold hover:underline shrink-0"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <div>
                    <span className="text-xs font-bold text-amber-950">Lê Thị C:</span>
                    <span className="text-xs text-amber-800 ml-1">Kết quả Tiếng Anh và KHTN dưới 5.0.</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-07')}
                  className="text-xs text-[#1677FF] font-bold hover:underline shrink-0"
                >
                  Xem chi tiết
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <div>
                    <span className="text-xs font-bold text-emerald-950">Phạm Văn D:</span>
                    <span className="text-xs text-emerald-800 ml-1">Điểm TB tăng tích cực từ 6.2 lên 7.4.</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStudent('hs-08')}
                  className="text-xs text-[#1677FF] font-bold hover:underline shrink-0"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Slogan footnote matching screenshot */}
          <div className="pt-3 mt-3 border-t border-[#E3ECF8] flex items-center justify-between">
            <span className="text-xs text-slate-500 italic">
              “Cùng nhau vì sự tiến bộ của mỗi học sinh!”
            </span>
            <span className="text-xs text-[#1677FF] font-bold">Lớp 8A2 - THCS Gia An</span>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Delete All */}
      {onDeleteAllStudents && (
        <ConfirmDialog
          isOpen={showDeleteAllDialog}
          onClose={() => setShowDeleteAllDialog(false)}
          onConfirm={() => {
            onDeleteAllStudents();
            setShowDeleteAllDialog(false);
          }}
          title="Xác nhận xóa toàn bộ học sinh?"
          message={`Hành động này sẽ xóa toàn bộ ${students.length} học sinh của lớp 8A2 khỏi hệ thống. Bạn có chắc chắn muốn tiếp tục không?`}
          confirmText="Xác nhận xóa tất cả"
          cancelText="Hủy bỏ"
          isDanger={true}
        />
      )}
    </div>
  );
};
