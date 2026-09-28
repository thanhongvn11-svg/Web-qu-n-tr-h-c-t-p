import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  Users,
  Clock,
  AlertTriangle,
  Award,
  Save
} from 'lucide-react';
import { WeeklyReportData, Student } from '../types';
import { useToast } from '../components/common/Toast';

interface ReportsViewProps {
  report: WeeklyReportData;
  students: Student[];
  onSaveReport: (report: WeeklyReportData) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  report,
  students,
  onSaveReport,
}) => {
  const { showToast } = useToast();
  const [selectedWeek, setSelectedWeek] = useState<number>(report.week || 4);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [generalComment, setGeneralComment] = useState(report.generalComment);
  const [academicsSummary, setAcademicsSummary] = useState(report.academicsSummary);
  const [attendanceSummary, setAttendanceSummary] = useState(report.attendanceSummary);
  const [conductSummary, setConductSummary] = useState(report.conductSummary);

  const handleGenerateAI = () => {
    setIsGenerating(true);
    showToast('Trợ lý AI đang phân tích dữ liệu 38 học sinh để tạo báo cáo tuần...', 'info');

    setTimeout(() => {
      setGeneralComment(
        `Tuần ${selectedWeek} lớp 8A2 tiếp tục duy trì thành tích thi đua tốt. Sĩ số lớp ổn định 38/38 học sinh, tỷ lệ chuyên cần đạt 96%. Đa số học sinh chăm ngoan, chấp hành tốt nội quy nhà trường. Phong trào thi đua hoa điểm tốt được các tổ hưởng ứng sôi nổi, đặc biệt là Tổ 1 và Tổ 2.`
      );
      setAcademicsSummary(
        `Điểm trung bình toàn lớp tuần này đạt 7.42. Các môn Toán và KHTN ghi nhận sự tiến bộ vượt bậc ở một số học sinh như Nguyễn Văn A và Trần Hoàng Nam. Giáo viên chủ nhiệm đã phối hợp cùng giáo viên bộ môn Tiếng Anh để lên lịch phụ đạo tăng cường cho 2 học sinh có điểm dưới 5.0.`
      );
      setAttendanceSummary(
        `Chuyên cần duy trì ở mức cao 96%. Toàn tuần có 1 trường hợp xin nghỉ ốm có phép (Lê Minh Hoàng), 1 trường hợp nghỉ không phép đã liên hệ phụ huynh (Trần Văn B), và 1 học sinh đi muộn đã viết cam kết (Phạm Thị C).`
      );
      setConductSummary(
        `Nề nếp lớp nhìn chung ổn định, không có vi phạm nghiêm trọng. Đã xử lý dứt điểm 4 trường hợp vi phạm nhỏ. Tổ 1 tiếp tục xuất sắc dẫn đầu với 92 điểm thi đua.`
      );
      setIsGenerating(false);
      showToast('Đã tạo xong dự thảo báo cáo tuần bằng AI!', 'success');
    }, 1200);
  };

  const handleSave = () => {
    onSaveReport({
      ...report,
      week: selectedWeek,
      generalComment,
      academicsSummary,
      attendanceSummary,
      conductSummary,
    });
    showToast(`Đã lưu trữ báo cáo tuần ${selectedWeek} thành công!`, 'success');
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportWord = () => {
    const textContent = `
BÁO CÁO CÔNG TÁC CHỦ NHIỆM TUẦN ${selectedWeek} - LỚP 8A2
Trường THCS Gia An - GVCN: Nguyễn Thị Hồng Anh
Thời gian: ${report.dateRange}

I. SỐ LIỆU TỔNG QUAN:
- Sĩ số: 38 học sinh
- Tỷ lệ chuyên cần: 96%
- Điểm trung bình lớp: 7.42
- Lượt tuyên dương: 5
- Lượt vi phạm: 4

II. NHẬN XÉT CHUNG:
${generalComment}

III. NỘI DUNG CHI TIẾT:
1. Tình hình học tập:
${academicsSummary}

2. Tình hình chuyên cần:
${attendanceSummary}

3. Tình hình nề nếp rèn luyện:
${conductSummary}

IV. DANH SÁCH HỌC SINH CẦN QUAN TÂM:
- Trần Văn B: Nghỉ 3 buổi trong tháng, học lực giảm -> Mời phụ huynh trao đổi
- Phạm Thị C: Điểm Toán giảm, đi trễ 2 lần -> Kèm cặp và nhắc nhở
- Lê Thị C: Điểm KHTN & Tiếng Anh dưới 5.0 -> Phối hợp phụ đạo gỡ điểm
- Võ Ngọc Bảo: Có 2 lần vi phạm nội quy -> Giao thêm nhiệm vụ lớp

GIÁO VIÊN CHỦ NHIỆM
Nguyễn Thị Hồng Anh
    `;

    const blob = new Blob(['\uFEFF' + textContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Tuan_${selectedWeek}_Lop_8A2.doc`;
    link.click();
    showToast('Đã tải xuống file Word báo cáo tuần!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1677FF]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172B4D]">BÁO CÁO CÔNG TÁC CHỦ NHIỆM</h2>
            <p className="text-xs text-[#6B7A90]">
              Tổng hợp báo cáo tuần, báo cáo tháng gửi Ban giám hiệu nhà trường và phụ huynh học sinh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="bg-slate-50 border border-[#E3ECF8] rounded-xl px-3 py-2 text-xs font-bold text-[#172B4D] focus:outline-none"
          >
            <option value={4}>Tuần 4 (21/04 - 27/04/2025)</option>
            <option value={3}>Tuần 3 (14/04 - 20/04/2025)</option>
            <option value={2}>Tuần 2 (07/04 - 13/04/2025)</option>
            <option value={1}>Tuần 1 (31/03 - 06/04/2025)</option>
          </select>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isGenerating ? 'AI đang tạo...' : 'Tạo bằng AI'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Lưu báo cáo</span>
          </button>

          <button
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-[#1677FF] border border-blue-200 text-xs font-bold rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Word</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            <span>In / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Sheet Layout (Printable) */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs p-8 max-w-4xl mx-auto space-y-6">
        {/* Formal Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 text-center sm:text-left">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-slate-600">
              PHÒNG GD&ĐT TÁNH LINH
            </div>
            <div className="text-sm font-black text-[#172B4D]">TRƯỜNG THCS GIA AN</div>
            <div className="text-xs font-semibold text-[#1677FF] mt-0.5">LỚP HỌC: 8A2</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#172B4D]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="text-xs italic text-slate-600">Độc lập – Tự do – Hạnh phúc</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">Gia An, ngày 27 tháng 04 năm 2025</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-2">
          <h1 className="text-xl font-extrabold text-[#172B4D] tracking-tight uppercase">
            BÁO CÁO CÔNG TÁC CHỦ NHIỆM TUẦN {selectedWeek}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            (Thời gian từ ngày 21/04/2025 đến ngày 27/04/2025)
          </p>
          <p className="text-xs font-semibold text-[#1677FF] mt-0.5">
            Giáo viên chủ nhiệm: Nguyễn Thị Hồng Anh
          </p>
        </div>

        {/* KPI Mini Row */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Sĩ số lớp</span>
            <div className="text-xl font-black text-[#172B4D]">38</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Chuyên cần</span>
            <div className="text-xl font-black text-emerald-600">96.0%</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Lượt vi phạm</span>
            <div className="text-xl font-black text-amber-600">4</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Tuyên dương</span>
            <div className="text-xl font-black text-[#1677FF]">5</div>
          </div>
        </div>

        {/* Section 1: General Comment */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs">
              I
            </span>
            <span>Đánh giá chung tình hình lớp trong tuần</span>
          </h3>
          <textarea
            rows={3}
            value={generalComment}
            onChange={(e) => setGeneralComment(e.target.value)}
            className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF] leading-relaxed"
          />
        </div>

        {/* Section 2: Detailed Points */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs">
              II
            </span>
            <span>Nội dung công tác cụ thể</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#172B4D] block mb-1">
                1. Tình hình học tập & điểm kiểm tra:
              </label>
              <textarea
                rows={2}
                value={academicsSummary}
                onChange={(e) => setAcademicsSummary(e.target.value)}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF] leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-[#172B4D] block mb-1">
                2. Tình hình chuyên cần & tỷ lệ chuyên cần:
              </label>
              <textarea
                rows={2}
                value={attendanceSummary}
                onChange={(e) => setAttendanceSummary(e.target.value)}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF] leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-[#172B4D] block mb-1">
                3. Tình hình nề nếp, tác phong & kỷ luật:
              </label>
              <textarea
                rows={2}
                value={conductSummary}
                onChange={(e) => setConductSummary(e.target.value)}
                className="w-full bg-slate-50 border border-[#E3ECF8] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#1677FF] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Students to Watch Table */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#1677FF] text-white flex items-center justify-center text-xs">
              III
            </span>
            <span>Danh sách học sinh cần quan tâm & Giải pháp hỗ trợ</span>
          </h3>

          <div className="border border-[#E3ECF8] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E3ECF8] font-bold text-[#6B7A90]">
                  <th className="py-2.5 px-3">STT</th>
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3">Vấn đề cần lưu ý</th>
                  <th className="py-2.5 px-3">Biện pháp xử lý / Đề xuất của GVCN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECF8]">
                {report.studentsToWatch.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-rose-800">{item.name}</td>
                    <td className="py-2 px-3 text-slate-700">{item.issue}</td>
                    <td className="py-2 px-3 text-slate-900 font-medium">{item.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formal Signature */}
        <div className="pt-8 flex justify-between text-center text-xs font-semibold">
          <div>
            <p className="uppercase text-slate-500">Ý KIẾN BAN GIÁM HIỆU</p>
            <div className="h-16" />
            <p className="text-slate-400 italic">(Ký và ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="text-slate-500">Gia An, ngày 27 tháng 04 năm 2025</p>
            <p className="uppercase font-bold text-[#172B4D] mt-1">GIÁO VIÊN CHỦ NHIỆM</p>
            <div className="h-14" />
            <p className="font-extrabold text-[#1677FF] text-sm">Nguyễn Thị Hồng Anh</p>
          </div>
        </div>
      </div>
    </div>
  );
};
