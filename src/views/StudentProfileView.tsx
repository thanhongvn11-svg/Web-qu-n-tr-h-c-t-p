import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Edit2,
  TrendingUp,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Student } from '../types';
import { useToast } from '../components/common/Toast';

interface StudentProfileViewProps {
  student: Student;
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onEditStudent: (student: Student) => void;
  onUpdateNote: (studentId: string, note: string, actionPlan: string) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  students,
  onSelectStudent,
  onEditStudent,
  onUpdateNote,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'attendance' | 'conduct' | 'awards' | 'notes'>('overview');
  const [noteText, setNoteText] = useState(student.teacherNote || '');
  const [actionText, setActionText] = useState(student.actionPlan || '');

  // Quick switch prev/next student
  const currentIndex = students.findIndex((s) => s.id === student.id);
  const prevStudent = currentIndex > 0 ? students[currentIndex - 1] : null;
  const nextStudent = currentIndex < students.length - 1 ? students[currentIndex + 1] : null;

  // Chart data for student's scores across subjects
  const subjectScoresData = [
    { subject: 'Toán', score: student.scores.math },
    { subject: 'Ngữ văn', score: student.scores.literature },
    { subject: 'KHTN', score: student.scores.science },
    { subject: 'Tiếng Anh', score: student.scores.english },
    { subject: 'LS&ĐL', score: student.scores.historyGeo },
    { subject: 'GDCD', score: student.scores.civics },
    { subject: 'Tin học', score: student.scores.informatics },
    { subject: 'Công nghệ', score: student.scores.technology },
  ];

  const handleSaveNotes = () => {
    onUpdateNote(student.id, noteText, actionText);
    showToast(`Đã cập nhật nhận xét và kế hoạch hỗ trợ cho ${student.fullName}!`, 'success');
  };

  const handleCallParent = () => {
    showToast(`Đang kết nối cuộc gọi tới phụ huynh ${student.parentName} (${student.parentPhone})...`, 'info');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigator & Print bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs no-print">
        <div className="flex items-center gap-3">
          <select
            value={student.id}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-[#172B4D] focus:outline-none"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.studentCode}) - {s.group}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 text-xs">
            <button
              disabled={!prevStudent}
              onClick={() => prevStudent && onSelectStudent(prevStudent.id)}
              className="p-1.5 rounded-lg border border-[#E3ECF8] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Học sinh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!nextStudent}
              onClick={() => nextStudent && onSelectStudent(nextStudent.id)}
              className="p-1.5 rounded-lg border border-[#E3ECF8] hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Học sinh kế tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCallParent}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gọi phụ huynh</span>
          </button>

          <button
            onClick={() => onEditStudent(student)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-[#E3ECF8] text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Sửa thông tin</span>
          </button>

          <button
            onClick={handlePrintDossier}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Xuất hồ sơ / In</span>
          </button>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={student.avatar}
              alt={student.fullName}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-extrabold text-[#172B4D]">{student.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1677FF] text-xs font-bold font-mono">
                  {student.studentCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {student.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#6B7A90] mt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ngày sinh: <strong>{student.birthday}</strong> ({student.gender})</span>
                </div>
                <div>
                  <span>Tổ sinh hoạt: <strong className="text-[#172B4D]">{student.group}</strong> - Lớp 8A2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phụ huynh: <strong>{student.parentName}</strong> ({student.parentPhone})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[240px]">Địa chỉ: {student.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual 3 Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-center min-w-[95px]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Điểm TB</span>
              <div className="text-2xl font-black text-[#1677FF] mt-0.5">{student.gpa}</div>
              <span className="text-[10px] font-bold text-emerald-600">Xếp loại {student.academicRating}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[95px]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Chuyên cần</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">
                {student.totalAbsences === 0 ? '100%' : '96%'}
              </div>
              <span className="text-[10px] font-medium text-slate-500">
                Vắng: {student.totalAbsences} buổi
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center min-w-[95px]">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Rèn luyện</span>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{student.conductScore}đ</div>
              <span className="text-[10px] font-bold text-amber-700">Hạnh kiểm {student.conductRating}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-[#E3ECF8] mt-6 pt-3 overflow-x-auto text-xs font-bold no-print">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'academics', label: 'Kết quả học tập' },
            { id: 'attendance', label: 'Chuyên cần' },
            { id: 'conduct', label: 'Nề nếp & Kỷ luật' },
            { id: 'notes', label: 'Nhận xét GVCN' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#1677FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Scores & Subject breakdown */}
        <div className="lg:col-span-8 space-y-5">
          {/* Chart card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1677FF]" />
                <h3 className="text-sm font-bold text-[#172B4D]">
                  Biểu đồ điểm số các môn học (Học kỳ II)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                ĐTB: {student.gpa}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subjectScoresData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3ECF8" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#6B7A90' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(val: any) => [`${val} điểm`]} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1677FF"
                    strokeWidth={3}
                    dot={{ fill: '#1677FF', r: 4 }}
                    label={{ position: 'top', fill: '#172B4D', fontSize: 11, fontWeight: 'bold' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scores table */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
            <h3 className="text-sm font-bold text-[#172B4D] mb-3">
              Chi tiết bảng điểm các môn của {student.fullName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {subjectScoresData.map((subj) => (
                <div key={subj.subject} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-medium text-slate-500 block truncate">{subj.subject}</span>
                  <div className={`text-xl font-black mt-1 ${subj.score < 5 ? 'text-rose-600' : 'text-[#1677FF]'}`}>
                    {subj.score}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {subj.score >= 8.0 ? 'Tốt' : subj.score >= 6.5 ? 'Khá' : subj.score >= 5.0 ? 'Đạt' : 'Chưa đạt'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Note and Action Plan Editor */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#172B4D]">
                Nhận xét & Biện pháp giáo dục của GVCN
              </h3>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition"
              >
                Lưu nhận xét
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Đánh giá quá trình học tập & rèn luyện:
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Biện pháp hỗ trợ / Phối hợp với gia đình:
                </label>
                <textarea
                  rows={2}
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Timeline & Activities */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
            <h3 className="text-sm font-bold text-[#172B4D] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#1677FF]" />
              <span>Hoạt động gần đây của học sinh</span>
            </h3>

            <div className="relative pl-5 border-l-2 border-blue-100 space-y-4 text-xs">
              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <span className="text-[10px] text-slate-400 font-mono">24/04/2025</span>
                <p className="font-bold text-[#172B4D] mt-0.5">Điểm danh có mặt đầy đủ</p>
                <p className="text-slate-500 mt-0.5">Đạt tỷ lệ chuyên cần tuần 4</p>
              </div>

              {student.progressHighlight && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                  <span className="text-[10px] text-slate-400 font-mono">23/04/2025</span>
                  <p className="font-bold text-[#172B4D] mt-0.5">Được tuyên dương trước lớp</p>
                  <p className="text-emerald-600 font-medium mt-0.5">{student.progressHighlight}</p>
                </div>
              )}

              {student.concernIssue && (
                <div className="relative">
                  <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                  <span className="text-[10px] text-slate-400 font-mono">21/04/2025</span>
                  <p className="font-bold text-rose-800 mt-0.5">Cảnh báo GVCN ghi nhận</p>
                  <p className="text-rose-600 mt-0.5">{student.concernIssue}</p>
                </div>
              )}

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                <span className="text-[10px] text-slate-400 font-mono">18/04/2025</span>
                <p className="font-bold text-[#172B4D] mt-0.5">Kiểm tra định kỳ 1 tiết</p>
                <p className="text-slate-500 mt-0.5">Hoàn thành bài kiểm tra theo kế hoạch</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                <span className="text-[10px] text-slate-400 font-mono">15/04/2025</span>
                <p className="font-bold text-[#172B4D] mt-0.5">GVCN trao đổi với phụ huynh</p>
                <p className="text-slate-500 mt-0.5">Cập nhật tình hình học tập và chuyên cần</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
