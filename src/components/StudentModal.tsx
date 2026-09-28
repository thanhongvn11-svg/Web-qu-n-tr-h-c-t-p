import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Student } from '../types';
import { useToast } from './common/Toast';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => void;
  student?: Student | null;
  onOpenExcelImport?: () => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  onOpenExcelImport,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    studentCode: '',
    birthday: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    group: 'Tổ 1' as 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4',
    parentName: '',
    parentPhone: '',
    address: '',
    status: 'Đang học' as 'Đang học' | 'Nghỉ phép' | 'Tạm nghỉ',
    math: 7.5,
    literature: 7.0,
    science: 7.5,
    english: 7.0,
    historyGeo: 7.5,
    civics: 8.0,
    informatics: 7.5,
    technology: 7.0,
    teacherNote: '',
    actionPlan: '',
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        studentCode: student.studentCode,
        birthday: student.birthday,
        gender: student.gender,
        group: student.group,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        address: student.address,
        status: student.status,
        math: student.scores.math,
        literature: student.scores.literature,
        science: student.scores.science,
        english: student.scores.english,
        historyGeo: student.scores.historyGeo,
        civics: student.scores.civics,
        informatics: student.scores.informatics,
        technology: student.scores.technology,
        teacherNote: student.teacherNote || '',
        actionPlan: student.actionPlan || '',
      });
    } else {
      const nextNum = Math.floor(Math.random() * 90) + 10;
      setFormData({
        fullName: '',
        studentCode: `HS8A2${nextNum}`,
        birthday: '15/05/2010',
        gender: 'Nam',
        group: 'Tổ 1',
        parentName: '',
        parentPhone: '0987 000 111',
        address: 'Thôn 3, Gia An, Tánh Linh, Bình Thuận',
        status: 'Đang học',
        math: 7.5,
        literature: 7.0,
        science: 7.5,
        english: 7.0,
        historyGeo: 7.5,
        civics: 8.0,
        informatics: 7.5,
        technology: 7.0,
        teacherNote: 'Học sinh tích cực, có ý thức rèn luyện tốt.',
        actionPlan: 'Tiếp tục bồi dưỡng và động viên học sinh.',
      });
    }
  }, [student, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Vui lòng nhập họ và tên học sinh', 'error');
      return;
    }

    const scores = {
      math: Number(formData.math),
      literature: Number(formData.literature),
      science: Number(formData.science),
      english: Number(formData.english),
      historyGeo: Number(formData.historyGeo),
      civics: Number(formData.civics),
      informatics: Number(formData.informatics),
      technology: Number(formData.technology),
    };

    const gpa = Number(
      (
        Object.values(scores).reduce((acc, curr) => acc + curr, 0) /
        Object.values(scores).length
      ).toFixed(2)
    );

    const academicRating = gpa >= 8.0 ? 'Tốt' : gpa >= 6.5 ? 'Khá' : gpa >= 5.0 ? 'Trung bình' : 'Yếu';

    onSave({
      fullName: formData.fullName,
      studentCode: formData.studentCode,
      birthday: formData.birthday,
      gender: formData.gender,
      group: formData.group,
      parentName: formData.parentName || 'Phụ huynh học sinh',
      parentPhone: formData.parentPhone,
      address: formData.address,
      status: formData.status,
      scores,
      gpa,
      academicRating,
      teacherNote: formData.teacherNote,
      actionPlan: formData.actionPlan,
      avatar:
        student?.avatar ||
        (formData.gender === 'Nữ'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? `Sửa thông tin: ${student.fullName}` : 'Thêm học sinh mới lớp 8A2'}
      subtitle="Nhập thông tin cá nhân, liên hệ phụ huynh và kết quả học tập"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bulk import shortcut banner */}
        {!student && onOpenExcelImport && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#1677FF] text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-bold text-[#0D47A1]">Bạn có danh sách cả lớp trong file Excel?</p>
                <p className="text-[11px] text-slate-500">Tự động nhập hàng loạt học sinh, điểm số và thông tin liên hệ chỉ với 1 click.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenExcelImport();
              }}
              className="px-3 py-1.5 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-lg shrink-0 shadow-xs transition"
            >
              Nhập từ file Excel →
            </button>
          </div>
        )}

        {/* Basic info */}
        <div>
          <h4 className="text-xs font-bold text-[#1677FF] uppercase tracking-wider mb-2">
            1. Thông tin lý lịch học sinh
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Mã học sinh
              </label>
              <input
                type="text"
                value={formData.studentCode}
                onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                placeholder="HS8A201"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Ngày sinh
              </label>
              <input
                type="text"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                placeholder="12/03/2010"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Giới tính
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Tổ sinh hoạt
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value as any })}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              >
                <option value="Tổ 1">Tổ 1</option>
                <option value="Tổ 2">Tổ 2</option>
                <option value="Tổ 3">Tổ 3</option>
                <option value="Tổ 4">Tổ 4</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Trạng thái học tập
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              >
                <option value="Đang học">Đang học</option>
                <option value="Nghỉ phép">Nghỉ phép</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parent & Address */}
        <div>
          <h4 className="text-xs font-bold text-[#1677FF] uppercase tracking-wider mb-2">
            2. Thông tin phụ huynh & liên hệ
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Họ tên phụ huynh
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Nguyễn Văn Bình (Bố)"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="0987 111 222"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Địa chỉ cư trú
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Thôn 7, Gia An, Tánh Linh, Bình Thuận"
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Subject Scores */}
        <div>
          <h4 className="text-xs font-bold text-[#1677FF] uppercase tracking-wider mb-2">
            3. Điểm trung bình các môn học (thang điểm 10)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { key: 'math', label: 'Toán' },
              { key: 'literature', label: 'Ngữ văn' },
              { key: 'science', label: 'KHTN' },
              { key: 'english', label: 'Tiếng Anh' },
              { key: 'historyGeo', label: 'LS&ĐL' },
              { key: 'civics', label: 'GDCD' },
              { key: 'informatics', label: 'Tin học' },
              { key: 'technology', label: 'Công nghệ' },
            ].map((subj) => (
              <div key={subj.key} className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                <label className="text-[11px] font-bold text-[#172B4D] block mb-1">
                  {subj.label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={(formData as any)[subj.key]}
                  onChange={(e) => setFormData({ ...formData, [subj.key]: Number(e.target.value) })}
                  className="w-full bg-white border border-[#E3ECF8] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1677FF] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Note */}
        <div>
          <h4 className="text-xs font-bold text-[#1677FF] uppercase tracking-wider mb-2">
            4. Nhận xét & Biện pháp giáo dục của GVCN
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Nhận xét tình hình học sinh
              </label>
              <textarea
                rows={2}
                value={formData.teacherNote}
                onChange={(e) => setFormData({ ...formData, teacherNote: e.target.value })}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Kế hoạch / Đề xuất hỗ trợ
              </label>
              <textarea
                rows={2}
                value={formData.actionPlan}
                onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#1677FF]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECF8]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            {student ? 'Lưu thay đổi' : 'Thêm học sinh'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
