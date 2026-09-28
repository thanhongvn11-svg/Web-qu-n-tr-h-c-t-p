import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Phone, BookOpen, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import { Student } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectStudent: (studentId: string) => void;
  onNavigateView: (view: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudent,
  onNavigateView,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStudents = query.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(query.toLowerCase()) ||
          s.studentCode.toLowerCase().includes(query.toLowerCase()) ||
          s.parentPhone.includes(query) ||
          s.parentName.toLowerCase().includes(query.toLowerCase()) ||
          s.group.toLowerCase().includes(query.toLowerCase())
      )
    : students.slice(0, 6);

  const quickFeatures = [
    { label: 'Điểm danh chuyên cần', view: 'attendance', icon: Clock },
    { label: 'Bảng điểm & Học tập', view: 'academics', icon: BookOpen },
    { label: 'Ghi nhận vi phạm & nề nếp', view: 'conduct', icon: ShieldAlert },
    { label: 'Trợ lý AI GVCN', view: 'ai_assistant', icon: Search },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl border border-[#E3ECF8] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E3ECF8] flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-[#1677FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, mã HS, SĐT phụ huynh, tổ..."
            className="w-full bg-transparent text-sm font-medium text-[#172B4D] placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 bg-white rounded-md border border-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick shortcuts if no search */}
          {!query.trim() && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                Lối tắt chức năng nhanh
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <button
                      key={feat.view}
                      onClick={() => {
                        onNavigateView(feat.view);
                        onClose();
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#E3ECF8] hover:border-[#1677FF] hover:bg-blue-50/50 text-left text-xs font-semibold text-[#172B4D] transition"
                    >
                      <Icon className="w-4 h-4 text-[#1677FF]" />
                      <span className="truncate">{feat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Student results */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {query.trim() ? `Kết quả tìm kiếm (${filteredStudents.length})` : 'Học sinh gần đây'}
              </p>
              <span className="text-[11px] text-slate-400">Nhấn để xem hồ sơ</span>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">
                Không tìm thấy học sinh nào phù hợp với "{query}"
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => {
                      onSelectStudent(student.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#E3ECF8] hover:border-[#1677FF] hover:bg-blue-50/40 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#172B4D]">
                            {student.fullName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {student.studentCode}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                            {student.group}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6B7A90] mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {student.parentPhone} ({student.parentName})
                          </span>
                          <span>•</span>
                          <span>ĐTB: <strong className="text-[#1677FF]">{student.gpa}</strong></span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 hover:text-[#1677FF]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
