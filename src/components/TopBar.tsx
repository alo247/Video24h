import React from 'react';
import { Shield, AlertOctagon, FileText, Sparkles, CheckCircle2, Film } from 'lucide-react';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEmergencyStopped: boolean;
  onToggleEmergencyStop: () => void;
  onOpenReportModal: () => void;
  onOpenAiModal: () => void;
  budgetPercent: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  isEmergencyStopped,
  onToggleEmergencyStop,
  onOpenReportModal,
  onOpenAiModal,
  budgetPercent,
}) => {
  const navTabs = [
    { id: 'film', label: '🎬 TẠO VIDEO AI (STUDIO)' },
    { id: 'overview', label: 'Tổng quan & Guards' },
    { id: 'layers', label: '6 Lớp Kiểm Tra (L1-L6)' },
    { id: 'evidence', label: 'Bằng Chứng Bất Biến' },
    { id: 'tasks', label: 'Task Graph & Adversarial' },
    { id: 'human', label: 'Cổng Phê Duyệt' },
    { id: 'agents', label: 'Agents & Chính Sách' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0c121d]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-[1700px] mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap hover:text-cyan-300 transition-colors"
          >
            Video24h Factory v1.1
          </a>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            · M0 Infra Active · Budget {budgetPercent}%
          </span>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean text hover underlines) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isFilmTab = tab.id === 'film';
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap transition-colors text-xs uppercase tracking-wider py-1 ${
                  isActive
                    ? isFilmTab
                      ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                      : 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : isFilmTab
                    ? 'text-amber-400/90 font-bold hover:text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dedicated Primary Call to Action: Tạo Video AI */}
          <button
            onClick={() => setActiveTab('film')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md ${
              activeTab === 'film'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-amber-500/30'
                : 'bg-gradient-to-r from-amber-400/95 to-amber-500/95 hover:from-amber-300 hover:to-amber-400 text-slate-950 hover:shadow-amber-500/20 shadow-sm animate-pulse'
            }`}
            title="Mở Studio Tạo Video AI ngay"
          >
            <Film className="w-3.5 h-3.5 fill-slate-950" />
            <span>Tạo Video AI</span>
          </button>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 rounded-lg hover:bg-cyan-900/60 transition-colors whitespace-nowrap"
            title="Sử dụng Gemini 3.8 Flash để tham vấn Orchestrator"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">AI Orchestrator</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Báo Cáo M0</span>
          </button>

          <button
            onClick={onToggleEmergencyStop}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              isEmergencyStopped
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500'
                : 'bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{isEmergencyStopped ? 'ĐÃ DỪNG KHẨN CẤP' : 'Dừng Khẩn Cấp'}</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Nav if screen < 1280px */}
      <div className="xl:hidden flex items-center gap-4 px-6 py-2 border-t border-slate-800/60 overflow-x-auto text-xs scrollbar-none">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-1 transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-400 font-bold border-b border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
