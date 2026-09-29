import React, { useState } from 'react';
import { 
  UserCheck, ShieldCheck, Lock, CheckCircle2, Clock, 
  AlertOctagon, Key, FileCheck, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { HumanGateApproval } from '../lib/types';

interface HumanGatesViewProps {
  gates: HumanGateApproval[];
  onSignGate: (gateId: string, signerName: string, token: string, notes: string) => void;
  onOpenReportModal: () => void;
}

export const HumanGatesView: React.FC<HumanGatesViewProps> = ({
  gates,
  onSignGate,
  onOpenReportModal,
}) => {
  const [signingGateId, setSigningGateId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('vuducquandc@gmail.com');
  const [signatureToken, setSignatureToken] = useState('');
  const [notes, setNotes] = useState('');

  const targetGate = gates.find(g => g.id === signingGateId);

  const handleOpenSignModal = (gateId: string) => {
    setSigningGateId(gateId);
    setSignatureToken(`SIG-AUTH-${Date.now().toString().slice(-6)}`);
    setNotes('Xác nhận hoàn tất đầy đủ 5 tiêu chí PASS, chuỗi băm bất biến đã xác minh, phê duyệt chuyển giao.');
  };

  const handleSubmitSignature = () => {
    if (!signingGateId) return;
    onSignGate(signingGateId, signerName, signatureToken, notes);
    setSigningGateId(null);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-cyan-400 font-mono">HUMAN-IN-THE-LOOP · QUYỀN QUYẾT ĐỊNH TỐI CAO</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            Cổng Kiểm Soát Con Người (Human Gates)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            AI tự động xử lý mã nguồn, kiểm thử và lỗi nhà cung cấp; nhưng điểm khóa Contract, duyệt cảnh Hạng A, 
            kết thúc mỗi mốc, phát hành Production và điều chỉnh ngân sách BẮT BUỘC phải có chữ ký con người.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Xuất Báo Cáo Nghiệm Thu</span>
        </button>
      </div>

      {/* Mandatory Human Checkpoints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gates.map((gate) => {
          const isApproved = gate.status === 'APPROVED';

          return (
            <div
              key={gate.id}
              className={`p-6 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                isApproved
                  ? 'bg-[#0f172a]/90 border-slate-800'
                  : 'bg-gradient-to-br from-amber-950/30 via-slate-900 to-[#0f172a] border-amber-800/80 shadow-md shadow-amber-950'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">{gate.id}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                    isApproved
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                  }`}>
                    {isApproved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ĐÃ PHÊ DUYỆT</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>CHỜ CHỮ KÝ NGƯỜI</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-display">{gate.title}</h3>

                <div className="text-xs text-slate-300 leading-relaxed font-sans">
                  {gate.notes || 'Cổng kiểm soát an toàn bắt buộc theo Hiến pháp v1.1-FINAL.'}
                </div>

                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Loại Cổng:</span>
                    <span className="text-white">{gate.type}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Vai Trò Yêu Cầu:</span>
                    <span className="text-amber-400 font-bold">{gate.required_role}</span>
                  </div>
                  {isApproved && (
                    <>
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Người Ký:</span>
                        <span className="text-emerald-400">{gate.approved_by}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Mã Chữ Ký:</span>
                        <span className="text-cyan-300 truncate max-w-[200px]">{gate.signature_token}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Mục tiêu: {gate.target_ref}</span>

                {!isApproved ? (
                  <button
                    onClick={() => handleOpenSignModal(gate.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20 transition-colors whitespace-nowrap"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Ký Phê Duyệt Cổng Này</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-mono font-semibold">
                    ✓ Chữ Ký Số Hợp Lệ
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Signature Modal */}
      {signingGateId && targetGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-amber-800/80 rounded-xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Xác Nhận Ký Số Con Người — {targetGate.id}
              </h3>
              <button
                onClick={() => setSigningGateId(null)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">{targetGate.title}</p>
              <p className="text-slate-400">
                Lưu ý: Bằng việc ký phê duyệt, bạn xác nhận đã xem xét bằng chứng kỹ thuật, tính toàn vẹn chuỗi hash 
                và chấp thuận mở khóa bước chuyển giao tiếp theo (Mốc M1).
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-mono block mb-1">Họ Tên / Email Giám Sát Viên:</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Mã Token Ký Số (Signature Token):</label>
                <input
                  type="text"
                  value={signatureToken}
                  onChange={(e) => setSignatureToken(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Ghi Chú Phê Duyệt (Notes):</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSigningGateId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitSignature}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-400/20"
              >
                Ký & Đóng Dấu Phê Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
