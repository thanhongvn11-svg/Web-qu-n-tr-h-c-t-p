import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  Award
} from 'lucide-react';
import { Student } from '../types';
import { useToast } from '../components/common/Toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AIAssistantViewProps {
  students: Student[];
  initialPrompt?: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  students,
  initialPrompt,
}) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Xin chào cô Nguyễn Thị Hồng Anh! Tôi là Trợ lý AI GVCN của lớp 8A2 - THCS Gia An. Tôi đã nắm toàn bộ dữ liệu 38 học sinh, điểm số các môn, chuyên cần và nề nếp tuần 4. Tôi có thể hỗ trợ cô soạn nhận xét học bạ, phân tích học sinh cần quan tâm, hoặc soạn báo cáo tuần ngay bây giờ.',
      time: '08:00',
    },
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'Tạo nhận xét học bạ học sinh', prompt: 'Hãy tạo nhận xét học bạ mẫu cho học sinh Nguyễn Văn A và Phạm Thị C dựa trên điểm số và nề nếp thực tế.' },
    { label: 'Phân tích học sinh cần quan tâm', prompt: 'Phân tích danh sách các học sinh cần quan tâm đặc biệt trong tuần này và đề xuất biện pháp sư phạm cho từng em.' },
    { label: 'Gợi ý biện pháp giáo dục', prompt: 'Học sinh Võ Ngọc Bảo có 2 lần vi phạm nề nếp (sử dụng điện thoại, nói chuyện riêng). Hãy gợi ý biện pháp giáo dục tích cực, không dùng kỷ luật tiêu cực.' },
    { label: 'Tóm tắt báo cáo tuần gửi BGH', prompt: 'Tóm tắt báo cáo công tác chủ nhiệm tuần 4 lớp 8A2 ngắn gọn trong 4 gạch đầu dòng để báo cáo Ban giám hiệu.' },
    { label: 'Phân tích học sinh tiến bộ', prompt: 'Chỉ ra các học sinh có tiến bộ vượt bậc tuần này và gợi ý lời khen ngợi trước cờ/trước lớp.' },
    { label: 'Soạn tin nhắn gửi phụ huynh', prompt: 'Soạn mẫu tin nhắn Zalo gửi phụ huynh em Trần Văn B thông báo việc nghỉ học không phép 3 buổi một cách tế nhị, mang tính xây dựng.' },
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: prompt,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI smart synthesis based on real 8A2 student data
    setTimeout(() => {
      let reply = '';

      if (prompt.toLowerCase().includes('nhận xét học bạ') || prompt.toLowerCase().includes('nguyễn văn a')) {
        reply = `Dưới đây là mẫu nhận xét học bạ chi tiết cho học sinh dựa trên dữ liệu lớp 8A2:

1. **Nguyễn Văn A (Mã HS: HS8A201 - ĐTB: 7.58 - Xếp loại: Tốt - Rèn luyện: Tốt):**
- *Ưu điểm:* Có ý thức tự giác học tập cao, tiến bộ vượt bậc môn Toán (+1.5 điểm, kiểm tra đạt 8.5). Tác phong nề nếp nghiêm túc, tham gia nhiệt tình các phong trào của lớp và trường.
- *Cần khắc phục:* Cần dành thêm thời gian ôn tập từ vựng và kỹ năng nghe môn Tiếng Anh (hiện đạt 6.4).
- *Đánh giá chung:* Đạt kết quả học tập Tốt, rèn luyện Tốt. Xứng đáng là tấm gương học sinh tiến bộ của lớp 8A2.

2. **Phạm Thị C (Mã HS: HS8A204 - ĐTB: 5.85 - Xếp loại: Trung bình - Rèn luyện: Khá):**
- *Nhận xét:* Học sinh ngoan ngoãn, hòa đồng với bạn bè. Tuy nhiên trong tuần có 2 lần đi học trễ và điểm kiểm tra môn Toán, Tiếng Anh có xu hướng giảm.
- *Biện pháp:* GVCN phân công bạn Đỗ Khánh Vy kèm cặp thêm trong giờ tự quản và đề nghị gia đình đôn đốc giờ giấc sinh hoạt.`;
      } else if (prompt.toLowerCase().includes('cần quan tâm') || prompt.toLowerCase().includes('theo dõi')) {
        reply = `Dựa trên dữ liệu giám sát tuần 4 của lớp 8A2, hệ thống phát hiện **4 học sinh cần quan tâm đặc biệt**:

1. **Trần Văn B (Tổ 2):**
- *Hiện trạng:* Nghỉ 3 buổi trong tháng (có 1 buổi không phép ngày 23/04), ĐTB 5.6.
- *Biện pháp đề xuất:* GVCN gọi điện hoặc mời phụ huynh (ông Trần Văn Thắng) tới trường trao đổi tìm hiểu hoàn cảnh gia đình và tạo điều kiện cho học sinh chép bài bổ sung.

2. **Phạm Thị C (Tổ 2):**
- *Hiện trạng:* Điểm Toán giảm 1.2 điểm so với tháng trước, đi trễ 2 buổi sáng thứ 2.
- *Biện pháp đề xuất:* Xếp ngồi cùng bàn với Đỗ Khánh Vy (Lớp phó học tập), động viên em không nản lòng.

3. **Lê Thị C (Tổ 3):**
- *Hiện trạng:* Môn KHTN đạt 4.8 và Tiếng Anh đạt 4.5 (dưới chuẩn 5.0).
- *Biện pháp đề xuất:* Phối hợp cùng Thầy Dũng (KHTN) và Cô Linh (Tiếng Anh) cho làm bài tập phụ đạo gỡ điểm.

4. **Võ Ngọc Bảo (Tổ 4):**
- *Hiện trạng:* Có 2 lần vi phạm nề nếp (sử dụng điện thoại, nói chuyện riêng).
- *Biện pháp đề xuất:* Giao nhiệm vụ Phó ban Lao động / Quản lý trang thiết bị để chuyển hướng năng lượng tích cực.`;
      } else if (prompt.toLowerCase().includes('tin nhắn') || prompt.toLowerCase().includes('phụ huynh')) {
        reply = `Cô có thể tham khảo mẫu tin nhắn gửi phụ huynh em Trần Văn B như sau:

"Kính gửi phụ huynh em Trần Văn B,
Tôi là Nguyễn Thị Hồng Anh - GVCN lớp 8A2 trường THCS Gia An. Tuần này em B vắng học 1 buổi vào ngày thứ Tư (23/04) và trong tháng em đã nghỉ 3 buổi. Tôi rất quan tâm đến sức khỏe và tình hình học tập của em, sợ em bị hổng kiến thức chuẩn bị cho kỳ kiểm tra sắp tới. 
Rất mong gia đình bớt chút thời gian liên hệ lại với tôi qua số điện thoại này hoặc sắp xếp gặp trực tiếp tại trường để cô trò và gia đình cùng phối hợp hỗ trợ em tốt nhất. 
Trân trọng cảm ơn quý phụ huynh!"`;
      } else if (prompt.toLowerCase().includes('tiến bộ') || prompt.toLowerCase().includes('khen ngợi')) {
        reply = `**DANH SÁCH HỌC SINH TIẾN BỘ VƯỢT BẬC TUẦN 4 - LỚP 8A2:**

1. **Nguyễn Văn A:** Điểm Toán bứt phá từ 7.0 lên 8.5 (+1.5 điểm), chăm chỉ làm bài tập về nhà.
2. **Trần Thị Bích Ngọc:** Điểm trung bình nâng từ 6.5 lên 7.65 (+1.2 điểm), tích cực xây dựng bài.
3. **Lê Minh Hoàng:** Tiến bộ môn Tin học và KHTN (+1.0 điểm).
4. **Phạm Văn D:** Môn Tiếng Anh tăng từ 6.2 lên 7.4.
5. **Đỗ Khánh Vy:** Nhặt được 200.000đ giao nộp trả lại bạn - Tuyên dương gương người tốt việc tốt toàn trường.

*Gợi ý lời khen của GVCN trước lớp:* 
"Cô rất vui mừng biểu dương tinh thần nỗ lực của các bạn trong tuần qua. Thành tích của các em chứng minh rằng chỉ cần có quyết tâm và phương pháp đúng đắn, mỗi bạn đều có thể vượt qua giới hạn của chính mình!"`;
      } else {
        reply = `Dựa trên dữ liệu thực tế của lớp 8A2 (Sĩ số 38, GVCN Nguyễn Thị Hồng Anh):
- Điểm trung bình toàn lớp hiện tại đạt 7.42 (tăng +0.3 điểm).
- Chuyên cần đạt 96.0% (36 có mặt, 1 nghỉ phép, 1 không phép, 1 đi muộn).
- Có 5 học sinh được tuyên dương và 4 học sinh cần theo dõi.
- Tổ 1 đang dẫn đầu phong trào thi đua với 92 điểm.

Tôi luôn sẵn sàng hỗ trợ cô giáo tạo báo cáo, phân tích số liệu hoặc chuẩn bị kế hoạch sinh hoạt lớp cuối tuần. Cô hãy nhập câu hỏi cụ thể tiếp theo nhé!`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Đã sao chép nội dung vào khay nhớ tạm!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#172B4D]">TRỢ LÝ AI GIÁO VIÊN CHỦ NHIỆM</h2>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-[#1677FF] text-[10px] font-black uppercase">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-[#6B7A90]">
              Cố vấn sư phạm thông minh: Tạo nhận xét học bạ, phân tích học sinh cần quan tâm, gợi ý biện pháp giáo dục tích cực
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'm-reset',
                sender: 'ai',
                text: 'Hộp thoại đã được làm mới. Tôi sẵn sàng hỗ trợ cô về công tác chủ nhiệm lớp 8A2!',
                time: 'Vừa xong',
              },
            ]);
            showToast('Đã làm mới cuộc trò chuyện', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm mới hội thoại</span>
        </button>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="bg-white p-3.5 rounded-2xl border border-[#E3ECF8] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Gợi ý câu hỏi nhanh:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="text-left px-3 py-1.5 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200/60 text-[#1677FF] text-xs font-semibold rounded-xl transition hover:scale-[1.02]"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-[#E3ECF8] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#1677FF] text-white ring-2 ring-blue-100'
                    : 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white ring-2 ring-indigo-100'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed relative group shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#1677FF] text-white rounded-tr-xs'
                    : 'bg-slate-50 text-[#172B4D] border border-[#E3ECF8] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{m.text}</div>

                <div
                  className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                    m.sender === 'user' ? 'text-blue-100 border-t border-white/20' : 'text-slate-400 border-t border-slate-200'
                  }`}
                >
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="hover:text-[#1677FF] flex items-center gap-1 font-semibold transition"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-[#E3ECF8] rounded-2xl px-4 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-bounce [animation-delay:0.4s]" />
                <span className="font-medium text-slate-600">AI đang suy nghĩ & tổng hợp dữ liệu lớp...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-[#E3ECF8] bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi hoặc yêu cầu cho Trợ lý AI (ví dụ: tạo nhận xét học sinh, giải pháp hỗ trợ...)"
              className="flex-1 bg-white border border-[#E3ECF8] rounded-xl px-4 py-2.5 text-xs font-medium text-[#172B4D] placeholder-slate-400 focus:outline-none focus:border-[#1677FF] shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-[#1677FF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <span>Gửi</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="text-[10px] text-slate-400 text-center mt-2 italic">
            * Lưu ý: AI chỉ đóng vai trò tư vấn, đề xuất gợi ý sư phạm và hỗ trợ soạn thảo. Quyết định cuối cùng luôn thuộc về Giáo viên chủ nhiệm.
          </div>
        </div>
      </div>
    </div>
  );
};
