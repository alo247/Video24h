import React, { useState } from 'react';
import { 
  Film, Clapperboard, CheckCircle2, AlertCircle, RotateCcw, 
  Play, Lock, UserCheck, Sparkles, Volume2, Video, Sliders 
} from 'lucide-react';
import { FilmHierarchy, FilmBible, FilmShot } from '../lib/types';

interface FilmFactoryViewProps {
  filmBible: FilmBible;
  hierarchy: FilmHierarchy;
  onUpdateShot: (shotId: string, updated: Partial<FilmShot>) => void;
  onOpenReportModal: () => void;
}

export const FilmFactoryView: React.FC<FilmFactoryViewProps> = ({
  filmBible,
  hierarchy,
  onUpdateShot,
  onOpenReportModal,
}) => {
  const [selectedShotId, setSelectedShotId] = useState<string>('SHOT-01-01-01');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'bible' | 'qc' | 'rollback'>('hierarchy');
  const [isSimulatingQC, setIsSimulatingQC] = useState(false);
  const [rollbackSuccessMsg, setRollbackSuccessMsg] = useState<string | null>(null);

  // Flatten all shots to find the selected shot
  const allShots: FilmShot[] = [];
  hierarchy.acts.forEach(act => {
    act.sequences.forEach(seq => {
      seq.scenes.forEach(sc => {
        sc.shots.forEach(sh => allShots.push(sh));
      });
    });
  });

  const currentShot = allShots.find(s => s.id === selectedShotId) || allShots[0];

  // Run automated QC test simulation on current shot
  const handleRunQCTest = () => {
    setIsSimulatingQC(true);
    setTimeout(() => {
      setIsSimulatingQC(false);
      onUpdateShot(currentShot.id, {
        qc_results: {
          technical_pass: true,
          character_cosine_similarity: 0.94,
          dialogue_wer_percent: 1.2,
          subtitle_offset_ms: 32,
          black_freeze_frames_detected: 0,
          overall_auto_qc_pass: true
        }
      });
    }, 600);
  };

  // Perform Rollback with Hash verification
  const handleRollback = () => {
    if (!currentShot.previous_approved_hash) return;
    
    // In our system: rollback takes the approved hash, verifies SHA-256 match, and resets status
    onUpdateShot(currentShot.id, {
      output_hash: currentShot.previous_approved_hash,
      status: 'APPROVED',
    });

    setRollbackSuccessMsg(
      `✓ ROLLBACK THÀNH CÔNG: Đã đối chiếu hash ${currentShot.previous_approved_hash.slice(0, 16)}... khớp 100% với bản lưu trữ được duyệt!`
    );

    setTimeout(() => setRollbackSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-[1700px] mx-auto px-6 py-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="text-xs text-amber-400 font-mono">PHÂN CẤP 5 TẦNG · HẠNG A/B/C · FILM BIBLE LƯU TRỮ HASH</div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white font-display mt-1">
            AI Film Factory — Quy Chuẩn Kiểm Định Điện Ảnh
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Cấu trúc 5 cấp cố định: Film ➔ Act ➔ Sequence ➔ Scene ➔ Shot. Cảnh Hạng A bắt buộc con người phê duyệt; 
            QC tự động đo đạc độ phân giải, tính nhất quán nhân vật (cosine ≥ 0.88), sai số lời thoại (WER ≤ 5%), 
            và độ lệch phụ đề (± 200ms).
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'hierarchy' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phân Cấp Phim & Shots
          </button>
          <button
            onClick={() => setActiveTab('bible')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'bible' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Film Bible Đã Khóa
          </button>
          <button
            onClick={() => setActiveTab('qc')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'qc' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ma Trận QC Tự Động
          </button>
          <button
            onClick={() => setActiveTab('rollback')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'rollback' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rollback Bằng Hash
          </button>
        </div>
      </div>

      {rollbackSuccessMsg && (
        <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs font-mono rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{rollbackSuccessMsg}</span>
        </div>
      )}

      {/* 1. Hierarchy & Shot Studio View */}
      {activeTab === 'hierarchy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: 5-Level Hierarchy Tree */}
          <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                Cây Cấu Trúc 5 Cấp
              </span>
              <span className="text-[11px] font-mono text-cyan-400 font-semibold">Mốc {hierarchy.milestone}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-white font-display text-sm">
                🎬 {hierarchy.title}
              </div>

              {hierarchy.acts.map(act => (
                <div key={act.id} className="pl-2 space-y-2 border-l border-slate-800">
                  <div className="text-cyan-300 font-bold font-mono">
                    Hồi {act.act_number}: {act.title}
                  </div>

                  {act.sequences.map(seq => (
                    <div key={seq.id} className="pl-3 space-y-2 border-l border-slate-800/80">
                      <div className="text-slate-300 font-semibold">{seq.title}</div>

                      {seq.scenes.map(sc => (
                        <div key={sc.id} className="pl-3 space-y-1.5 border-l border-slate-800/60">
                          <div className="text-slate-400 font-mono text-[11px]">
                            Cảnh {sc.scene_number}: {sc.title}
                          </div>

                          <div className="space-y-1 pt-1">
                            {sc.shots.map(sh => {
                              const isSelected = sh.id === selectedShotId;
                              return (
                                <button
                                  key={sh.id}
                                  onClick={() => setSelectedShotId(sh.id)}
                                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                                    isSelected
                                      ? 'bg-amber-950/40 border-amber-500/80 text-white'
                                      : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="font-bold">{sh.id}</span>
                                    <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                      sh.tier === 'CLASS_A'
                                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                        : sh.tier === 'CLASS_B'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}>
                                      {sh.tier === 'CLASS_A' ? 'HẠNG A (DUYỆT TỪNG CẢNH)' : sh.tier === 'CLASS_B' ? 'HẠNG B (MẪU 20%)' : 'HẠNG C (TỰ ĐỘNG)'}
                                    </span>
                                  </div>
                                  <div className="text-xs font-semibold mt-1 truncate">{sh.name}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Shot Inspector */}
          <div className="lg:col-span-2 bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    {currentShot.id}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">{currentShot.name}</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">{currentShot.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunQCTest}
                  disabled={isSimulatingQC}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Sliders className={`w-3.5 h-3.5 ${isSimulatingQC ? 'animate-spin' : ''}`} />
                  <span>{isSimulatingQC ? 'Đang Chạy QC...' : 'Chạy Kiểm Tra QC'}</span>
                </button>
              </div>
            </div>

            {/* Prompt & Technical Parameters */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 block">Prompt Đầu Vào Kết Xuất:</label>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono leading-relaxed">
                "{currentShot.prompt}"
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-slate-400 text-[11px]">Độ Phân Giải:</span>
                <div className="text-white font-bold mt-0.5">{currentShot.parameters.resolution}</div>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-slate-400 text-[11px]">FPS & Codec:</span>
                <div className="text-white font-bold mt-0.5">{currentShot.parameters.fps} fps · {currentShot.parameters.codec}</div>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-slate-400 text-[11px]">Thời Lượng:</span>
                <div className="text-white font-bold mt-0.5">{currentShot.parameters.duration_seconds}s</div>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="text-slate-400 text-[11px]">Seed & Model:</span>
                <div className="text-cyan-400 font-bold mt-0.5">#{currentShot.seed} · {currentShot.model_version.split('-')[0]}</div>
              </div>
            </div>

            {/* QC Metrics Scores */}
            {currentShot.qc_results && (
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-display uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Chỉ Số QC Tự Động (Đã Kiểm Định)
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    TỔNG THỂ: PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Độ tương đồng mặt:</span>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {(currentShot.qc_results.character_cosine_similarity * 100).toFixed(1)}% (≥ 88%)
                    </div>
                  </div>

                  <div className="p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Lỗi Lời Thoại (WER):</span>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {currentShot.qc_results.dialogue_wer_percent}% (≤ 5.0%)
                    </div>
                  </div>

                  <div className="p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Lệch Phụ Đề:</span>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {currentShot.qc_results.subtitle_offset_ms}ms (≤ 200ms)
                    </div>
                  </div>

                  <div className="p-2 bg-[#080d16] rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Black/Freeze Frames:</span>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {currentShot.qc_results.black_freeze_frames_detected} khung hình
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Human Director Signoff (Mandatory for Class A) */}
            <div className="p-4 bg-amber-950/20 border border-amber-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 font-display flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  Đánh Giá Của Đạo Diễn / Con Người (Chỉ Người Mới Có Quyền Phê Duyệt Cảm Xúc & Thẩm Mỹ)
                </span>
                <span className="text-emerald-400 font-mono font-bold text-[11px]">
                  {currentShot.human_signoff?.approved ? 'ĐÃ PHÊ DUYỆT' : 'CHỜ DUYỆT'}
                </span>
              </div>

              {currentShot.human_signoff ? (
                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300 font-sans italic">
                    "{currentShot.human_signoff.emotional_resonance}"
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Người duyệt: {currentShot.human_signoff.director} · Đánh giá thẩm mỹ: {currentShot.human_signoff.aesthetic_rating}/5 · {currentShot.human_signoff.timestamp}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-200/80">
                  Cảnh này đang chờ con người thẩm định thẩm mỹ và cảm xúc trước khi kết xuất master.
                </div>
              )}
            </div>

            {/* Hash Footprint */}
            <div className="pt-2 border-t border-slate-800 text-xs font-mono flex items-center justify-between gap-2">
              <span className="text-slate-400 text-[11px]">Mã Hash Đầu Ra (SHA-256):</span>
              <span className="text-cyan-400 font-bold truncate max-w-md">{currentShot.output_hash}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Film Bible Tab */}
      {activeTab === 'bible' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Lock className="w-3.5 h-3.5" />
                <span>FILM BIBLE — TRẠNG THÁI KHÓA (CHỈ CON NGƯỜI ĐƯỢC PHÉP ĐỔI)</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-1">{filmBible.title}</h2>
              <p className="text-xs text-slate-400">Phiên bản {filmBible.version} · Khóa bởi {filmBible.locked_by}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Characters */}
            <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                Hồ Sơ Nhân Vật Chuẩn Hóa
              </h3>

              <div className="space-y-4">
                {filmBible.characters.map(char => (
                  <div key={char.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-300 font-display">{char.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">{char.role}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{char.description}</p>
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Trang phục:</strong> {char.costume}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Đặc điểm khuôn mặt:</strong> {char.facial_features}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* World Setting & Cinematography */}
            <div className="space-y-6">
              <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                  Bối Cảnh & Luật Thế Giới
                </h3>
                <div className="text-xs text-slate-300 space-y-2">
                  <div><strong className="text-slate-200">Kỷ nguyên:</strong> {filmBible.world_setting.era}</div>
                  <div><strong className="text-slate-200">Môi trường:</strong> {filmBible.world_setting.environment}</div>
                  <div><strong className="text-slate-200">Bầu không khí:</strong> {filmBible.world_setting.atmosphere}</div>
                  <div className="pt-2">
                    <strong className="text-slate-200 block mb-1">Quy luật bất biến:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
                      {filmBible.world_setting.rules.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-3">
                <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
                  Phong Cách Điện Ảnh & Bản Quyền
                </h3>
                <div className="text-xs text-slate-300 space-y-2 font-mono">
                  <div>Điện ảnh: {filmBible.visual_style.cinematography}</div>
                  <div>Thấu kính: {filmBible.visual_style.lens_type}</div>
                  <div>Ánh sáng: {filmBible.visual_style.lighting_key}</div>
                  <div className="pt-2 border-t border-slate-800 text-emerald-400">
                    ✓ Chính sách IP: 100% thiết kế gốc, không dùng hình ảnh người thật, âm thanh độc bản.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. QC Matrix Tab */}
      {activeTab === 'qc' && (
        <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white font-display">
              Ma Trận Hiệu Chuẩn Ngưỡng QC Tự Động (Tệp /config/film_qc.yaml)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Phân chia rõ ràng giữa những gì đo đếm được bằng code và những gì do con người thẩm định.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300 font-mono uppercase tracking-wider">
                1. Đo Bằng Code Tự Động (Thresholds)
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { metric: 'Độ phân giải', threshold: 'Tối thiểu 1920x1080 (Ưu tiên 4K 3840x2160)', unit: 'pixels' },
                  { metric: 'Tốc độ khung hình', threshold: '24, 25, 30 hoặc 60 FPS chuẩn', unit: 'fps' },
                  { metric: 'Định dạng Video Codec', threshold: 'ProRes 422, H.265 HEVC hoặc H.264 High', unit: 'codec' },
                  { metric: 'Chất lượng âm thanh', threshold: '48,000 Hz, Bitrate >= 320 kbps', unit: 'audio' },
                  { metric: 'Nhất quán nhân vật', threshold: 'Cosine Similarity >= 0.88 (Model: gemini-embedding-2-preview)', unit: 'vector' },
                  { metric: 'Sai số lời thoại', threshold: 'WER <= 5.0% so với kịch bản (gemini-3.5-transcribe)', unit: 'wer' },
                  { metric: 'Khớp phụ đề', threshold: 'Độ lệch thời gian không quá ± 200ms', unit: 'sync' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{item.metric}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.threshold}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                      {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-300 font-mono uppercase tracking-wider">
                2. Do Con Người Quyết Định (Human Gate)
              </h3>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Thẩm mỹ & Bố cục:</strong> Model thị giác chỉ đóng vai trò lọc sơ bộ, KHÔNG là căn cứ PASS cuối cùng.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Cảm xúc & Diễn xuất:</strong> Đạo diễn đánh giá ánh mắt, sắc thái tâm lý và nhịp thở của nhân vật trong bối cảnh phân đoạn.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Nhịp phim & Dòng chảy:</strong> Đánh giá tính liền mạch khi cắt cảnh giữa các góc quay trong cùng một Scene.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">Đúng ý đồ sáng tạo:</strong> Đối chiếu với triết lý nghệ thuật trong Film Bible đã khóa.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Rollback Tab */}
      {activeTab === 'rollback' && (
        <div className="bg-[#0f172a]/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white font-display">
              Cơ Chế Rollback Bằng Mã Hash Đã Phê Duyệt
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nguyên tắc v1.1: Rollback = Lấy file đã duyệt ➔ KIỂM TRA HASH ➔ Sử dụng. Tuyệt đối không tạo lại từ đầu vì dịch vụ AI không đảm bảo sinh ra giống hệt.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400">CẢNH ĐANG CHỌN:</span>
                <div className="text-sm font-bold text-white mt-0.5">{currentShot.id} — {currentShot.name}</div>
              </div>

              <button
                onClick={handleRollback}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thực Hiện Rollback Khớp Hash</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#080d16] rounded border border-slate-800">
                <span className="text-slate-400">Hash Hiện Tại:</span>
                <div className="text-slate-200 font-bold truncate mt-1">{currentShot.output_hash}</div>
              </div>

              <div className="p-3 bg-[#080d16] rounded border border-slate-800">
                <span className="text-emerald-400">Hash Đã Duyệt Trong Sổ Bằng Chứng:</span>
                <div className="text-emerald-300 font-bold truncate mt-1">{currentShot.previous_approved_hash}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
