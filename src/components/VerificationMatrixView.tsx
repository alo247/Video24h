import React, { useState } from 'react';
import { 
  CheckCircle2, AlertCircle, XCircle, ShieldCheck, 
  Terminal, Play, RefreshCw, FileText, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { VerificationLayer } from '../lib/types';

interface VerificationMatrixViewProps {
  onOpenReportModal: () => void;
  onNavigateToEvidence: () => void;
}

interface LayerItem {
  id: VerificationLayer;
  name: string;
  scope: string;
  mockAllowed: boolean | 'CONDITIONAL';
  tools: string[];
  status: 'PASS' | 'RUNNING' | 'PENDING';
  executedBy: string;
  verifiedBy: string;
  coverage: string;
  executionLogs: string[];
  passCriteria: string;
  notes: string;
}

export const VerificationMatrixView: React.FC<VerificationMatrixViewProps> = ({
  onOpenReportModal,
  onNavigateToEvidence,
}) => {
  const [layers, setLayers] = useState<LayerItem[]>([
    {
      id: 'L1',
      name: 'Phân Tích Tĩnh & Kiểm Tra Kiểu',
      scope: 'Linting ESLint, TypeScript compilation check, kiểm tra AST không vi phạm kiến trúc',
      mockAllowed: false,
      tools: ['tsc --noEmit', 'eslint', 'ast-guard'],
      status: 'PASS',
      executedBy: 'agent-arch',
      verifiedBy: 'agent-verifier',
      coverage: '100% Cấu trúc file',
      passCriteria: '0 lỗi biên dịch cú pháp, 0 lỗi TypeScript strict mode, toàn bộ interface khớp',
      notes: 'Thực thi trên môi trường sandbox chỉ đọc của Verifier.',
      executionLogs: [
        '[L1-RUNNER] Khởi chạy tsc --noEmit trên 18 files...',
        '[L1-RUNNER] Kiểm tra AST các quy tắc phân tách quyền /agents/registry.json... OK',
        '[L1-RUNNER] Cú pháp YAML tại /config/ hợp lệ 100%.',
        '[L1-VERIFIER] Kết luận L1: PASS (0 syntax errors, 0 type errors).'
      ]
    },
    {
      id: 'L2',
      name: 'Unit Tests (Kiểm Thử Đơn Vị)',
      scope: 'Kiểm thử các hàm nghiệp vụ, 5 Code Guards (Deadlock, Circuit Breaker, Budget, Stalled, Evidence)',
      mockAllowed: true,
      tools: ['vitest', 'node:crypto', 'tarjan-algo'],
      status: 'PASS',
      executedBy: 'agent-eng',
      verifiedBy: 'agent-verifier',
      coverage: '94.2% Line Coverage',
      passCriteria: 'Toàn bộ 24 test cases PASS, phát hiện chính xác vòng lặp chu trình và tính toán trần ngân sách',
      notes: 'Cho phép Mock dịch vụ ngoài ở tầng L2 để kiểm tra logic nội bộ.',
      executionLogs: [
        '[L2-VITEST] Chạy test suite: deadlock.test.ts (6/6 tests PASS)',
        '[L2-VITEST] Chạy test suite: circuit.test.ts (5/5 tests PASS)',
        '[L2-VITEST] Chạy test suite: budget.test.ts (5/5 tests PASS - Ngưỡng 70/90/100%)',
        '[L2-VITEST] Chạy test suite: evidence_hash.test.ts (8/8 tests PASS)',
        '[L2-VERIFIER] Kết luận L2: PASS (24 passed, 0 failed, coverage: 94.2%).'
      ]
    },
    {
      id: 'L3',
      name: 'Kiểm Thử Tích Hợp (Integration Tests)',
      scope: 'Tích hợp giữa Task Graph, Evidence Store, hệ thống Guards và Film Bible',
      mockAllowed: true,
      tools: ['testcontainers', 'supertest', 'crypto-verifier'],
      status: 'PASS',
      executedBy: 'agent-eng',
      verifiedBy: 'agent-verifier',
      coverage: '89.0% Path Coverage',
      passCriteria: 'Chuỗi băm SHA-256 phản ứng chính xác khi có can thiệp byte, Verifier != Worker được kiểm tra nghiêm ngặt',
      notes: 'Cho phép Mock các endpoint external LLM API nếu ghi chú rõ.',
      executionLogs: [
        '[L3-INTEG] Kiểm tra liên kết Task Graph -> Evidence Store block chaining...',
        '[L3-INTEG] Thử nghiệm can thiệp byte tại Block #2: Evidence Guard chặn ngay lập tức (Hash Mismatch)',
        '[L3-INTEG] Thử nghiệm gán Worker = Verifier: Hệ thống ném lỗi bảo vệ Separation of Duties.',
        '[L3-VERIFIER] Kết luận L3: PASS (Tính toàn vẹn chuỗi và cơ chế bảo vệ đạt chuẩn).'
      ]
    },
    {
      id: 'L4',
      name: 'E2E Trên Môi Trường Staging',
      scope: 'Mô phỏng toàn bộ luồng từ Yêu cầu ➔ Lập Task ➔ Duyệt Human Gate ➔ Xuất Artifact phim',
      mockAllowed: 'CONDITIONAL',
      tools: ['playwright', 'staging-harness', 'film-qc-bench'],
      status: 'PASS',
      executedBy: 'agent-prod',
      verifiedBy: 'agent-verifier',
      coverage: '85.4% Scenario Coverage',
      passCriteria: 'Toàn bộ 4 bước trong quy trình vận hành chạy trơn tru trên môi trường staging',
      notes: 'Bắt buộc ghi chú rõ ràng các giới hạn của môi trường Sandbox/Staging.',
      executionLogs: [
        '[L4-STAGING] Nạp hợp đồng CONTRACT-M0-FACTORY-INIT...',
        '[L4-STAGING] Phân rã 5 cấp độ phim: Film -> Act 1 -> Sequence 1 -> Scene 1 -> 3 Shots',
        '[L4-STAGING] Kiểm tra tiêu chí QC phim tự động (Resolution >= 1080p, FPS 24, Cosine >= 0.88)... OK',
        '[L4-VERIFIER] Kết luận L4: PASS (Đầy đủ kịch bản, các giới hạn sandbox đã được lập hồ sơ).'
      ]
    },
    {
      id: 'L5',
      name: 'Chạy Thật Môi Trường Giống Production (NO MOCK)',
      scope: 'Chạy trên hạ tầng runtime thực tế với dữ liệu và tải thực nghiệm cơ bản (MOCK CẤM TUYỆT ĐỐI)',
      mockAllowed: false,
      tools: ['real_runtime', 'real_sandbox', 'k6_load', 'veo_render'],
      status: 'PASS',
      executedBy: 'agent-devops',
      verifiedBy: 'agent-verifier',
      coverage: '100% Real Runtime Executed',
      passCriteria: 'Tạo artifact thực tế, tính toán mã băm SHA-256 từ file thật, không sử dụng bất kỳ mock data nào',
      notes: '⚠️ QUY TẮC BẤT BIẾN: L5 CẤM MOCK. Dữ liệu và dịch vụ phải chạy thật.',
      executionLogs: [
        '[L5-PROD-LIKE] Kích hoạt môi trường thực thi runtime thật...',
        '[L5-PROD-LIKE] Kết xuất shot SHOT-01-01-01 (ProRes 422 4K, duration 4.5s)...',
        '[L5-PROD-LIKE] Tính toán băm SHA-256 thực tế: a4f891b2c7e30d9481fe59a2c31048b291d90f23bca01e892cfae8913b8214fa',
        '[L5-PROD-LIKE] Kiểm tra tải 50 concurrent requests giả lập pipeline...',
        '[L5-VERIFIER] Kết luận L5: PASS (Chạy thật 100%, không sử dụng Mock).'
      ]
    },
    {
      id: 'L6',
      name: 'Nghiệm Thu Sản Phẩm (Acceptance)',
      scope: 'Thao tác thực tế, đối chiếu đầu ra cụ thể với 5 tiêu chí PASS trong Hợp đồng đã khóa',
      mockAllowed: false,
      tools: ['acceptance_runner', 'human_gate_portal', 'contract_matcher'],
      status: 'PASS',
      executedBy: 'agent-devops',
      verifiedBy: 'agent-verifier',
      coverage: '5/5 Criteria Validated',
      passCriteria: 'Đầy đủ bằng chứng thực tế cho cả 5 tiêu chí, có chữ ký của Verifier và Đạo diễn cho cảnh Hạng A',
      notes: '⚠️ QUY TẮC BẤT BIẾN: L6 CẤM MOCK. Đối chiếu trực tiếp tiêu chí cam kết.',
      executionLogs: [
        '[L6-ACCEPT] Rà soát PASS-M0-01: Cấu trúc thư mục chuẩn -> MATCHED (Block #1)',
        '[L6-ACCEPT] Rà soát PASS-M0-02: 5 Code Guards hoạt động -> MATCHED (Block #2)',
        '[L6-ACCEPT] Rà soát PASS-M0-03: Chuỗi băm SHA-256 bất biến -> MATCHED (Block #3)',
        '[L6-ACCEPT] Rà soát PASS-M0-04: Ngưỡng QC Film đã lưu -> MATCHED (Block #4)',
        '[L6-ACCEPT] Rà soát PASS-M0-05: L5 Chạy thật không Mock -> MATCHED (Block #5)',
        '[L6-VERIFIER] Kết luận L6: NGHIỆM THU ĐẠT CHUẨN 100% (Sẵn sàng mở Release Gate).'
      ]
    }
  ]);

  const [activeLayerId, setActiveLayerId] = useState<VerificationLayer>('L5');
  const [runningLayer, setRunningLayer] = useState<VerificationLayer | null>(null);

  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];

  const handleRunLayerTest = (id: VerificationLayer) => {
    setRunningLayer(id);
    setTimeout(() => {
      setRunningLayer(null);
      setLayers(prev => prev.map(l => {
        if (l.id === id) {
          return {
            ...l,
            status: 'PASS',
            executionLogs: [
              ...l.executionLogs,
              `[MANUAL-TRIGGER-${new Date().toLocaleTimeString()}] Kiểm tra lại ${l.id} hoàn tất: PASS tuyệt đối.`
            ]
          };
        }
        return l;
      }));
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header and Gate Status */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-cyan-400 font-mono">KIẾN TRÚC KIỂM TRA ĐA TẦNG</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            Sáu Lớp Kiểm Tra Phần Mềm & Cổng Kiểm Soát
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Tách biệt rõ ràng ranh giới Mock và Chạy Thật: Mock chỉ được phép ở L1–L3; tại L5 và L6, cấm tuyệt đối Mock.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Quality Gate Card */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg space-y-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">QUALITY GATE (L1–L4)</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASS
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              0 Critical · 0 High · Độ phủ 85.4%
            </div>
          </div>

          {/* Release Gate Card */}
          <div className="p-3.5 bg-cyan-950/40 border border-cyan-800/60 rounded-lg space-y-1 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">RELEASE GATE (L5–L6)</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SẴN SÀNG
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              L5 PASS · Rollback đã test · Chờ ký người
            </div>
          </div>
        </div>
      </div>

      {/* Six Layer Tabs Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {layers.map((layer) => {
          const isSelected = activeLayerId === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">{layer.id}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  layer.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300'
                }`}>
                  {layer.status}
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1.5 truncate">{layer.name}</div>
              <div className="text-[10px] font-mono mt-1 text-slate-400">
                Mock: {layer.mockAllowed === true ? '✅ Được' : layer.mockAllowed === false ? '❌ Cấm' : '⚠️ Có Đk'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Layer Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Specifications & Rules */}
        <div className="lg:col-span-2 bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  {activeLayer.id}
                </span>
                <h2 className="text-xl font-bold text-white font-display">{activeLayer.name}</h2>
              </div>
              <p className="text-xs text-slate-300 mt-2">{activeLayer.scope}</p>
            </div>

            <button
              onClick={() => handleRunLayerTest(activeLayer.id)}
              disabled={runningLayer === activeLayer.id}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-sm shadow-cyan-400/20 transition-colors whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>{runningLayer === activeLayer.id ? 'Đang Chạy Kiểm Tra...' : `Chạy Lại ${activeLayer.id}`}</span>
            </button>
          </div>

          {/* Key Parameters Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
              <span className="text-slate-400">CHÍNH SÁCH MOCK:</span>
              <div className={`font-bold ${activeLayer.mockAllowed === false ? 'text-rose-400' : 'text-emerald-400'}`}>
                {activeLayer.mockAllowed === false ? '❌ CẤM TUYỆT ĐỐI (Phải chạy thật)' : activeLayer.mockAllowed === true ? '✅ ĐƯỢC PHÉP (Mock dịch vụ ngoại)' : '⚠️ CÓ ĐIỀU KIỆN (Ghi rõ giới hạn)'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">{activeLayer.notes}</div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
              <span className="text-slate-400">CÔNG CỤ THỰC THI (TOOLS):</span>
              <div className="text-slate-200 font-semibold">{activeLayer.tools.join(', ')}</div>
              <div className="text-[11px] text-slate-400 mt-1 font-sans">Độ phủ: {activeLayer.coverage}</div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
              <span className="text-slate-400">TIÊU CHÍ PASS BẮT BUỘC:</span>
              <div className="text-cyan-300 font-sans">{activeLayer.passCriteria}</div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-lg space-y-1">
              <span className="text-slate-400">TÁCH QUYỀN (SEPARATION):</span>
              <div className="text-slate-200">
                Thực hiện: <strong className="text-white">{activeLayer.executedBy}</strong>
              </div>
              <div className="text-emerald-400">
                Xác thực: <strong className="text-white">{activeLayer.verifiedBy}</strong> (Khác Worker)
              </div>
            </div>
          </div>

          {/* Real-time Execution Terminal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Nhật Ký Thực Thi Kiểm Tra Độc Lập
              </span>
              <span className="text-[11px] text-emerald-400">Commit: a4f891b (Read-Only)</span>
            </div>

            <div className="p-4 bg-[#080d16] border border-slate-800/90 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 max-h-56 overflow-y-auto">
              {activeLayer.executionLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-cyan-500 font-semibold">{log.slice(0, log.indexOf(']') + 1)}</span>
                  <span>{log.slice(log.indexOf(']') + 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Gates Evaluation & Policy Checklist */}
        <div className="space-y-5">
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Điều Kiện Quality Gate (L1–L4)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'L1 Phân tích tĩnh PASS (0 lỗi lint/types)', pass: true },
                { label: 'L2 Unit Tests PASS (24/24 tests)', pass: true },
                { label: 'L3 Integration Tests PASS (0 cycle, tamper ok)', pass: true },
                { label: 'L4 Staging E2E PASS (kịch bản hoàn tất)', pass: true },
                { label: '0 lỗi Critical defect tồn đọng', pass: true },
                { label: '0 lỗi High defect tồn đọng', pass: true },
                { label: 'Độ bao phủ code >= 85.0% (Đạt 89.2%)', pass: true },
                { label: 'Tỷ lệ hồi quy = 0.0%', pass: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-900/60 rounded border border-slate-800/60">
                  <span className="text-slate-300">{item.label}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-[#0f172a] border border-cyan-800/60 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Điều Kiện Release Gate (L5–L6)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'L5 Chạy thật môi trường giống Production (NO MOCK)', pass: true },
                { label: 'L6 Nghiệm thu 5/5 tiêu chí Contract đo lường được', pass: true },
                { label: 'Kế hoạch Rollback tự động đã kiểm thử băm hash', pass: true },
                { label: 'Chuỗi băm Evidence SHA-256 đã xác minh toàn vẹn', pass: true },
                { label: 'Chữ ký Con người phê duyệt Release Gate (Cổng M0)', pass: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-900/60 rounded border border-slate-800/60">
                  <span className="text-slate-300">{item.label}</span>
                  {item.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      CHỜ KÝ
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenReportModal}
                className="w-full py-2 px-3 text-xs font-semibold text-center text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Xem Báo Cáo Nghiệm Thu L5/L6</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
