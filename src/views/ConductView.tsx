import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  Calendar,
  Users,
  Award,
  Filter,
  Check
} from 'lucide-react';
import { ViolationRecord, Student } from '../types';
import { useToast } from '../components/common/Toast';
import { Modal } from '../components/common/Modal';

interface ConductViewProps {
  violations: ViolationRecord[];
  students: Student[];
  onAddViolation: (record: Omit<ViolationRecord, 'id'>) => void;
  onUpdateViolation: (record: ViolationRecord) => void;
  onDeleteViolation: (id: string) => void;
}

export const ConductView: React.FC<ConductViewProps> = ({
  violations,
  students,
  onAddViolation,
  onUpdateViolation,
  onDeleteViolation,
}) => {
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New violation form state
  const [newStudentId, setNewStudentId] = useState(students[0]?.id || '');
  const [newDate, setNewDate] = useState('24/04/2025');
  const [newViolation, setNewViolation] = useState('Đi học trễ');
  const [newAction, setNewAction] = useState('Nhắc nhở và trừ 2 điểm thi đua');
  const [newPoints, setNewPoints] = useState(2);
  const [newStatus, setNewStatus] = useState<'Đã xử lý' | 'Chưa xử lý'>('Chưa xử lý');

  const filteredViolations = violations.filter((v) => {
    if (filterStatus === 'all') return true;
    return v.status === filterStatus;
  });

  const conductLevels = [
    { level: 'Tốt', count: 32, percent: '84.2%', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { level: 'Khá', count: 4, percent: '10.5%', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { level: 'Trung bình', count: 2, percent: '5.3%', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { level: 'Yếu', count: 0, percent: '0%', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  ];

  const handleCreateViolation = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === newStudentId);
    if (!st) return;

    onAddViolation({
      studentId: st.id,
      studentName: st.fullName,
      date: newDate,
      violation: newViolation,
      action: newAction,
      pointsDeducted: newPoints,
      status: newStatus,
    });

    setIsAddModalOpen(false);
    showToast(`Đã thêm ghi nhận nề nếp cho học sinh ${st.fullName}!`, 'success');
  };

  const handleToggleStatus = (record: ViolationRecord) => {
    const updatedStatus = record.status === 'Đã xử lý' ? 'Chưa xử lý' : 'Đã xử lý';
    onUpdateViolation({ ...record, status: updatedStatus });
    showToast(`Đã cập nhật trạng thái vi phạm sang "${updatedStatus}"`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">QUẢN LÝ NỀ NẾP & RÈN LUYỆN</h2>
            <p className="text-xs text-[#6B7A90]">
              Theo dõi việc chấp hành nội quy, điểm trừ vi phạm và phong trào thi đua rèn luyện lớp 8A2
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Thêm vi phạm nề nếp</span>
        </button>
      </div>

      {/* Conduct Classification overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {conductLevels.map((item) => (
          <div
            key={item.level}
            className={`p-4 rounded-2xl border shadow-xs bg-white ${item.bg}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Hạnh kiểm {item.level}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                {item.percent}
              </span>
            </div>
            <div className={`text-3xl font-black mt-2 ${item.color}`}>{item.count}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">học sinh trong danh sách</span>
          </div>
        ))}
      </div>

      {/* Tổ thi đua ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { group: 'Tổ 1', score: 92, rank: 'Hạng 1', leader: 'Đỗ Khánh Vy', status: 'Xuất sắc', color: 'from-blue-600 to-indigo-600' },
          { group: 'Tổ 2', score: 88, rank: 'Hạng 2', leader: 'Lê Minh Hoàng', status: 'Tốt', color: 'from-emerald-600 to-teal-600' },
          { group: 'Tổ 3', score: 85, rank: 'Hạng 3', leader: 'Nguyễn Thị D', status: 'Khá', color: 'from-amber-500 to-orange-500' },
          { group: 'Tổ 4', score: 80, rank: 'Hạng 4', leader: 'Võ Ngọc Bảo', status: 'Cần cố gắng', color: 'from-slate-600 to-slate-700' },
        ].map((t) => (
          <div key={t.group} className="bg-white p-4 rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#172B4D]">{t.group}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1677FF]">
                {t.rank}
              </span>
            </div>
            <div className="my-3">
              <div className="text-2xl font-black text-[#172B4D]">{t.score} điểm</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tổ trưởng: {t.leader}</div>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Trạng thái: <strong className="text-emerald-600">{t.status}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Violation Log Table */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E3ECF8] flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-[#172B4D]">
              Nhật ký vi phạm nề nếp tuần này ({filteredViolations.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Lọc trạng thái:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-[#E3ECF8] rounded-xl py-1.5 px-3 font-semibold text-[#172B4D] focus:outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="Chưa xử lý">Chưa xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                <th className="py-3 px-4">Ngày</th>
                <th className="py-3 px-4">Học sinh</th>
                <th className="py-3 px-4">Nội dung vi phạm</th>
                <th className="py-3 px-4">Hình thức xử lý</th>
                <th className="py-3 px-3 text-center">Điểm trừ</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3ECF8]">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không có bản ghi vi phạm nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{v.date}</td>
                    <td className="py-3 px-4 font-bold text-[#172B4D] whitespace-nowrap">
                      {v.studentName}
                    </td>
                    <td className="py-3 px-4 text-[#172B4D] font-medium">{v.violation}</td>
                    <td className="py-3 px-4 text-slate-600">{v.action}</td>
                    <td className="py-3 px-3 text-center font-bold text-rose-600">
                      -{v.pointsDeducted}đ
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(v)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          v.status === 'Đã xử lý'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {v.status === 'Đã xử lý' ? '✓ Đã xử lý' : '⏳ Chưa xử lý'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteViolation(v.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Xóa bản ghi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Violation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ghi nhận vi phạm nề nếp học sinh"
        subtitle="Cập nhật vào sổ nề nếp và trừ điểm thi đua cá nhân / tổ"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateViolation} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Chọn học sinh vi phạm *
            </label>
            <select
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-semibold text-[#172B4D] focus:outline-none focus:border-[#1677FF]"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentCode}) - {st.group}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Ngày ghi nhận
              </label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#172B4D] block mb-1">
                Điểm trừ thi đua
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-rose-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Nội dung vi phạm
            </label>
            <select
              value={newViolation}
              onChange={(e) => setNewViolation(e.target.value)}
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none mb-2"
            >
              <option value="Đi học trễ">Đi học trễ</option>
              <option value="Không mặc đồng phục">Không mặc đồng phục</option>
              <option value="Nói chuyện riêng, mất trật tự">Nói chuyện riêng, mất trật tự</option>
              <option value="Sử dụng điện thoại trong giờ học">Sử dụng điện thoại trong giờ học</option>
              <option value="Không làm bài tập về nhà">Không làm bài tập về nhà</option>
              <option value="Quên sách vở dụng cụ học tập">Quên sách vở dụng cụ học tập</option>
              <option value="Vi phạm nội quy lớp">Vi phạm nội quy lớp</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Hình thức xử lý
            </label>
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="Nhắc nhở trước lớp, viết bản kiểm điểm..."
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#172B4D] block mb-1">
              Trạng thái
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-medium focus:outline-none"
            >
              <option value="Chưa xử lý">Chưa xử lý</option>
              <option value="Đã xử lý">Đã xử lý</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E3ECF8]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1677FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Lưu vi phạm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
