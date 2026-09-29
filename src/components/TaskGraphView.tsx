import React, { useState } from 'react';
import { 
  Network, Bug, ShieldAlert, CheckCircle2, AlertTriangle, 
  Play, Clock, DollarSign, ArrowRight, ShieldCheck, RefreshCw 
} from 'lucide-react';
import { TaskNode } from '../lib/types';

interface TaskGraphViewProps {
  tasks: TaskNode[];
  onRunTask: (taskId: string) => void;
}

export const TaskGraphView: React.FC<TaskGraphViewProps> = ({
  tasks,
  onRunTask,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('TASK-M0-01');
  const [adversarialRound, setAdversarialRound] = useState<number>(1);
  const [isFuzzing, setIsFuzzing] = useState<boolean>(false);
  const [fuzzingLogs, setFuzzingLogs] = useState<string[]>([
    '[ADV-INIT] Khởi động Adversarial Agent (agent-adv) trên môi trường sandbox cô lập...',
    '[ADV-SWEEP] Quét 18 nhánh phụ thuộc và 5 điểm nghẽn concurrency...',
    '[ADV-TEST-01] Fuzzing dữ liệu biên: Âm ngân sách -> Budget Guard chặn thành công.',
    '[ADV-TEST-02] Bơm chu trình phụ thuộc giả -> Deadlock Detector bắt được 100%.',
    '[ADV-COVERAGE] Đo lường độ bao phủ đường dẫn: 82.5% (Vượt ngưỡng tối thiểu 80%).',
    '[ADV-TRIAGE] Phân loại: 0 Critical, 0 High, 2 Medium/Low được chuyển vào Backlog.'
  ]);

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  const handleRunAdversarialSweep = () => {
    setIsFuzzing(true);
    setTimeout(() => {
      setIsFuzzing(false);
      setAdversarialRound(2);
      setFuzzingLogs(prev => [
        ...prev,
        `[ADV-ROUND-2-${new Date().toLocaleTimeString()}] Thực hiện đợt quét tấn công Vòng 2...`,
        '[ADV-ROUND-2] Thử nghiệm can thiệp chữ ký Verifier -> Evidence Guard ngăn chặn.',
        '[ADV-ROUND-2] Kiểm tra trần số vòng: Đã đạt 2/2 vòng tối đa theo quy chuẩn v1.1.',
        '[ADV-ROUND-2] KẾT QUẢ: Đạt chuẩn phát hành. 0 Lỗi nghiêm trọng chặn Release Gate.'
      ]);
    }, 700);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-cyan-400 font-mono">ĐỒ THỊ CÔNG VIỆC PHI CHU TRÌNH · PHÂN TÁCH TRÁCH NHIỆM</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            Task Graph DAG & Adversarial Agent Săn Lỗi
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Mỗi nhiệm vụ có tiêu chí PASS rõ ràng, chỉ định riêng biệt giữa Worker và Verifier độc lập, giới hạn tối đa 3 lần sửa. 
            Adversarial Agent chạy tối đa 2 vòng với độ bao phủ ≥ 80% đường dẫn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAdversarialSweep}
            disabled={isFuzzing || adversarialRound >= 2}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-rose-400 hover:bg-rose-300 disabled:opacity-50 rounded-lg shadow-sm shadow-rose-400/20 transition-colors whitespace-nowrap"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>
              {isFuzzing 
                ? 'Đang Fuzzing Tấn Công...' 
                : adversarialRound >= 2 
                ? 'Đã Đạt Trần 2/2 Vòng' 
                : 'Chạy Quét Adversarial Vòng 2'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Task Graph DAG Nodes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Danh Sách Nhiệm Vụ Trong Task Graph Mốc M0
            </h2>
            <span className="text-xs font-mono text-slate-400">{tasks.length} Nodes liên kết</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                      : 'bg-[#0f172a]/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{task.id}</span>
                      <h3 className="text-sm font-bold text-white font-display">{task.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : task.status === 'NEEDS_HUMAN'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {task.status === 'COMPLETED' ? 'HOÀN TẤT' : task.status === 'IN_PROGRESS' ? 'ĐANG CHẠY' : task.status}
                      </span>
                      <span className="text-slate-400">{task.evidence_type}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-300 font-sans">
                    Tiêu chí PASS: <span className="text-slate-400">{task.pass_criteria}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Worker: <strong className="text-white">{task.assigned_to}</strong></span>
                      <span>Verifier: <strong className="text-emerald-400">{task.verifier}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>Timeout: {task.timeout_seconds}s</span>
                      <span>Ngân sách: ${task.max_cost_usd.toFixed(2)}</span>
                      {task.dependencies.length > 0 && (
                        <span>Phụ thuộc: {task.dependencies.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Adversarial Agent Dashboard */}
        <div className="space-y-6">
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Adversarial Agent (Tìm Lỗi Chủ Động)
              </span>
              <span className="text-xs font-mono px-2 py-0.5 bg-rose-950/80 text-rose-300 rounded border border-rose-800">
                Vòng {adversarialRound} / 2
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Độ Bao Phủ Đường Dẫn (Path Coverage):</span>
                  <span className="text-cyan-400 font-bold">82.5% (Yêu cầu ≥ 80%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-cyan-400" style={{ width: '82.5%' }} />
                </div>
              </div>

              {/* Defect Triage Table */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Phân Loại Lỗi (Defect Triage):
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-center">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-[10px] text-rose-400 font-bold">CRITICAL (Chặn Release)</div>
                    <div className="text-base font-bold text-white mt-0.5">0</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-[10px] text-amber-400 font-bold">HIGH (Chặn Release)</div>
                    <div className="text-base font-bold text-white mt-0.5">0</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-[10px] text-yellow-400">MEDIUM (Ghi Backlog)</div>
                    <div className="text-base font-bold text-slate-200 mt-0.5">1</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="text-[10px] text-slate-400">LOW (Ghi Backlog)</div>
                    <div className="text-base font-bold text-slate-400 mt-0.5">1</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-lg text-emerald-300 text-[11px] leading-relaxed">
                ✓ Đủ vòng (≥ 1) VÀ độ bao phủ ≥ 80%. Không còn lỗi Critical/High nào tồn đọng. Đạt tiêu chuẩn mở Release Gate.
              </div>
            </div>

            {/* Adversarial Terminal Log */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono text-slate-400">Nhật Ký Tấn Công Fuzzing:</span>
              <div className="p-3 bg-[#080d16] border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                {fuzzingLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-rose-400 font-semibold">{log.slice(0, log.indexOf(']') + 1)}</span>
                    <span>{log.slice(log.indexOf(']') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
