import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Download,
  Upload,
  Edit3,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student } from '../types';
import { useToast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';

interface AcademicsViewProps {
  students: Student[];
  onUpdateStudent: (student: Student) => void;
  onSelectStudent: (studentId: string) => void;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  students,
  onUpdateStudent,
  onSelectStudent,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Học kỳ II');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [tempScores, setTempScores] = useState<any>({});

  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchRating = selectedRating === 'all' || s.academicRating === selectedRating;
    return matchSearch && matchGroup && matchRating;
  });

  const subjects = [
    { key: 'math', label: 'Toán', color: '#1677FF' },
    { key: 'literature', label: 'Ngữ văn', color: '#F97316' },
    { key: 'science', label: 'KHTN', color: '#10B981' },
    { key: 'english', label: 'Tiếng Anh', color: '#A855F7' },
    { key: 'historyGeo', label: 'LS&ĐL', color: '#EC4899' },
    { key: 'civics', label: 'GDCD', color: '#06B6D4' },
    { key: 'informatics', label: 'Tin học', color: '#F59E0B' },
    { key: 'technology', label: 'Công nghệ', color: '#6366F1' },
  ];

  // Subject statistics
  const subjectStats = subjects.map((subj) => {
    const allScores = students.map((s) => (s.scores as any)[subj.key] || 0);
    const avg = Number((allScores.reduce((a, b) => a + b, 0) / (allScores.length || 1)).toFixed(2));
    const highest = Math.max(...allScores);
    const lowest = Math.min(...allScores);
    return { ...subj, avg, highest, lowest };
  });

  const handleOpenEditScores = (student: Student) => {
    setEditingStudent(student);
    setTempScores({ ...student.scores });
  };

  const handleSaveScores = () => {
    if (!editingStudent) return;
    const newScores = { ...tempScores };
    const values = Object.values(newScores) as number[];
    const gpa = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));
    const academicRating = gpa >= 8.0 ? 'Tốt' : gpa >= 6.5 ? 'Khá' : gpa >= 5.0 ? 'Trung bình' : 'Yếu';

    const updated: Student = {
      ...editingStudent,
      scores: newScores,
      gpa,
      academicRating,
    };

    onUpdateStudent(updated);
    setEditingStudent(null);
    showToast(`Đã cập nhật bảng điểm cho học sinh ${editingStudent.fullName}!`, 'success');
  };

  const handleExportExcel = () => {
    showToast('Đang xuất sổ điểm lớp 8A2 sang định dạng Excel...', 'info');
    setTimeout(() => {
      showToast('Đã tải xuống file So_Diem_Lop_8A2.xlsx thành công!', 'success');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">KẾT QUẢ HỌC TẬP & SỔ ĐIỂM</h2>
            <p className="text-xs text-[#6B7A90]">
              Quản lý bảng điểm các môn học, tính điểm trung bình và phân loại học lực lớp 8A2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-[#172B4D] focus:outline-none"
          >
            <option value="Học kỳ I">Học kỳ I</option>
            <option value="Học kỳ II">Học kỳ II</option>
            <option value="Cả năm">Cả năm học 2026-2027</option>
          </select>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1677FF] border border-blue-200 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất sổ điểm Excel</span>
          </button>
        </div>
      </div>

      {/* Subject Average Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {subjectStats.map((subj) => (
          <div
            key={subj.key}
            className="bg-white p-3 rounded-2xl border border-[#E3ECF8] shadow-xs hover:border-[#1677FF] transition text-center"
          >
            <span className="text-[11px] font-bold text-[#6B7A90] block truncate">
              {subj.label}
            </span>
            <div className="text-xl font-black mt-1" style={{ color: subj.color }}>
              {subj.avg}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">
              Cao: <strong className="text-emerald-600">{subj.highest}</strong> | Thấp: <strong className="text-rose-600">{subj.lowest}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên học sinh, mã HS..."
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

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Xếp loại:</span>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl py-2 px-3 text-xs font-semibold text-[#172B4D] focus:outline-none"
          >
            <option value="all">Tất cả học lực</option>
            <option value="Tốt">Tốt (ĐTB ≥ 8.0)</option>
            <option value="Khá">Khá (ĐTB 6.5 - 7.9)</option>
            <option value="Trung bình">Trung bình (ĐTB 5.0 - 6.4)</option>
            <option value="Yếu">Yếu (ĐTB &lt; 5.0)</option>
          </select>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                <th className="py-3 px-3">STT</th>
                <th className="py-3 px-3">Ảnh</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-2">Tổ</th>
                <th className="py-3 px-2 text-center text-blue-600">Toán</th>
                <th className="py-3 px-2 text-center text-orange-600">Văn</th>
                <th className="py-3 px-2 text-center text-emerald-600">KHTN</th>
                <th className="py-3 px-2 text-center text-purple-600">T.Anh</th>
                <th className="py-3 px-2 text-center text-pink-600">LS&ĐL</th>
                <th className="py-3 px-2 text-center text-cyan-600">GDCD</th>
                <th className="py-3 px-2 text-center text-amber-600">Tin</th>
                <th className="py-3 px-2 text-center text-indigo-600">CN</th>
                <th className="py-3 px-3 text-center bg-blue-50/50 text-[#1677FF] font-black">
                  ĐTB
                </th>
                <th className="py-3 px-3 text-center">Xếp loại</th>
                <th className="py-3 px-3 text-right">Nhập điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  onClick={() => onSelectStudent(s.id)}
                  className="hover:bg-blue-50/40 cursor-pointer transition"
                >
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
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.math}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.literature}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.science}</td>
                  <td className={`py-2.5 px-2 text-center font-semibold ${s.scores.english < 5 ? 'text-rose-600 font-bold' : 'text-[#172B4D]'}`}>
                    {s.scores.english}
                  </td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.historyGeo}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.civics}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.informatics}</td>
                  <td className="py-2.5 px-2 text-center font-semibold text-[#172B4D]">{s.scores.technology}</td>
                  <td className="py-2.5 px-3 text-center bg-blue-50/50 font-black text-[#1677FF]">
                    {s.gpa}
                  </td>
                  <td className="py-2.5 px-3 text-center">
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
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditScores(s);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-[#1677FF] hover:text-white rounded-lg text-slate-700 font-semibold transition inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa điểm</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Editing Modal */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title={`Cập nhật điểm số: ${editingStudent.fullName}`}
          subtitle={`Mã HS: ${editingStudent.studentCode} • Tổ: ${editingStudent.group}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {subjects.map((subj) => (
                <div key={subj.key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-[#172B4D] block mb-1">
                    {subj.label}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={tempScores[subj.key] || 0}
                    onChange={(e) =>
                      setTempScores({
                        ...tempScores,
                        [subj.key]: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-[#E3ECF8] rounded-lg px-2.5 py-1 text-sm font-black text-[#1677FF] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Điểm trung bình ước tính:</span>
              <strong className="text-base text-[#1677FF] font-black">
                {(
                  (Object.values(tempScores) as number[]).reduce((a, b) => a + b, 0) /
                  (Object.values(tempScores).length || 1)
                ).toFixed(2)}
              </strong>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECF8]">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveScores}
                className="px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Lưu bảng điểm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
