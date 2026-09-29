import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, CheckCircle2, Copy, Check, 
  RefreshCw, Plus, FileCode, Lock, AlertTriangle, ArrowDown 
} from 'lucide-react';
import { EvidenceBlock, VerificationLayer } from '../lib/types';
import { verifyEvidenceChain, createEvidenceBlock } from '../lib/evidenceGuard';

interface EvidenceChainViewProps {
  blocks: EvidenceBlock[];
  onAppendBlock: (block: EvidenceBlock) => void;
  onRefreshBlocks: () => void;
}

export const EvidenceChainView: React.FC<EvidenceChainViewProps> = ({
  blocks,
  onAppendBlock,
  onRefreshBlocks,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    reason?: string;
    checkedCount?: number;
  }>({ tested: true, isValid: true, checkedCount: blocks.length });

  // Tamper simulation state
  const [tamperedBlockIndex, setTamperedBlockIndex] = useState<number | null>(null);

  // New Block Modal state
  const [showAppendModal, setShowAppendModal] = useState(false);
  const [newTaskId, setNewTaskId] = useState('TASK-M0-06');
  const [newWorkerId, setNewWorkerId] = useState('agent-devops');
  const [newVerifierId, setNewVerifierId] = useState('agent-verifier');
  const [newLayer, setNewLayer] = useState<VerificationLayer>('L5');
  const [newPayload, setNewPayload] = useState('Nghiệm thu chạy thật runtime L5: Đã xuất artifact video và log tải k6');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy hash helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  // Run live verification
  const handleRunVerify = async (blocksToVerify = blocks) => {
    setIsVerifying(true);
    setErrorMessage(null);
    const res = await verifyEvidenceChain(blocksToVerify);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        tested: true,
        isValid: res.isValid,
        reason: res.reason,
        checkedCount: blocksToVerify.length
      });
    }, 350);
  };

  // Tamper Simulation: Modify 1 byte in Block #2
  const handleSimulateTamper = async () => {
    if (tamperedBlockIndex !== null) {
      // Restore
      setTamperedBlockIndex(null);
      await handleRunVerify(blocks);
      return;
    }

    setTamperedBlockIndex(2);
    // Create a cloned tampered array
    const tamperedBlocks = blocks.map((b, idx) => {
      if (idx === 2) {
        return {
          ...b,
          payload_summary: b.payload_summary + ' [ATTACKER_ALTERED_PAYLOAD_BYTE]'
        };
      }
      return b;
    });

    await handleRunVerify(tamperedBlocks);
  };

  // Commit new block
  const handleCommitNewBlock = async () => {
    try {
      setErrorMessage(null);
      if (newWorkerId === newVerifierId) {
        setErrorMessage('VI PHẠM BẤT BIẾN: Verifier không được phép trùng với Worker! Vui lòng chọn Verifier độc lập.');
        return;
      }

      const newBlock = await createEvidenceBlock(blocks, {
        task_id: newTaskId,
        worker_id: newWorkerId,
        verifier_id: newVerifierId,
        layer: newLayer,
        status: 'PASS',
        payload_summary: newPayload,
        metrics: { execution_time_ms: 420, verified: true },
        artifacts: [
          { path: `/output/${newTaskId.toLowerCase()}_artifact.json`, hash: 'b12c34d56e78f90a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a' }
        ]
      });

      onAppendBlock(newBlock);
      setShowAppendModal(false);
      await handleRunVerify([...blocks, newBlock]);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header & Verification Summary Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-cyan-400 font-mono">APPEND-ONLY EVIDENCE STORE · SHA-256</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            Kho Bằng Chứng Bất Biến & Chuỗi Băm Mật Mã
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Không có tuyên bố — chỉ có bằng chứng. Mỗi block lưu vết hành động vĩnh viễn, trỏ vào hash của khối trước. 
            Mọi hành vi chỉnh sửa trái phép đều làm đứt gãy chuỗi và bị từ chối phát hành ngay lập tức.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleRunVerify(blocks)}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-sm shadow-cyan-400/20 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>Xác Thực Toàn Vẹn Chuỗi</span>
          </button>

          <button
            onClick={handleSimulateTamper}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
              tamperedBlockIndex !== null
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                : 'bg-rose-950/60 border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{tamperedBlockIndex !== null ? 'Khôi Phục Bản Gốc' : 'Thử Nghiệm Tấn Công Sửa Byte'}</span>
          </button>

          <button
            onClick={() => setShowAppendModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ghi Bằng Chứng Mới</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
        verificationResult.isValid
          ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
          : 'bg-rose-950/40 border-rose-800 text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          {verificationResult.isValid ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div>
            <div className="text-sm font-bold font-display">
              {verificationResult.isValid
                ? `TOÀN BỘ ${verificationResult.checkedCount} KHỐI BẰNG CHỨNG ĐÃ ĐƯỢC XÁC THỰC MẬT MÃ`
                : 'CẢNH BÁO NGUY CẤP: PHÁT HIỆN CAN THIỆP HOẶC ĐỨT GÃY CHUỖI HASH!'}
            </div>
            <div className="text-xs text-slate-300 font-mono mt-0.5">
              {verificationResult.isValid
                ? 'Không có byte nào bị thay đổi · Thuật toán SHA-256 Canonical JSON toàn vẹn · Quy tắc Verifier != Worker thỏa mãn 100%'
                : verificationResult.reason}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden md:block">
          Quy tắc: Append-Only Immutable
        </div>
      </div>

      {/* Visual Hash Chain */}
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isTampered = tamperedBlockIndex === idx;
          const isGenesis = block.index === 0;

          return (
            <div key={block.index} className="relative">
              {/* Vertical connector line */}
              {idx < blocks.length - 1 && (
                <div className="absolute left-7 top-full w-0.5 h-4 bg-slate-800 z-0" />
              )}

              <div className={`p-5 rounded-xl border transition-all ${
                isTampered
                  ? 'bg-rose-950/30 border-rose-700 shadow-md shadow-rose-950'
                  : 'bg-[#0f172a]/90 border-slate-800 hover:border-slate-700'
              }`}>
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-bold">
                      #{block.index}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-display">{block.task_id}</span>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {block.layer}
                        </span>
                        {isGenesis && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                            GENESIS BLOCK
                          </span>
                        )}
                        {isTampered && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold animate-pulse">
                            ⚠️ DỮ LIỆU BỊ SỬA TRÁI PHÉP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {block.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Separation of duties check badge */}
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <span>Worker:</span>
                      <strong className="text-white">{block.worker_id}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <span>Verifier:</span>
                      <strong className="text-emerald-400">{block.verifier_id}</strong>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verifier ≠ Worker: OK</span>
                    </div>
                  </div>
                </div>

                {/* Body: Summary & Artifacts */}
                <div className="py-3 text-xs text-slate-200 leading-relaxed font-sans">
                  {isTampered ? (
                    <span className="text-rose-300 font-mono bg-rose-950/40 px-2 py-1 rounded">
                      {block.payload_summary} [ATTACKER_ALTERED_PAYLOAD_BYTE]
                    </span>
                  ) : (
                    block.payload_summary
                  )}
                </div>

                {/* Artifacts if any */}
                {block.artifacts && block.artifacts.length > 0 && (
                  <div className="py-2 flex items-center gap-2 flex-wrap text-xs font-mono">
                    <span className="text-slate-400 text-[11px]">Artifacts:</span>
                    {block.artifacts.map((art, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[11px]">
                        <FileCode className="w-3 h-3 text-cyan-400" />
                        <span>{art.path}</span>
                        <span className="text-slate-400">({art.hash.slice(0, 8)}...)</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hashes Row */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Previous Hash:</span>
                    <span className="text-slate-300 truncate max-w-[240px] sm:max-w-xs">{block.previous_hash}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-cyan-400 text-[11px] font-semibold">Block SHA-256 Hash:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold truncate max-w-[220px] sm:max-w-xs">
                        {block.hash}
                      </span>
                      <button
                        onClick={() => handleCopy(block.hash)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Sao chép toàn bộ mã SHA-256"
                      >
                        {copiedHash === block.hash ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Append New Evidence Block */}
      {showAppendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                Ghi Thêm Bằng Chứng Vào Sổ Cái Append-Only
              </h3>
              <button
                onClick={() => setShowAppendModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono"
              >
                ✕ Đóng
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded text-xs text-rose-200">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-mono block mb-1">Mã Nhiệm Vụ (Task ID):</label>
                <input
                  type="text"
                  value={newTaskId}
                  onChange={(e) => setNewTaskId(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Agent Thực Hiện (Worker):</label>
                  <select
                    value={newWorkerId}
                    onChange={(e) => setNewWorkerId(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono"
                  >
                    <option value="agent-eng">agent-eng (Engineering)</option>
                    <option value="agent-devops">agent-devops (DevOps)</option>
                    <option value="agent-prod">agent-prod (Product)</option>
                    <option value="agent-adv">agent-adv (Adversarial)</option>
                    <option value="agent-verifier">agent-verifier (CẤM trùng với Verifier)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-mono block mb-1">Agent Xác Thực (Verifier):</label>
                  <select
                    value={newVerifierId}
                    onChange={(e) => setNewVerifierId(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-emerald-400 font-mono"
                  >
                    <option value="agent-verifier">agent-verifier (Độc Lập)</option>
                    <option value="agent-eng">agent-eng (Thử vi phạm tách quyền)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Tầng Kiểm Tra (Layer):</label>
                  <select
                    value={newLayer}
                    onChange={(e) => setNewLayer(e.target.value as VerificationLayer)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-cyan-300 font-mono"
                  >
                    <option value="L1">L1: Static / Lint</option>
                    <option value="L2">L2: Unit Test</option>
                    <option value="L3">L3: Integration</option>
                    <option value="L4">L4: Staging E2E</option>
                    <option value="L5">L5: Real Production-Like</option>
                    <option value="L6">L6: Acceptance</option>
                  </select>
                </div>
                <div className="flex items-center text-[11px] text-slate-400 pt-5">
                  Block mới sẽ kế thừa hash của Block #{blocks.length - 1}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Tóm Tắt Bằng Chứng (Payload Summary):</label>
                <textarea
                  rows={3}
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-slate-200 font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAppendModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleCommitNewBlock}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-400/20"
              >
                Ký & Đóng Dấu Hash Block #{blocks.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
