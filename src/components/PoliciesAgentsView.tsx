import React, { useState } from 'react';
import { 
  Users, ShieldBan, FileCode, CheckCircle2, Lock, 
  Terminal, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { AgentDefinition } from '../lib/types';

interface PoliciesAgentsViewProps {
  agents: AgentDefinition[];
}

export const PoliciesAgentsView: React.FC<PoliciesAgentsViewProps> = ({ agents }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'config'>('agents');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-verifier');
  const [selectedConfigFile, setSelectedConfigFile] = useState<string>('gates.yaml');

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const configFilesContent: Record<string, string> = {
    'gates.yaml': `# Quality & Release Gates Config
version: "1.1-FINAL"
gates:
  quality_gate:
    required_layers: [L1, L2, L3, L4]
    max_critical_defects: 0
    max_high_defects: 0
    min_test_coverage_percent: 85.0
    max_regression_rate_percent: 0.0
  release_gate:
    required_layers: [L5, L6]
    rollback_plan_tested: true
    evidence_chain_verified: true
    human_signoff_required: true`,
    'film_qc.yaml': `# Film QC Configuration & Calibration
version: "1.1-FINAL"
milestone_active: "M0"
tiers:
  class_a: "HUMAN_MANDATORY_EACH"
  class_b: "RANDOM_SAMPLE_MIN_20_PERCENT"
  class_c: "AUTOMATED_QC_SUFFICIENT"
automated_qc:
  technical:
    min_resolution: "1920x1080"
    allowed_fps: [24, 25, 30, 60]
    required_codec: ["prores_422", "h265_hevc", "h264_high"]
  character_consistency:
    embedding_model: "gemini-embedding-2-preview"
    min_cosine_similarity: 0.88
  dialogue_fidelity:
    max_wer_percent: 5.0
  subtitle_synchronization:
    max_sync_offset_ms: 200`,
    'budget.yaml': `# Budget Guard & Concurrency Limits
currency: "USD"
total_allocated_budget: 2500.00
current_spent: 312.45
thresholds:
  warning_percent: 70.0 # Cảnh báo
  soft_stop_percent: 90.0 # Dừng mềm
  hard_stop_percent: 100.0 # Dừng cứng
concurrency_limits:
  max_depth: 3
  max_child: 4
  max_active_agents: 8`,
    'retention.yaml': `# Retention & Evidence Policy
evidence_policy:
  hash_chain_retention: "PERMANENT_IMMUTABLE"
  metadata_retention: "PERMANENT_IMMUTABLE"
  hash_algorithm: "sha256"
audit_policy:
  action_log_retention: "PERMANENT_IMMUTABLE"
  tamper_verification_frequency_hours: 1`
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-cyan-400 font-mono">QUYỀN HẠN AGENTS · CHÍNH SÁCH BẰNG FILE YAML</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            Quy Chế Tách Quyền & Hồ Sơ Chính Sách Hệ Thống
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Không nhét toàn bộ vào prompt. Tách riêng vai trò từng Agent, chính sách dạng file YAML trong /config/, 
            và Code Guard chạy thật. Nguyên tắc tách quyền: Verifier ≠ Worker; Verifier chạy trên môi trường chỉ đọc.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'agents' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            9 Vai Trò Agents & Lệnh Cấm
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'config' ? 'bg-cyan-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tệp Chính Sách (/config/)
          </button>
        </div>
      </div>

      {activeTab === 'agents' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Agents List */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-xs font-bold text-white font-display uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-cyan-400" />
              Danh Mục 9 Agent Trong Hệ Thống
            </h2>

            <div className="space-y-1.5">
              {agents.map((ag) => {
                const isSelected = ag.id === selectedAgentId;
                return (
                  <button
                    key={ag.id}
                    onClick={() => setSelectedAgentId(ag.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold">{ag.name}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                        {ag.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-1">{ag.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Agent Dossier */}
          <div className="lg:col-span-2 bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedAgent.id}
                </span>
                <h3 className="text-xl font-bold text-white font-display">{selectedAgent.name}</h3>
                <span className="text-xs font-mono text-slate-400">· {selectedAgent.role}</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedAgent.description}</p>
            </div>

            {/* Strictly Forbidden Actions */}
            <div className="p-4 bg-rose-950/30 border border-rose-800/70 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-rose-300 font-display uppercase tracking-wider flex items-center gap-2">
                <ShieldBan className="w-4 h-4 text-rose-400" />
                CẤM TUYỆT ĐỐI (STRICTLY FORBIDDEN INVARIANTS)
              </h4>
              <ul className="space-y-2 text-xs text-rose-200">
                {selectedAgent.strictly_forbidden.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">✗</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Allowed Capabilities & Environment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400">MÔI TRƯỜNG THỰC THI (ENVIRONMENT):</span>
                <div className="text-cyan-300 font-bold">{selectedAgent.environment}</div>
                <div className="text-[11px] text-slate-400 font-sans mt-1">
                  Cách ly hoàn toàn, chỉ cấp quyền tối thiểu theo vai trò.
                </div>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400">NĂNG LỰC ĐƯỢC CẤP (CAPABILITIES):</span>
                <div className="text-slate-200">{selectedAgent.capabilities.join(', ')}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Config Files Tab */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            {['gates.yaml', 'film_qc.yaml', 'budget.yaml', 'retention.yaml'].map((file) => (
              <button
                key={file}
                onClick={() => setSelectedConfigFile(file)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all ${
                  selectedConfigFile === file
                    ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📁 /config/{file}
              </button>
            ))}

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-[11px] text-amber-200/80 leading-relaxed font-sans">
              ⚠️ Mọi thay đổi giới hạn/ngưỡng trong /config/ bắt buộc phải có văn bản hoặc chữ ký người duyệt.
            </div>
          </div>

          <div className="lg:col-span-3 bg-[#080d16] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
              <span className="text-slate-300 font-semibold">/config/{selectedConfigFile}</span>
              <span className="text-emerald-400 font-bold">✓ YAML HỢP LỆ</span>
            </div>

            <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-3 bg-black/40 rounded-lg max-h-[500px]">
              {configFilesContent[selectedConfigFile]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
