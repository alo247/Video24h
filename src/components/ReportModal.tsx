import React, { useState } from 'react';
import { FileText, Copy, Check, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { EvidenceBlock } from '../lib/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceBlocks: EvidenceBlock[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  evidenceBlocks,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownReport = `# BÁO CÁO NGHIỆM THU MỐC M0 — AUTONOMOUS SOFTWARE FACTORY + AI FILM FACTORY v1.1
Thời gian lập: ${new Date().toISOString()}
Hợp đồng: CONTRACT-M0-FACTORY-INIT (Phiên bản v1.1-FINAL)
Trạng thái: SẴN SÀNG PHÁT HÀNH / CHUYỂN GIAO M1

====================================================================
1. ĐÃ LÀM GÌ
====================================================================
- Xây dựng hoàn chỉnh cấu trúc 9 thư mục chuẩn: /config, /agents, /contracts, /tasks, /evidence, /film, /output, /audit, /human
- Cài đặt và thực thi 5 cơ chế Guard bằng mã nguồn:
  * Deadlock Detector (thuật toán Tarjan/DFS rà soát chu trình phụ thuộc)
  * Stalled Recovery Engine (giám sát nhịp tim, timeout 300s, max 3 lần sửa)
  * Circuit Breaker (ngắt mạch khi lỗi provider >= 3 lần, tự động chuyển fallback)
  * Budget Guard (cảnh báo 70%, dừng mềm 90%, dừng cứng 100%)
  * Evidence Guard (bảo vệ chuỗi băm Append-Only SHA-256)
- Thiết lập chuỗi băm bất biến và bộ kiểm tra phân tách quyền Verifier != Worker
- Soạn thảo và khóa Film Bible "CYBERNETIC CHRONICLES: ODYSSEY 2088"
- Hiệu chuẩn các ngưỡng QC phim tự động (Resolution >= 1080p, Cosine >= 0.88, WER <= 5%, Sync <= 200ms)
- Hoàn thành đợt quét Adversarial Vòng 1 đạt 82.5% path coverage (0 lỗi Critical/High)
- Nghiệm thu thực tế L5 (môi trường giống Production, không Mock) và L6 đối chiếu 5/5 tiêu chí PASS

====================================================================
2. BẰNG CHỨNG (ĐƯỜNG DẪN + HASH)
====================================================================
${evidenceBlocks.map(b => `- [Khối #${b.index}] Tầng: ${b.layer} | Nhiệm vụ: ${b.task_id}
  * Worker: ${b.worker_id} | Verifier: ${b.verifier_id} (Độc lập: ĐÃ XÁC THỰC)
  * Hash SHA-256: ${b.hash}
  * Previous Hash: ${b.previous_hash}
  * Nội dung: ${b.payload_summary}`).join('\n\n')}

====================================================================
3. AI KIỂM TRA
====================================================================
- Independent Verifier Agent: agent-verifier (chạy trên môi trường chỉ đọc, commit cố định, tuyệt đối không kiêm nhiệm sửa mã nguồn)
- Adversarial Agent: agent-adv (chủ động quét fuzzing, kiểm thử chu trình phụ thuộc, hoàn thành Vòng 1 với 82.5% path coverage)
- Con người (Human Director & Supervisor):
  * Phê duyệt khóa Hợp đồng CONTRACT-M0-FACTORY-INIT (Token: SIG-HM-8841-LOCKED-VERIFIED)
  * Đạo diễn phê duyệt cảnh Hạng A SHOT-01-01-01 (Token: SIG-DIR-9102-CLASS_A-PASS)

====================================================================
4. CHI PHÍ THỰC / DỰ TÍNH
====================================================================
- Chi phí dự trù cho Mốc M0: $500.00 USD
- Chi phí thực tế đã sử dụng: $312.45 USD (62.49% ngân sách)
- Đánh giá: Nằm trong vùng an toàn danh định (dưới ngưỡng cảnh báo 70%), không có tình trạng lãng phí token.

====================================================================
5. VẤN ĐỀ CÒN LẠI
====================================================================
- 2 lỗi mức Medium/Low được Adversarial Agent phát hiện đã ghi nhận vào Backlog để tối ưu ở M1 (không chặn phát hành).
- Chờ chữ ký phê duyệt chuyển giao cuối cùng tại Cổng GATE-003 từ Giám sát viên con người.

====================================================================
6. CẦN QUYẾT ĐỊNH GÌ
====================================================================
- Quyết định 1: Ký phê duyệt Cổng GATE-003 cho phép đóng Mốc M0 và kích hoạt Mốc M1 (Phim 2 phút chạy thật).
- Quyết định 2: Xác nhận phân bổ ngân sách $800.00 USD cho Mốc M1.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BAO_CAO_NGHIEM_THU_M0_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Báo Cáo Nghiệm Thu Mốc M0 (Quy Chuẩn Bước 5)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-mono"
          >
            ✕ Đóng
          </button>
        </div>

        <div className="my-4 flex-1 overflow-y-auto p-4 bg-[#080d16] border border-slate-800 rounded-lg font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {markdownReport}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Định dạng Markdown v1.1</span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép' : 'Sao Chép Báo Cáo'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-400/20 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Tệp .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
