import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Plus,
  Sparkles,
  Calendar,
  Medal,
  Star,
  Heart,
  TrendingUp,
  Download,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AchievementRecord, Student } from '../types';
import { useToast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';

interface AwardsViewProps {
  achievements: AchievementRecord[];
  students: Student[];
  onAddAchievement: (record: Omit<AchievementRecord, 'id'>) => void;
  onDeleteAchievement: (id: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({
  achievements,
  students,
  onAddAchievement,
  onDeleteAchievement,
  onSelectStudent,
}) => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<AchievementRecord['category']>('Tiến bộ vượt bậc');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('24/04/2025');
  const [points, setPoints] = useState(5);

  const categories = [
    { id: 'all', label: 'Tất cả danh hiệu' },
    { id: 'Học sinh xuất sắc', label: 'Học sinh xuất sắc' },
    { id: 'Tiến bộ vượt bậc', label: 'Tiến bộ vượt bậc' },
    { id: 'Việc tốt', label: 'Việc tốt' },
    { id: 'Hoạt động phong trào', label: 'Hoạt động phong trào' },
  ];

  const filtered = achievements.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === studentId);
    if (!st || !title.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề thành tích', 'error');
      return;
    }

    onAddAchievement({
      studentId: st.id,
      studentName: st.fullName,
      avatar: st.avatar,
      category,
      title,
      description,
      date,
      pointsAdded: points,
    });

    handleCelebrate();
    setIsModalOpen(false);
    showToast(`Đã tuyên dương học sinh ${st.fullName}!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">BẢNG VÀNG TUYÊN DƯƠNG & THI ĐUA</h2>
            <p className="text-xs text-[#6B7A90]">
              Vinh danh các cá nhân có thành tích học tập xuất sắc, việc tốt và tiến bộ vượt bậc lớp 8A2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCelebrate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Chúc mừng cả lớp 🎉</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Đề xuất tuyên dương</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-[#E3ECF8] shadow-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat.id
                ? 'bg-[#1677FF] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Honors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const studentObj = students.find((s) => s.id === item.studentId);
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-5 hover:shadow-md hover:border-amber-300 transition duration-300 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.avatar ||
                        studentObj?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={item.studentName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-100 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#172B4D] group-hover:text-[#1677FF] transition">
                        {item.studentName}
                      </h4>
                      <span className="text-[11px] font-semibold text-[#6B7A90]">
                        Lớp 8A2 • {studentObj?.group || 'Tổ 1'}
                      </span>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-amber-50 text-amber-500 shadow-xs">
                    {item.category === 'Học sinh xuất sắc' && <Medal className="w-5 h-5" />}
                    {item.category === 'Tiến bộ vượt bậc' && <TrendingUp className="w-5 h-5" />}
                    {item.category === 'Việc tốt' && <Heart className="w-5 h-5 text-rose-500" />}
                    {item.category === 'Hoạt động phong trào' && <Star className="w-5 h-5 text-purple-500" />}
                    {item.category === 'Khác' && <Award className="w-5 h-5" />}
                  </span>
                </div>

                <div className="my-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 mb-1.5">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-[#172B4D] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B7A90] mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#E3ECF8] flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    +{item.pointsAdded} điểm thi đua
                  </span>
                  <button
                    onClick={() => onDeleteAchievement(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Xóa danh hiệu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Award Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tuyên dương & Khen thưởng học sinh"
        subtitle="Vinh danh thành tích, việc tốt và sự tiến bộ của học sinh lớp 8A2"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Chọn học sinh được tuyên dương *
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-semibold text-[#172B4D] focus:outline-none focus:border-[#1677FF]"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentCode}) - {st.group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Phân loại tuyên dương
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            >
              <option value="Học sinh xuất sắc">Học sinh xuất sắc</option>
              <option value="Tiến bộ vượt bậc">Tiến bộ vượt bậc</option>
              <option value="Việc tốt">Việc tốt</option>
              <option value="Hoạt động phong trào">Hoạt động phong trào</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Tiêu đề thành tích *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Đạt giải Nhì HSG cấp Trường, Điểm Toán tăng +2.0..."
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Mô tả chi tiết việc tốt / thành tích
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể để công bố trước lớp và gửi thông báo phụ huynh..."
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Ngày tuyên dương
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Cộng điểm thi đua
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECF8]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Xác nhận tuyên dương
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
