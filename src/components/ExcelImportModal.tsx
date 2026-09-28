import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { Modal } from './common/Modal';
import { Student } from '../types';
import { useToast } from './common/Toast';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (newStudents: Student[], mode: 'append' | 'replace') => void;
  existingCount: number;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  existingCount,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string>('');
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Reset state when closed
  const handleClose = () => {
    setFileName('');
    setParsedStudents([]);
    setErrorMsg('');
    setIsLoading(false);
    onClose();
  };

  // 1. Download template Excel file
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'STT': 1,
        'Mã học sinh': 'HS8A239',
        'Họ và tên': 'Nguyễn Hoàng Long',
        'Ngày sinh': '15/06/2010',
        'Giới tính': 'Nam',
        'Tổ': 'Tổ 1',
        'Tên phụ huynh': 'Nguyễn Hoàng Dũng',
        'Số điện thoại': '0988 123 456',
        'Địa chỉ': 'Thôn 3, Gia An, Tánh Linh',
        'Điểm Toán': 8.0,
        'Điểm Ngữ văn': 7.5,
        'Điểm KHTN': 7.8,
        'Điểm Tiếng Anh': 7.0,
        'Điểm LS&ĐL': 8.0,
        'Điểm GDCD': 8.5,
        'Điểm Tin học': 7.5,
        'Điểm Công nghệ': 7.5,
        'Ghi chú GVCN': 'Học sinh ngoan, tiếp thu nhanh'
      },
      {
        'STT': 2,
        'Mã học sinh': 'HS8A240',
        'Họ và tên': 'Trần Ngọc Bích',
        'Ngày sinh': '20/08/2010',
        'Giới tính': 'Nữ',
        'Tổ': 'Tổ 2',
        'Tên phụ huynh': 'Trần Văn An',
        'Số điện thoại': '0912 987 654',
        'Địa chỉ': 'Khu phố 1, Gia An, Tánh Linh',
        'Điểm Toán': 8.5,
        'Điểm Ngữ văn': 8.2,
        'Điểm KHTN': 8.0,
        'Điểm Tiếng Anh': 8.5,
        'Điểm LS&ĐL': 8.5,
        'Điểm GDCD': 9.0,
        'Điểm Tin học': 8.0,
        'Điểm Công nghệ': 8.0,
        'Ghi chú GVCN': 'Tích cực phát biểu xây dựng bài'
      },
      {
        'STT': 3,
        'Mã học sinh': 'HS8A241',
        'Họ và tên': 'Lê Đình Bảo',
        'Ngày sinh': '05/11/2010',
        'Giới tính': 'Nam',
        'Tổ': 'Tổ 3',
        'Tên phụ huynh': 'Lê Đình Thắng',
        'Số điện thoại': '0934 555 777',
        'Địa chỉ': 'Thôn 5, Gia An, Tánh Linh',
        'Điểm Toán': 7.2,
        'Điểm Ngữ văn': 7.0,
        'Điểm KHTN': 7.5,
        'Điểm Tiếng Anh': 6.8,
        'Điểm LS&ĐL': 7.5,
        'Điểm GDCD': 8.0,
        'Điểm Tin học': 7.0,
        'Điểm Công nghệ': 7.0,
        'Ghi chú GVCN': 'Ý thức kỷ luật tốt'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set column widths for clean readability
    worksheet['!cols'] = [
      { wch: 6 },  // STT
      { wch: 14 }, // Mã học sinh
      { wch: 22 }, // Họ và tên
      { wch: 14 }, // Ngày sinh
      { wch: 10 }, // Giới tính
      { wch: 10 }, // Tổ
      { wch: 22 }, // Tên phụ huynh
      { wch: 16 }, // Số điện thoại
      { wch: 30 }, // Địa chỉ
      { wch: 12 }, // Toán
      { wch: 14 }, // Ngữ văn
      { wch: 12 }, // KHTN
      { wch: 15 }, // Tiếng Anh
      { wch: 12 }, // LS&ĐL
      { wch: 12 }, // GDCD
      { wch: 14 }, // Tin học
      { wch: 16 }, // Công nghệ
      { wch: 35 }, // Ghi chú
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_Mau_8A2');
    XLSX.writeFile(workbook, 'File_Mau_Danh_Sach_Hoc_Sinh_8A2.xlsx');
    showToast('Đã tải xuống file mẫu Excel thành công!', 'success');
  };

  // Helper to extract value regardless of slight header naming variations
  const getValue = (row: any, keys: string[]): any => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
        return row[k];
      }
      // Also test lowercase match
      const foundKey = Object.keys(row).find(
        (rk) => rk.toLowerCase().trim() === k.toLowerCase().trim()
      );
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
        return row[foundKey];
      }
    }
    return undefined;
  };

  // 2. Parse uploaded file (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setErrorMsg('');

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse to JSON
        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          setErrorMsg('File Excel không có dữ liệu học sinh hoặc bảng tính trống.');
          setIsLoading(false);
          return;
        }

        const parsedList: Student[] = [];

        rawRows.forEach((row, index) => {
          const fullName = String(
            getValue(row, ['Họ và tên', 'Họ tên', 'Họ Và Tên', 'Tên học sinh', 'Tên', 'FullName', 'Name']) || ''
          ).trim();

          // Skip completely empty rows
          if (!fullName) return;

          const studentCode = String(
            getValue(row, ['Mã học sinh', 'Mã HS', 'Mã Số', 'Mã số', 'StudentCode', 'Code']) ||
            `HS8A2${index + 40}`
          ).trim();

          const birthday = String(
            getValue(row, ['Ngày sinh', 'Sinh nhật', 'Birthday', 'DOB']) || '15/05/2010'
          ).trim();

          const genderRaw = String(
            getValue(row, ['Giới tính', 'Phái', 'Gender', 'Sex']) || 'Nam'
          ).trim().toLowerCase();
          const gender: 'Nam' | 'Nữ' = genderRaw === 'nữ' || genderRaw === 'nu' || genderRaw === 'female' ? 'Nữ' : 'Nam';

          const groupRaw = String(
            getValue(row, ['Tổ', 'Tổ sinh hoạt', 'Group', 'Team']) || 'Tổ 1'
          ).trim();
          const group: 'Tổ 1' | 'Tổ 2' | 'Tổ 3' | 'Tổ 4' =
            groupRaw.includes('2') ? 'Tổ 2' :
            groupRaw.includes('3') ? 'Tổ 3' :
            groupRaw.includes('4') ? 'Tổ 4' : 'Tổ 1';

          const parentName = String(
            getValue(row, ['Tên phụ huynh', 'Phụ huynh', 'Họ tên phụ huynh', 'ParentName', 'Parent']) ||
            'Phụ huynh học sinh'
          ).trim();

          const parentPhone = String(
            getValue(row, ['Số điện thoại', 'SĐT', 'Số ĐT', 'Điện thoại', 'Phone', 'ParentPhone']) ||
            '0987 111 222'
          ).trim();

          const address = String(
            getValue(row, ['Địa chỉ', 'Nơi ở', 'Thường trú', 'Address']) ||
            'Gia An, Tánh Linh, Bình Thuận'
          ).trim();

          // Scores
          const math = Number(getValue(row, ['Điểm Toán', 'Toán', 'Math']) || 7.5);
          const literature = Number(getValue(row, ['Điểm Ngữ văn', 'Ngữ văn', 'Văn', 'Literature']) || 7.0);
          const science = Number(getValue(row, ['Điểm KHTN', 'KHTN', 'Khoa học tự nhiên', 'Science']) || 7.5);
          const english = Number(getValue(row, ['Điểm Tiếng Anh', 'Tiếng Anh', 'Anh', 'English']) || 7.0);
          const historyGeo = Number(getValue(row, ['Điểm LS&ĐL', 'LS&ĐL', 'Lịch sử & Địa lí', 'Lịch sử', 'Địa lí']) || 7.5);
          const civics = Number(getValue(row, ['Điểm GDCD', 'GDCD', 'Giáo dục công dân']) || 8.0);
          const informatics = Number(getValue(row, ['Điểm Tin học', 'Tin học', 'Tin']) || 7.5);
          const technology = Number(getValue(row, ['Điểm Công nghệ', 'Công nghệ', 'CN']) || 7.0);

          const scores = { math, literature, science, english, historyGeo, civics, informatics, technology };
          const scoresArray = Object.values(scores);
          const gpa = Number((scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length).toFixed(2));
          const academicRating = gpa >= 8.0 ? 'Tốt' : gpa >= 6.5 ? 'Khá' : gpa >= 5.0 ? 'Trung bình' : 'Yếu';

          const teacherNote = String(
            getValue(row, ['Ghi chú GVCN', 'Ghi chú', 'Nhận xét', 'Note']) ||
            'Nhập tự động từ file Excel.'
          ).trim();

          const studentObj: Student = {
            id: `hs-import-${Date.now()}-${index}`,
            studentCode,
            fullName,
            birthday,
            gender,
            group,
            parentName,
            parentPhone,
            address,
            status: 'Đang học',
            academicRating,
            conductRating: 'Tốt',
            gpa,
            conductScore: 92,
            scores,
            weeklyAttendance: {
              monday: 'present',
              tuesday: 'present',
              wednesday: 'present',
              thursday: 'present',
              friday: 'present',
            },
            totalAbsences: 0,
            totalLate: 0,
            teacherNote,
            actionPlan: 'Duy trì kết quả học tập và nề nếp thi đua.',
            avatar:
              gender === 'Nữ'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          };

          parsedList.push(studentObj);
        });

        if (parsedList.length === 0) {
          setErrorMsg('Không tìm thấy học sinh hợp lệ trong file. Vui lòng tải file mẫu để kiểm tra đúng định dạng cột.');
        } else {
          setParsedStudents(parsedList);
          showToast(`Đã nhận diện thành công ${parsedList.length} học sinh từ file!`, 'success');
        }
      } catch (err: any) {
        console.error('Lỗi khi đọc file Excel:', err);
        setErrorMsg('Không thể đọc file Excel. Vui lòng đảm bảo file không bị lỗi và đúng định dạng .xlsx, .xls hoặc .csv.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Đã xảy ra lỗi trong quá trình đọc file.');
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  // 3. Confirm and save
  const handleConfirmImport = () => {
    if (parsedStudents.length === 0) return;
    onImportSuccess(parsedStudents, importMode);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nhập danh sách học sinh từ file Excel"
      subtitle="Hỗ trợ các định dạng .xlsx, .xls và .csv. Tự động nhận diện điểm số và tính ĐTB"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {/* Step 1 & 2 Action Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Download template */}
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D47A1] mb-1">
                <FileSpreadsheet className="w-4 h-4 text-[#1677FF]" />
                <span>Bước 1: Tải file mẫu chuẩn lớp 8A2</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                File Excel mẫu đã được định dạng sẵn đầy đủ các cột (Mã HS, Họ tên, Ngày sinh, Giới tính, Tổ, Điểm các môn...).
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-[#1677FF] border border-blue-300 text-xs font-bold rounded-xl transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Tải file mẫu Excel (.xlsx)</span>
            </button>
          </div>

          {/* Upload file box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1677FF]/40 hover:border-[#1677FF] bg-slate-50 hover:bg-blue-50/30 p-4 rounded-2xl cursor-pointer transition flex flex-col items-center justify-center text-center group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#1677FF] flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-[#172B4D]">
              {fileName ? fileName : 'Bấm vào đây để chọn file Excel từ máy'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hỗ trợ kéo thả file .xlsx, .xls hoặc .csv
            </p>
          </div>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="py-8 text-center text-xs text-[#1677FF] font-semibold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Đang đọc và phân tích dữ liệu bảng tính Excel...</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedStudents.length > 0 && !isLoading && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Đã nhận diện thành công {parsedStudents.length} học sinh sẵn sàng nhập
                </span>
              </div>

              {/* Import mode options */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="text-[#1677FF] focus:ring-0"
                  />
                  <span>Thêm mới vào sĩ số ({existingCount} HS hiện có)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-amber-900">
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="text-amber-600 focus:ring-0"
                  />
                  <span>Ghi đè thay thế danh sách cũ</span>
                </label>
              </div>
            </div>

            {/* Preview table */}
            <div className="border border-[#E3ECF8] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 border-b border-[#E3ECF8] text-[11px] font-bold text-[#6B7A90]">
                  <tr>
                    <th className="py-2 px-2.5">STT</th>
                    <th className="py-2 px-2.5">Mã HS</th>
                    <th className="py-2 px-3">Họ và tên</th>
                    <th className="py-2 px-2">Giới tính</th>
                    <th className="py-2 px-2.5">Ngày sinh</th>
                    <th className="py-2 px-2">Tổ</th>
                    <th className="py-2 px-3">Phụ huynh</th>
                    <th className="py-2 px-2.5">SĐT</th>
                    <th className="py-2 px-2 text-center text-[#1677FF]">ĐTB</th>
                    <th className="py-2 px-2 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECF8]">
                  {parsedStudents.map((s, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30">
                      <td className="py-2 px-2.5 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2.5 font-mono font-semibold text-[#1677FF]">{s.studentCode}</td>
                      <td className="py-2 px-3 font-bold text-[#172B4D] whitespace-nowrap">{s.fullName}</td>
                      <td className="py-2 px-2 text-slate-600">{s.gender}</td>
                      <td className="py-2 px-2.5 text-slate-600 whitespace-nowrap">{s.birthday}</td>
                      <td className="py-2 px-2 font-medium text-slate-700">{s.group}</td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">{s.parentName}</td>
                      <td className="py-2 px-2.5 font-mono text-slate-600 whitespace-nowrap">{s.parentPhone}</td>
                      <td className="py-2 px-2 text-center font-bold text-[#1677FF]">{s.gpa}</td>
                      <td className="py-2 px-2 text-center">
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E3ECF8]">
          <div className="text-xs text-slate-500">
            {parsedStudents.length > 0 ? (
              <span>
                Sẵn sàng thêm <strong>{parsedStudents.length} học sinh</strong> vào hệ thống
              </span>
            ) : (
              <span>Vui lòng tải file mẫu và chọn file để tiếp tục</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              disabled={parsedStudents.length === 0}
              onClick={handleConfirmImport}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#1677FF] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <FileCheck className="w-4 h-4" />
              <span>
                Xác nhận nhập {parsedStudents.length > 0 ? `(${parsedStudents.length} học sinh)` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
