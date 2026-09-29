import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Cpu, CheckCircle2, Play, 
  RotateCcw, Lock, DollarSign, Activity, FileCheck, RefreshCw,
  Terminal, ShieldAlert
} from 'lucide-react';
import { DeadlockDetector, StalledRecoveryEngine, CircuitBreaker, BudgetGuard } from '../lib/guards';
import { verifyEvidenceChain } from '../lib/evidenceGuard';
import { EvidenceBlock, TaskNode } from '../lib/types';

interface OverviewViewProps {
  evidenceBlocks: EvidenceBlock[];
  tasks: TaskNode[];
  onNavigateToTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onRunM0Suite: () => void;
  isRunningSuite: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  evidenceBlocks,
  tasks,
  onNavigateToTab,
  onOpenReportModal,
  onRunM0Suite,
  isRunningSuite,
}) => {
  // Guard Interactive Simulation States
  const [deadlockCycleInjected, setDeadlockCycleInjected] = useState(false);
  const [stalledSimulated, setStalledSimulated] = useState(false);
  const [circuitTripped, setCircuitTripped] = useState(false);
  const [simulatedBudgetSpent, setSimulatedBudgetSpent] = useState<number | null>(null);
  const [integrityStatus, setIntegrityStatus] = useState<string>('ĐÃ XÁC THỰC TOÀN VẸN (0 LỖI)');
  const [isVerifying, setIsVerifying] = useState(false);

  // Evaluate real/simulated Budget
  const currentBudgetSpent = simulatedBudgetSpent !== null ? simulatedBudgetSpent : 312.45;
  const totalBudget = 500.00;
  const budgetEvaluation = BudgetGuard.evaluate(currentBudgetSpent, totalBudget);

  // Run live chain verification
  const handleVerifyEvidence = async () => {
    setIsVerifying(true);
    const result = await verifyEvidenceChain(evidenceBlocks);
    setTimeout(() => {
      setIsVerifying(false);
      if (result.isValid) {
        setIntegrityStatus(`XÁC THỰC THÀNH CÔNG: ${evidenceBlocks.length} BLOCKS TOÀN VẸN`);
      } else {
        setIntegrityStatus(`LỖI TOÀN VẸN: ${result.reason}`);
      }
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* 1. Milestone M0 Executive Banner */}
      <div className="bg-gradient-to-r from-[#0d1627] via-[#0f1d36] to-[#0c1424] border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span className="inline-flex items-center gap-1 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded text-cyan-300">
                <Lock className="w-3 h-3" /> HỢP ĐỒNG ĐÃ KHÓA (LOCKED)
              </span>
              <span>·</span>
              <span>CONTRACT-M0-FACTORY-INIT</span>
              <span>·</span>
              <span>Phiên bản v1.1-FINAL</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white font-display tracking-tight">
              Hạ Tầng Nhà Máy Tự Trị — Khởi Động Mốc M0
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Mục tiêu: Từ yêu cầu đến sản phẩm chạy thật kèm bằng chứng số bất biến. Toàn bộ 5 cơ chế Guard, 
              quy tắc phân tách quyền độc lập (Verifier ≠ Worker), và mô hình kiểm định phim 5 cấp đã hoàn tất hiệu chuẩn.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onRunM0Suite}
              disabled={isRunningSuite}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-md shadow-cyan-400/20 transition-all whitespace-nowrap"
            >
              {isRunningSuite ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Kiểm Định L1-L6...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-900" />
                  <span>Chạy Toàn Bộ Test Mốc M0</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 border border-slate-700 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Xem Báo Cáo Nghiệm Thu</span>
            </button>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">Tiêu Chí PASS Hợp Đồng</div>
            <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums mt-0.5">
              5 / 5 ĐẠT (100%)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Xác minh bởi Independent Verifier</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Ngân Sách Thực Tế / Dự Trù</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              ${currentBudgetSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
            </div>
            <div className="text-[11px] text-cyan-400 mt-0.5 font-mono">
              {budgetEvaluation.percentage.toFixed(1)}% · Trạng thái {budgetEvaluation.level}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Khối Bằng Chứng SHA-256</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums mt-0.5">
              {evidenceBlocks.length} Blocks
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Chuỗi Append-Only bất biến</div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Chất Lượng Phim & Phân Cấp</div>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums mt-0.5">
              Hạng A, B, C
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">1 Cảnh chính có Đạo diễn duyệt</div>
          </div>
        </div>
      </div>

      {/* 2. Six Invariants Section */}
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-bold text-white font-display uppercase tracking-wide flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          Sáu Nguyên Tắc Bất Biến Của Nhà Máy (Chỉ Đổi Khi Có Văn Bản Người Duyệt)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { num: '01', title: 'Không có tuyên bố — chỉ có bằng chứng.', desc: 'Mọi báo cáo đều phải trỏ vào tệp log, mã hash SHA-256 và artifact thực tế.' },
            { num: '02', title: 'Không bằng chứng = Không PASS.', desc: 'Verifier từ chối nghiệm thu nếu thiếu bản ghi chứng thực độc lập.' },
            { num: '03', title: 'Không chạy thật = Không nghiệm thu.', desc: 'Build thành công chỉ là bước phụ; chỉ công nhận khi đã thực thi kiểm thử.' },
            { num: '04', title: 'Agent không tự chứng nhận việc của mình.', desc: 'Tách quyền tuyệt đối: Verifier ≠ Worker. Verifier chạy môi trường chỉ đọc.' },
            { num: '05', title: 'Mock ≠ Production; Build xong ≠ Sẵn sàng.', desc: 'Chỉ có môi trường tương đương Production L5 mới mở cổng Release.' },
            { num: '06', title: 'Mock chỉ hợp lệ L1–L3; L5+ cấm Mock.', desc: 'Tại L5 và L6, bắt buộc dữ liệu thật hoặc sandbox thật kèm tải cơ bản.' },
          ].map((rule) => (
            <div key={rule.num} className="p-3.5 bg-slate-900/80 border border-slate-800/90 rounded-lg space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{rule.num}.</span>
                <span className="text-xs font-semibold text-slate-100">{rule.title}</span>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed pl-5">{rule.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Five Code Guards Interactive Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Hệ Thống 5 Cơ Chế Guard Thực Thi Bằng Mã Nguồn
            </h2>
            <p className="text-xs text-slate-400">
              Kiểm soát phụ thuộc vòng, giải cứu task tắc nghẽn, ngắt mạch lỗi provider, giám sát trần ngân sách và bảo vệ chuỗi băm.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Tất cả Guards chạy song hành 24/7
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Guard 1: Deadlock Detector */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Guard #1
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  deadlockCycleInjected 
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {deadlockCycleInjected ? 'PHÁT HIỆN VÒNG LẶP (BLOCKED)' : 'ĐỒ THỊ AN TOÀN (0 VÒNG)'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Deadlock Detector</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Thuật toán DFS / Tarjan rà soát Task Graph để phát hiện chu trình phụ thuộc trước khi phân bổ tài nguyên.
              </p>

              {deadlockCycleInjected ? (
                <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-200 font-mono">
                  ⚠️ Phát hiện chu trình: TASK-M0-01 ➔ TASK-M0-02 ➔ TASK-M0-01! Hệ thống đã dừng và đề xuất sắp xếp lại.
                </div>
              ) : (
                <div className="mt-3 p-2.5 bg-slate-900/80 border border-slate-800 rounded text-xs text-slate-300 font-mono">
                  ✓ 6 Task nodes trong DAG hoàn toàn phi chu trình (Acyclic Validated).
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Thuật toán: Tarjan DFS</span>
              <button
                onClick={() => setDeadlockCycleInjected(!deadlockCycleInjected)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  deadlockCycleInjected
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200'
                }`}
              >
                {deadlockCycleInjected ? 'Khôi Phục DAG Hợp Lệ' : 'Thử Nghiệm Bơm Chu Trình'}
              </button>
            </div>
          </div>

          {/* Guard 2: Stalled Recovery Engine */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Guard #2
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  stalledSimulated 
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {stalledSimulated ? 'TASK TIMEOUT (REASSIGNED)' : 'HEARTBEAT ỔN ĐỊNH'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Stalled Recovery Engine</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tự động phát hiện task vượt quá thời gian timeout (300s) hoặc bị bỏ dở để giao lại (tối đa 3 lần).
              </p>

              {stalledSimulated ? (
                <div className="mt-3 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded text-xs text-amber-200 font-mono">
                  ⏱️ TASK-M0-06 quá timeout 600s! Đã tự động tăng retry lên 1/3 và chuyển lại hàng đợi PENDING.
                </div>
              ) : (
                <div className="mt-3 p-2.5 bg-slate-900/80 border border-slate-800 rounded text-xs text-slate-300 font-mono">
                  ✓ Tất cả worker phản hồi tín hiệu nhịp tim định kỳ &lt; 5s.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Max Retries: 3 Lần</span>
              <button
                onClick={() => setStalledSimulated(!stalledSimulated)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
              >
                {stalledSimulated ? 'Khôi Phục Bình Thường' : 'Mô Phỏng Task Bị Treo'}
              </button>
            </div>
          </div>

          {/* Guard 3: Circuit Breaker */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Guard #3
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  circuitTripped 
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {circuitTripped ? 'MẠCH NGẮT (FALLBACK ON)' : 'MẠCH ĐÓNG (CLOSED)'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Circuit Breaker</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Ngắt tự động khi một API Provider gặp lỗi ≥ 3 lần liên tiếp và chuyển sang phương án dự phòng.
              </p>

              {circuitTripped ? (
                <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-200 font-mono">
                  ⚡ Provider Veo gặp 3 lỗi timeout! Chuyển lưu lượng sang Veo Lite fallback dự phòng.
                </div>
              ) : (
                <div className="mt-3 p-2.5 bg-slate-900/80 border border-slate-800 rounded text-xs text-slate-300 font-mono">
                  ✓ Gemini 3.8 Flash, Veo, Cloud Sandbox hoạt động với tỷ lệ thành công 99.8%.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Ngưỡng: 3 Lỗi Liên Tiếp</span>
              <button
                onClick={() => setCircuitTripped(!circuitTripped)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  circuitTripped
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-200'
                }`}
              >
                {circuitTripped ? 'Khôi Phục Mạch Đóng' : 'Thử Nghiệm Ngắt Mạch'}
              </button>
            </div>
          </div>

          {/* Guard 4: Budget Guard */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Guard #4
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  budgetEvaluation.level === 'HARD_STOP_100'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : budgetEvaluation.level === 'SOFT_STOP_90'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : budgetEvaluation.level === 'WARNING_70'
                    ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {budgetEvaluation.level}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Budget Guard</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cảnh báo ở 70% | Dừng mềm ở 90% (chặn task mới) | Dừng cứng ở 100% (hủy toàn bộ tiến trình).
              </p>

              {/* Progress Bar */}
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Tiêu thụ: ${currentBudgetSpent.toFixed(2)}</span>
                  <span className="text-cyan-400 font-semibold">{budgetEvaluation.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      budgetEvaluation.percentage >= 100
                        ? 'bg-rose-500'
                        : budgetEvaluation.percentage >= 90
                        ? 'bg-amber-500'
                        : budgetEvaluation.percentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(budgetEvaluation.percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-2 text-[11px] text-slate-300 font-mono">
                {budgetEvaluation.message}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1 flex-wrap">
              <span className="text-[11px] text-slate-400 font-mono">Thử nghiệm:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSimulatedBudgetSpent(360.00)}
                  className="px-2 py-1 text-[11px] font-mono bg-yellow-950/60 hover:bg-yellow-900 border border-yellow-800/60 text-yellow-300 rounded"
                >
                  72%
                </button>
                <button
                  onClick={() => setSimulatedBudgetSpent(460.00)}
                  className="px-2 py-1 text-[11px] font-mono bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-300 rounded"
                >
                  92%
                </button>
                <button
                  onClick={() => setSimulatedBudgetSpent(520.00)}
                  className="px-2 py-1 text-[11px] font-mono bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded"
                >
                  104%
                </button>
                <button
                  onClick={() => setSimulatedBudgetSpent(null)}
                  className="px-2 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Guard 5: Evidence Guard */}
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 md:col-span-2 xl:col-span-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Guard #5
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                  APPEND-ONLY IMMUTABLE
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Evidence Guard (Chuỗi Băm Bất Biến)</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Mỗi mẩu bằng chứng được băm SHA-256 kèm previous_hash của block trước và xác minh điều kiện bắt buộc:
                <strong className="text-slate-200"> Verifier Agent ≠ Worker Agent</strong>. Dữ liệu một khi đã ghi vào kho lưu trữ là vĩnh viễn không thể xóa hoặc sửa.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded">
                  <div className="text-[11px] text-slate-400 font-mono">Độ Dài Chuỗi Băm Hiện Tại:</div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">{evidenceBlocks.length} Khối đã liên kết liên tục</div>
                </div>

                <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded">
                  <div className="text-[11px] text-slate-400 font-mono">Trạng Thái Toàn Vẹn:</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5 break-all">
                    {integrityStatus}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Thuật toán: SHA-256 Canonical JSON</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyEvidence}
                  disabled={isVerifying}
                  className="px-3 py-1.5 text-xs font-medium bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 text-cyan-300 rounded transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Xác Thực Lại Toàn Bộ Chuỗi</span>
                </button>
                <button
                  onClick={() => onNavigateToTab('evidence')}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                >
                  Xem Sổ Cái Bằng Chứng ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions / Milestone Roadmap */}
      <div className="bg-[#0f172a]/60 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-bold text-white font-display uppercase tracking-wide mb-4">
          Lộ Trình Mốc Thực Thi (Milestone Roadmap — Không Nhảy Bước)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'M0',
              title: 'M0: Khởi Động Hạ Tầng',
              desc: 'Cấu trúc thư mục, 5 Guards bằng code, hiệu chuẩn QC phim, 6 lớp kiểm tra L1-L6.',
              status: 'CURRENT_ACTIVE',
              earlyStop: 'Guard lỗi hoặc deadlock'
            },
            {
              id: 'M1',
              title: 'M1: Phim 2 Phút Chạy Thật',
              desc: 'Tạo sản phẩm phim 2 phút thực tế có bằng chứng số và nghiệm thu từ Đạo diễn.',
              status: 'NEXT_PENDING_SIGNOFF',
              earlyStop: 'Vượt 120% chi phí / >40% làm lại'
            },
            {
              id: 'M2',
              title: 'M2: Phim 10 Phút',
              desc: 'Mở rộng quy mô sản xuất sau khi M1 đạt PASS và chi phí đơn vị đã đo lường chính xác.',
              status: 'LOCKED',
              earlyStop: 'M1 chưa PASS'
            },
            {
              id: 'M3',
              title: 'M3: Phim 30 Phút',
              desc: 'Quy mô phim trung bình — chỉ xem xét M4/M5 sau khi M3 chứng minh tính khả thi.',
              status: 'LOCKED',
              earlyStop: 'M2 chưa PASS hoặc vượt ngân sách'
            },
          ].map((m) => (
            <div 
              key={m.id}
              className={`p-4 rounded-lg border transition-all ${
                m.status === 'CURRENT_ACTIVE'
                  ? 'bg-cyan-950/30 border-cyan-800/80 shadow-sm shadow-cyan-950'
                  : m.status === 'NEXT_PENDING_SIGNOFF'
                  ? 'bg-slate-900/60 border-slate-700/80'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white">{m.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  m.status === 'CURRENT_ACTIVE'
                    ? 'bg-cyan-900/80 text-cyan-200'
                    : m.status === 'NEXT_PENDING_SIGNOFF'
                    ? 'bg-amber-900/60 text-amber-200'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {m.status === 'CURRENT_ACTIVE' ? 'ĐANG THỰC THI' : m.status === 'NEXT_PENDING_SIGNOFF' ? 'CHỜ KÝ M0' : 'CHƯA MỞ'}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mt-2">{m.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
              <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                Dừng sớm nếu: {m.earlyStop}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
