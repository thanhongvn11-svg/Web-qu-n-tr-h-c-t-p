import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square
} from 'lucide-react';
import { Student } from '../types';
import { useToast } from '../components/common/Toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (student: Student) => void;
  onOpenDeleteModal: (student: Student) => void;
  onDeleteMultipleStudents: (ids: string[]) => void;
  onDeleteAllStudents: () => void;
  onOpenExcelImport: () => void;
  onRestoreSampleData?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onDeleteMultipleStudents,
  onDeleteAllStudents,
  onOpenExcelImport,
  onRestoreSampleData,
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showDeleteSelectedDialog, setShowDeleteSelectedDialog] = useState(false);
  const pageSize = 10;

  // Filtering
  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.parentPhone.includes(search) ||
      s.parentName.toLowerCase().includes(search.toLowerCase());
    const matchGroup = selectedGroup === 'all' || s.group === selectedGroup;
    const matchGender = selectedGender === 'all' || s.gender === selectedGender;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchGroup && matchGender && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Checkbox handlers
  const isAllPaginatedSelected =
    paginated.length > 0 && paginated.every((s) => selectedStudentIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllPaginatedSelected) {
      // Unselect all on current page
      const pageIds = new Set(paginated.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      // Select all on current page
      const pageIds = paginated.map((s) => s.id);
      setSelectedStudentIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportCSV = () => {
    const headers = ['STT', 'Mã HS', 'Họ và tên', 'Ngày sinh', 'Giới tính', 'Tổ', 'Phụ huynh', 'Số điện thoại', 'Địa chỉ', 'ĐTB', 'Xếp loại', 'Trạng thái'];
    const rows = filtered.map((s, idx) => [
      idx + 1,
      s.studentCode,
      `"${s.fullName}"`,
      s.birthday,
      s.gender,
      s.group,
      `"${s.parentName}"`,
      s.parentPhone,
      `"${s.address}"`,
      s.gpa,
      s.academicRating,
      s.status,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_Sach_Hoc_Sinh_8A2_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất ${filtered.length} học sinh ra file CSV thành công!`, 'success');
  };

  // Bulk delete execution
  const handleConfirmDeleteSelected = () => {
    if (selectedStudentIds.length === 0) return;
    onDeleteMultipleStudents(selectedStudentIds);
    setSelectedStudentIds([]);
    setShowDeleteSelectedDialog(false);
  };

  const handleConfirmDeleteAll = () => {
    onDeleteAllStudents();
    setSelectedStudentIds([]);
    setShowDeleteAllDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#1677FF]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#172B4D]">DANH SÁCH HỌC SINH LỚP 8A2</h2>
              <p className="text-xs text-[#6B7A90]">
                Tổng cộng {students.length} học sinh • THCS Gia An • GVCN Nguyễn Thị Hồng Anh
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Delete All Students Button */}
          {students.length > 0 && (
            <button
              onClick={() => setShowDeleteAllDialog(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition shadow-xs"
              title="Xóa toàn bộ học sinh trong lớp"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Xóa toàn bộ danh sách</span>
            </button>
          )}

          {/* Import Excel */}
          <button
            onClick={onOpenExcelImport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import Excel (.xlsx)</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={students.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 border border-blue-200 text-[#1677FF] text-xs font-semibold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Add Student */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Bulk Selection Notification Bar */}
      {selectedStudentIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-500 text-white">
              <CheckSquare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-rose-900">
              Đã chọn {selectedStudentIds.length} trên tổng số {students.length} học sinh
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedStudentIds([])}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Bỏ chọn tất cả
            </button>
            <button
              onClick={() => setShowDeleteSelectedDialog(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa {selectedStudentIds.length} học sinh đã chọn</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên học sinh, mã HS, SĐT phụ huynh..."
            className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-[#172B4D] focus:outline-none focus:border-[#1677FF]"
          />
        </div>

        {/* Filter by Group */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Tổ:</span>
          <select
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl py-2 px-3 text-xs font-semibold text-[#172B4D] focus:outline-none"
          >
            <option value="all">Tất cả tổ</option>
            <option value="Tổ 1">Tổ 1</option>
            <option value="Tổ 2">Tổ 2</option>
            <option value="Tổ 3">Tổ 3</option>
            <option value="Tổ 4">Tổ 4</option>
          </select>
        </div>

        {/* Filter by Gender */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Giới tính:</span>
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl py-2 px-3 text-xs font-semibold text-[#172B4D] focus:outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Trạng thái:</span>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl py-2 px-3 text-xs font-semibold text-[#172B4D] focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Đang học">Đang học</option>
            <option value="Nghỉ phép">Nghỉ phép</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </select>
        </div>

        {(search || selectedGroup !== 'all' || selectedGender !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedGroup('all');
              setSelectedGender('all');
              setSelectedStatus('all');
              setCurrentPage(1);
            }}
            className="text-xs text-rose-600 font-semibold hover:underline px-2 py-1"
          >
            Đặt lại lọc
          </button>
        )}
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                {/* Select All Checkbox */}
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-0 cursor-pointer"
                    title="Chọn tất cả trên trang này"
                  />
                </th>
                <th className="py-3 px-2">STT</th>
                <th className="py-3 px-2">Ảnh</th>
                <th className="py-3 px-3">Mã HS</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-2">Giới tính</th>
                <th className="py-3 px-3">Ngày sinh</th>
                <th className="py-3 px-2">Tổ</th>
                <th className="py-3 px-3">Tên phụ huynh</th>
                <th className="py-3 px-3">Số điện thoại</th>
                <th className="py-3 px-2 text-center">ĐTB</th>
                <th className="py-3 px-3 text-center">Xếp loại</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-14 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1677FF] flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-[#172B4D]">
                        {students.length === 0
                          ? 'Danh sách học sinh lớp 8A2 hiện đang trống'
                          : 'Không tìm thấy học sinh nào phù hợp'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {students.length === 0
                          ? 'Bạn có thể nhập danh sách từ file Excel (.xlsx), thêm học sinh thủ công hoặc khôi phục dữ liệu mẫu ban đầu.'
                          : 'Thử kiểm tra lại từ khóa tìm kiếm hoặc đặt lại các bộ lọc bên trên.'}
                      </p>
                      {students.length === 0 && (
                        <div className="flex items-center justify-center gap-2.5 pt-2">
                          <button
                            onClick={onOpenExcelImport}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span>Nhập file Excel</span>
                          </button>
                          <button
                            onClick={onOpenAddModal}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Thêm thủ công</span>
                          </button>
                          {onRestoreSampleData && (
                            <button
                              onClick={onRestoreSampleData}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Khôi phục mẫu</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((s, idx) => {
                  const isChecked = selectedStudentIds.includes(s.id);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s.id)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition ${
                        isChecked ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      {/* Checkbox column */}
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => handleToggleSelectOne(s.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-[#1677FF] border-slate-300 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-400">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-2">
                        <img
                          src={s.avatar}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-[#1677FF]">
                        {s.studentCode}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#172B4D] whitespace-nowrap">
                        {s.fullName}
                      </td>
                      <td className="py-3 px-2 text-slate-600">{s.gender}</td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{s.birthday}</td>
                      <td className="py-3 px-2 font-medium text-slate-700">{s.group}</td>
                      <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{s.parentName}</td>
                      <td className="py-3 px-3 font-mono text-[#1677FF] whitespace-nowrap">
                        {s.parentPhone}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-[#172B4D]">{s.gpa}</td>
                      <td className="py-3 px-3 text-center">
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
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Đang học'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Xem hồ sơ"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(s.id);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Sửa thông tin"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEditModal(s);
                            }}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Xóa học sinh này"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDeleteModal(s);
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {paginated.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[#E3ECF8] text-xs text-slate-500">
            <div>
              Hiển thị <strong>{paginated.length}</strong> trên tổng số <strong>{filtered.length}</strong> học sinh
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-[#E3ECF8] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                    currentPage === i + 1
                      ? 'bg-[#1677FF] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-[#E3ECF8] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation: Delete Selected Students */}
      <ConfirmDialog
        isOpen={showDeleteSelectedDialog}
        onClose={() => setShowDeleteSelectedDialog(false)}
        onConfirm={handleConfirmDeleteSelected}
        title={`Xác nhận xóa ${selectedStudentIds.length} học sinh đã chọn?`}
        message={`Bạn có chắc chắn muốn xóa ${selectedStudentIds.length} học sinh được chọn khỏi danh sách lớp 8A2? Toàn bộ kết quả điểm số, chuyên cần và nề nếp của các em cũng sẽ bị xóa vĩnh viễn.`}
        confirmText={`Xóa ${selectedStudentIds.length} học sinh`}
        cancelText="Hủy bỏ"
        isDanger={true}
      />

      {/* Confirmation: Delete ALL Students */}
      <ConfirmDialog
        isOpen={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleConfirmDeleteAll}
        title="CẢNH BÁO: Xóa toàn bộ danh sách học sinh?"
        message={`Hành động này sẽ XÓA HẾT TOÀN BỘ ${students.length} HỌC SINH trong lớp 8A2, bao gồm toàn bộ sổ điểm, điểm danh và nề nếp. Bạn có thể sử dụng tính năng "Khôi phục dữ liệu mẫu ban đầu" trong Cài đặt nếu muốn phục hồi.`}
        confirmText="Xác nhận xóa tất cả"
        cancelText="Hủy bỏ"
        isDanger={true}
      />
    </div>
  );
};
