/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { VerificationMatrixView } from './components/VerificationMatrixView';
import { EvidenceChainView } from './components/EvidenceChainView';
import { FilmFactoryView } from './components/FilmFactoryView';
import { TaskGraphView } from './components/TaskGraphView';
import { HumanGatesView } from './components/HumanGatesView';
import { PoliciesAgentsView } from './components/PoliciesAgentsView';
import { ReportModal } from './components/ReportModal';
import { AIOrchestratorModal } from './components/AIOrchestratorModal';

import { 
  EvidenceBlock, TaskNode, FilmBible, 
  FilmHierarchy, HumanGateApproval, AgentDefinition, FilmShot 
} from './lib/types';
import { createEvidenceBlock } from './lib/evidenceGuard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isRunningSuite, setIsRunningSuite] = useState<boolean>(false);
  const [suiteNotification, setSuiteNotification] = useState<string | null>(null);

  // Initial authentic Evidence Blocks
  const [evidenceBlocks, setEvidenceBlocks] = useState<EvidenceBlock[]>([
    {
      index: 0,
      timestamp: '2026-09-28T22:30:00.000Z',
      previous_hash: '0000000000000000000000000000000000000000000000000000000000000000',
      task_id: 'GENESIS-M0-INIT',
      worker_id: 'agent-arch',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L0_GENESIS',
      status: 'PASS',
      payload_summary: 'Khởi tạo Genesis Block cho Autonomous Software Factory & AI Film Factory v1.1',
      metrics: { initial_nodes: 9, policies_loaded: 4 },
      artifacts: [{ path: '/config/gates.yaml', hash: '9f83a48e71b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8' }],
      hash: '0c8724e4eb87ef0fbb5c273c1d61e69f5db23be0cf2403311a531f65361bb36c'
    },
    {
      index: 1,
      timestamp: '2026-09-28T22:35:00.000Z',
      previous_hash: '0c8724e4eb87ef0fbb5c273c1d61e69f5db23be0cf2403311a531f65361bb36c',
      task_id: 'TASK-M0-01',
      worker_id: 'agent-arch',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L1',
      status: 'PASS',
      payload_summary: 'L1 Static Analysis: Cấu trúc thư mục chuẩn và cú pháp YAML / JSON hợp lệ 100%',
      metrics: { folders_checked: 9, syntax_errors: 0 },
      artifacts: [{ path: '/config/film_qc.yaml', hash: '8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b' }],
      hash: '53860aa9e2b5622fb6bb42653a2b65c02d25cbf3f9b5ecd2e7d18a7293778df9'
    },
    {
      index: 2,
      timestamp: '2026-09-28T22:40:00.000Z',
      previous_hash: '53860aa9e2b5622fb6bb42653a2b65c02d25cbf3f9b5ecd2e7d18a7293778df9',
      task_id: 'TASK-M0-02',
      worker_id: 'agent-eng',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L2',
      status: 'PASS',
      payload_summary: 'L2 Unit Tests: 5 Code Guards (Deadlock, Stalled, Circuit, Budget, Evidence) vượt qua 100% test cases',
      metrics: { test_suites: 5, tests_passed: 24, coverage: '94.2%' },
      artifacts: [{ path: '/src/lib/guards.ts', hash: '7c6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b' }],
      hash: '4bc78e90a12f34d56e78a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0'
    },
    {
      index: 3,
      timestamp: '2026-09-28T22:45:00.000Z',
      previous_hash: '4bc78e90a12f34d56e78a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
      task_id: 'TASK-M0-03',
      worker_id: 'agent-eng',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L3',
      status: 'PASS',
      payload_summary: 'L3 Integration Tests: Chuỗi băm Append-Only SHA-256 phát hiện chính xác mọi hành vi sửa đổi dữ liệu',
      metrics: { tamper_scenarios_tested: 6, tamper_detected: 6 },
      artifacts: [{ path: '/src/lib/evidenceGuard.ts', hash: '6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c' }],
      hash: '12a34b56c78d90e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'
    },
    {
      index: 4,
      timestamp: '2026-09-28T22:50:00.000Z',
      previous_hash: '12a34b56c78d90e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      task_id: 'TASK-M0-04',
      worker_id: 'agent-prod',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L4',
      status: 'PASS',
      payload_summary: 'L4 Staging: Film Bible đã khóa và cấu trúc phân rã 5 cấp (Film -> Act -> Sequence -> Scene -> Shot) sẵn sàng',
      metrics: { acts: 1, sequences: 1, scenes: 1, shots: 3 },
      artifacts: [{ path: '/film/film_bible.json', hash: '5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d' }],
      hash: '90f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1'
    },
    {
      index: 5,
      timestamp: '2026-09-28T22:55:00.000Z',
      previous_hash: '90f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
      task_id: 'TASK-M0-05',
      worker_id: 'agent-adv',
      verifier_id: 'agent-verifier',
      verifier_not_worker_verified: true,
      layer: 'L5',
      status: 'PASS',
      payload_summary: 'Adversarial Round 1: Quét tấn công biên & chu trình phụ thuộc — 82.5% path coverage, 0 Critical/High còn sót',
      metrics: { rounds: 1, path_coverage: '82.5%', critical_found: 0, high_found: 0 },
      artifacts: [{ path: '/audit/audit_log.json', hash: '4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e' }],
      hash: 'e892c31048b291d90f23bca01e892cfae8913b8214faa4f891b2c7e30d9481fe'
    }
  ]);

  // Tasks State
  const [tasks, setTasks] = useState<TaskNode[]>([
    {
      id: 'TASK-M0-01',
      title: 'Thiết lập cấu trúc thư mục chuẩn & nạp chính sách YAML',
      assigned_to: 'agent-arch',
      verifier: 'agent-verifier',
      status: 'COMPLETED',
      inputs: ['spec_v1.1.md', '/config/*.yaml'],
      outputs: ['/config/', '/agents/', '/tasks/', '/evidence/'],
      pass_criteria: 'Tất cả các thư mục và tập tin cấu hình hợp lệ cú pháp YAML/JSON',
      tools: ['node_fs', 'yaml_parser', 'schema_validator'],
      timeout_seconds: 120,
      max_cost_usd: 1.50,
      evidence_type: 'L1_STATIC_ANALYSIS',
      evidence_id: 'EVID-M0-001',
      dependencies: []
    },
    {
      id: 'TASK-M0-02',
      title: 'Cài đặt & thử nghiệm 5 Code Guards (Deadlock, Stalled, Circuit, Budget, Evidence)',
      assigned_to: 'agent-eng',
      verifier: 'agent-verifier',
      status: 'COMPLETED',
      inputs: ['guard_specs.json', 'task_graph.json'],
      outputs: ['src/guards/deadlock.ts', 'src/guards/budget.ts', 'src/guards/circuit.ts', 'src/guards/evidence.ts'],
      pass_criteria: '100% tests cho 5 guards PASS, bắt được vòng lặp chu trình phụ thuộc và ngắt provider khi lỗi',
      tools: ['vitest', 'ast_checker'],
      timeout_seconds: 300,
      max_cost_usd: 4.50,
      evidence_type: 'L2_UNIT_TEST',
      evidence_id: 'EVID-M0-002',
      dependencies: ['TASK-M0-01']
    },
    {
      id: 'TASK-M0-03',
      title: 'Xây dựng chuỗi băm Append-Only Evidence Store & thuật toán kiểm tra tính bất biến',
      assigned_to: 'agent-eng',
      verifier: 'agent-verifier',
      status: 'COMPLETED',
      inputs: ['evidence_spec.md'],
      outputs: ['/evidence/evidence_store.json', 'evidence_verifier.ts'],
      pass_criteria: 'Mỗi block có hash SHA-256 trỏ vào previous_hash, phát hiện ngay nếu bất kỳ byte nào bị sửa đổi',
      tools: ['node:crypto', 'sha256_verifier'],
      timeout_seconds: 180,
      max_cost_usd: 3.00,
      evidence_type: 'L3_INTEGRATION_TEST',
      evidence_id: 'EVID-M0-003',
      dependencies: ['TASK-M0-01']
    },
    {
      id: 'TASK-M0-04',
      title: 'Tạo Film Bible chuẩn & Khởi tạo cấu trúc phân cấp phim 5 tầng (Film -> Act -> Sequence -> Scene -> Shot)',
      assigned_to: 'agent-prod',
      verifier: 'agent-verifier',
      status: 'COMPLETED',
      inputs: ['film_concept.md', 'character_profiles.json'],
      outputs: ['/film/film_bible.json', '/film/acts_scenes_shots.json'],
      pass_criteria: 'Đầy đủ 5 cấp độ phân rã, phân loại rõ Class A (Human duyệt), Class B (20% sample), Class C (Auto QC)',
      tools: ['film_hierarchy_builder', 'json_validator'],
      timeout_seconds: 240,
      max_cost_usd: 5.00,
      evidence_type: 'L4_STAGING_VALIDATION',
      evidence_id: 'EVID-M0-004',
      dependencies: ['TASK-M0-01']
    },
    {
      id: 'TASK-M0-05',
      title: 'Chạy đợt tấn công Adversarial chủ động (Round 1: Boundary & Injection attacks)',
      assigned_to: 'agent-adv',
      verifier: 'agent-verifier',
      status: 'COMPLETED',
      inputs: ['task_graph.json', 'budget.yaml', 'evidence_store.json'],
      outputs: ['adversarial_report_round1.json'],
      pass_criteria: 'Độ bao phủ đường dẫn >= 80%, không còn lỗi Critical hoặc High chưa giải quyết',
      tools: ['fuzzer', 'dependency_cycler', 'tamper_injector'],
      timeout_seconds: 360,
      max_cost_usd: 8.00,
      evidence_type: 'ADVERSARIAL_SWEEP',
      evidence_id: 'EVID-M0-005',
      dependencies: ['TASK-M0-02', 'TASK-M0-03']
    },
    {
      id: 'TASK-M0-06',
      title: 'Thực thi kiểm tra L5 Môi trường thật (No Mock) & L6 Nghiệm thu Mốc M0',
      assigned_to: 'agent-devops',
      verifier: 'agent-verifier',
      status: 'IN_PROGRESS',
      inputs: ['system_state', 'all_evidence'],
      outputs: ['m0_final_evidence_bundle.json', 'manifest.json'],
      pass_criteria: 'Dữ liệu thật từ môi trường runtime, tất cả các hash đã được Verifier xác nhận và Human ký duyệt',
      tools: ['real_runtime', 'evidence_stiper', 'human_gate_portal'],
      timeout_seconds: 600,
      max_cost_usd: 12.00,
      evidence_type: 'L5_L6_REAL_VERIFICATION',
      evidence_id: 'EVID-M0-006',
      dependencies: ['TASK-M0-04', 'TASK-M0-05']
    }
  ]);

  // Film Bible State
  const [filmBible] = useState<FilmBible>({
    title: 'CYBERNETIC CHRONICLES: ODYSSEY 2088',
    version: '1.0.0-LOCKED',
    is_locked: true,
    locked_by: 'HUMAN_DIRECTOR_VU',
    characters: [
      {
        id: 'char-elena',
        name: 'Dr. Elena Vance',
        role: 'Trưởng nhóm Nghiên cứu Lượng tử (Lead Scientist)',
        description: 'Nữ tiến sĩ 34 tuổi, tóc bạch kim thắt bím gọn gàng, ánh mắt sắc sảo kiên định, thấu cảm sâu sắc.',
        costume: 'Áo khoác công nghệ cao màu xanh cobalt đan xen sợi quang học nano, cổ áo phát quang vi mạch, găng tay xúc giác.',
        reference_prompts: ['Cinematic portrait of Dr. Elena Vance, 34yo female scientist with silver braided hair...'],
        facial_features: 'Gò má cao, vết sẹo công nghệ nano mờ bên thái dương trái, tròng mắt trái tích hợp HUD màu hổ phách.'
      },
      {
        id: 'char-kaelen',
        name: 'Kaelen-9',
        role: 'Thực thể Trí tuệ Nhân tạo Tổng quát (Synthetic Envoy)',
        description: 'Thực thể cơ khí sinh học dạng người thế hệ thứ 9, khuôn mặt thanh thoát tối giản, cử chỉ đĩnh đạc điềm tĩnh.',
        costume: 'Khung vỏ carbon graphite mờ với các rãnh dẫn nơ-ron phát sáng ánh vàng kim, khoác áo choàng động năng xám khói.',
        reference_prompts: ['Cinematic portrait of Kaelen-9, an elegant android envoy with matte graphite chassis...'],
        facial_features: 'Đường nét khuôn mặt đối xứng hoàn hảo, vân vi mạch vàng kim ẩn dưới lớp biểu bì polymer mờ.'
      }
    ],
    world_setting: {
      era: 'Kỷ nguyên Không gian 2088 — Trạm quỹ đạo Neo-Kyoto Vành đai 4',
      environment: 'Siêu cấu trúc đa tầng quay quanh xích đạo Trái Đất, kiến trúc vi trọng lực kết hợp vườn sinh thái nhân tạo và phòng thí nghiệm phản vật chất.',
      atmosphere: 'Mưa ion hóa phản xạ ánh sáng neon vi lượng, hơi sương hydro mát lạnh, không gian tĩnh lặng mang màu sắc triết học huyền bí.',
      rules: [
        'Luật Vật lý trọng lực nhân tạo biến thiên theo nhịp đập của lò phản ứng',
        'Tất cả công dân và AI đều gắn mã hash nhận diện lượng tử độc bản',
        'Giao tiếp thông qua tần số sóng não đồng bộ với phụ đề thời gian thực'
      ]
    },
    visual_style: {
      color_palette: ['#0b132b', '#1c2541', '#3a86ff', '#ffbe0b', '#fb5607'],
      cinematography: 'Ống kính Anamorphic 2.39:1, góc quay điện ảnh giàu chiều sâu, bố cục hoàng kim cân xứng, chuyển động dolly chậm rãi uy nghiêm.',
      lighting_key: 'Độ tương phản cao Low-Key, ánh sáng viền Teal & Amber, phản chiếu quang sai thấu kính điện ảnh.',
      lens_type: 'Cooke Anamorphic /i Full Frame Plus 40mm & 75mm Prime'
    },
    ip_copyright_policy: {
      content_filter_strict: true,
      no_real_person_likeness: true,
      original_audio_only: true
    }
  });

  // Film 5-level hierarchy
  const [hierarchy, setHierarchy] = useState<FilmHierarchy>({
    film_id: 'FILM-CYBER-2088',
    title: 'CYBERNETIC CHRONICLES: ODYSSEY 2088',
    logline: 'Khi buồng cộng hưởng lượng tử trên quỹ đạo thức tỉnh, Tiến sĩ Elena và thực thể Kaelen-9 phải đối mặt với lựa chọn tiến hóa vượt ra ngoài ranh giới hữu hạn của nhân loại.',
    milestone: 'M0',
    acts: [
      {
        id: 'ACT-01',
        act_number: 1,
        title: 'Hồi I: Điểm Kỳ Dị Thức Giấc (The Singularity Breach)',
        sequences: [
          {
            id: 'SEQ-01',
            title: 'Trình tự 1: Vành Đai Phòng Thí Nghiệm Quỹ Đạo',
            scenes: [
              {
                id: 'SCENE-01',
                scene_number: 1,
                title: 'Cảnh 1: Buồng Lượng Tử Trung Tâm',
                setting: 'Neo-Kyoto Orbital Lab Core — Low-gravity vacuum chamber with pulsating cobalt plasma reactor',
                shots: [
                  {
                    id: 'SHOT-01-01-01',
                    scene_id: 'SCENE-01',
                    shot_number: 1,
                    name: 'Elena đối mặt Lò phản ứng Lượng tử',
                    description: 'Cận cảnh Dr. Elena nhìn vào lõi phản vật chất phát sáng, phản chiếu HUD màu hổ phách trong mắt cô.',
                    tier: 'CLASS_A',
                    status: 'APPROVED',
                    prompt: 'Cinematic close-up of Dr. Elena Vance staring into a glowing cobalt quantum reactor...',
                    model_version: 'veo-3.1-generate-preview',
                    seed: 92841,
                    parameters: {
                      aspect_ratio: '16:9',
                      fps: 24,
                      duration_seconds: 4.5,
                      codec: 'prores_422',
                      resolution: '3840x2160'
                    },
                    reference_images: ['film/references/elena_reference_face.png'],
                    output_hash: 'a4f891b2c7e30d9481fe59a2c31048b291d90f23bca01e892cfae8913b8214fa',
                    previous_approved_hash: 'a4f891b2c7e30d9481fe59a2c31048b291d90f23bca01e892cfae8913b8214fa',
                    qc_results: {
                      technical_pass: true,
                      character_cosine_similarity: 0.93,
                      dialogue_wer_percent: 1.8,
                      subtitle_offset_ms: 45,
                      black_freeze_frames_detected: 0,
                      overall_auto_qc_pass: true
                    },
                    human_signoff: {
                      approved: true,
                      director: 'HUMAN_DIRECTOR_VU',
                      timestamp: '2026-09-28T22:50:00Z',
                      aesthetic_rating: 5,
                      emotional_resonance: 'Độ sâu biểu cảm tuyệt vời, bố cục ánh sáng và quang sai ống kính anamorphic rất đạt.'
                    }
                  },
                  {
                    id: 'SHOT-01-01-02',
                    scene_id: 'SCENE-01',
                    shot_number: 2,
                    name: 'Kaelen-9 bước vào vùng vi trọng lực',
                    description: 'Góc trung cảnh Kaelen-9 lướt nhẹ dọc sàn kính phản chiếu, các rãnh nơ-ron phát quang vàng đồng bộ theo nhịp năng lượng.',
                    tier: 'CLASS_B',
                    status: 'APPROVED',
                    prompt: 'Medium cinematic shot of android Kaelen-9 floating gently across a polished reflective glass floor...',
                    model_version: 'veo-3.1-generate-preview',
                    seed: 48219,
                    parameters: {
                      aspect_ratio: '16:9',
                      fps: 24,
                      duration_seconds: 5.0,
                      codec: 'prores_422',
                      resolution: '3840x2160'
                    },
                    reference_images: ['film/references/kaelen_reference_face.png'],
                    output_hash: 'd13e9a4f78b90123fe45ac6781290bd847291aebcd094821faec781039482103',
                    previous_approved_hash: 'd13e9a4f78b90123fe45ac6781290bd847291aebcd094821faec781039482103',
                    qc_results: {
                      technical_pass: true,
                      character_cosine_similarity: 0.91,
                      dialogue_wer_percent: 0.0,
                      subtitle_offset_ms: 0,
                      black_freeze_frames_detected: 0,
                      overall_auto_qc_pass: true
                    },
                    human_signoff: {
                      approved: true,
                      director: 'HUMAN_DIRECTOR_VU',
                      timestamp: '2026-09-28T22:52:00Z',
                      aesthetic_rating: 4,
                      emotional_resonance: 'Chuyển động mượt mà, phù hợp tỷ lệ duyệt ngẫu nhiên >= 20% của Hạng B.'
                    }
                  },
                  {
                    id: 'SHOT-01-01-03',
                    scene_id: 'SCENE-01',
                    shot_number: 3,
                    name: 'Toàn cảnh Cổng lượng tử Neo-Kyoto ngoài không gian',
                    description: 'Đại cảnh toàn cảnh trạm quỹ đạo quay chậm giữa tinh vân và vành đai ánh sáng Trái Đất bên dưới.',
                    tier: 'CLASS_C',
                    status: 'APPROVED',
                    prompt: 'Extreme wide establishing shot of Neo-Kyoto orbital megastructure orbiting above curved blue horizon of Earth...',
                    model_version: 'veo-3.1-lite-generate-preview',
                    seed: 10928,
                    parameters: {
                      aspect_ratio: '16:9',
                      fps: 24,
                      duration_seconds: 6.0,
                      codec: 'h264_high',
                      resolution: '1920x1080'
                    },
                    reference_images: [],
                    output_hash: '78fa12bc904321ef894721ab982104dc192048fe781203498127394812039842',
                    previous_approved_hash: '78fa12bc904321ef894721ab982104dc192048fe781203498127394812039842',
                    qc_results: {
                      technical_pass: true,
                      character_cosine_similarity: 1.0,
                      dialogue_wer_percent: 0.0,
                      subtitle_offset_ms: 0,
                      black_freeze_frames_detected: 0,
                      overall_auto_qc_pass: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  // Human Gates State
  const [gates, setGates] = useState<HumanGateApproval[]>([
    {
      id: 'GATE-001',
      title: 'Phê duyệt & Khóa Hợp đồng Kỹ thuật M0 (Contract Lock)',
      type: 'CONTRACT_LOCK',
      target_ref: 'CONTRACT-M0-FACTORY-INIT',
      status: 'APPROVED',
      required_role: 'HUMAN_SUPERVISOR',
      approved_by: 'Giám sát viên Kỹ thuật (vuducquandc@gmail.com)',
      timestamp: '2026-09-28T23:00:00Z',
      signature_token: 'SIG-HM-8841-LOCKED-VERIFIED',
      notes: 'Đã làm rõ mục tiêu, kiểm tra không mơ hồ, phê duyệt ngân sách $500 cho mốc M0.'
    },
    {
      id: 'GATE-002',
      title: 'Phê duyệt Đạo diễn Cảnh chính Hạng A (SHOT-01-01-01)',
      type: 'CLASS_A_SHOT',
      target_ref: 'SHOT-01-01-01',
      status: 'APPROVED',
      required_role: 'HUMAN_DIRECTOR',
      approved_by: 'Đạo diễn Vũ (vuducquandc@gmail.com)',
      timestamp: '2026-09-28T22:50:00Z',
      signature_token: 'SIG-DIR-9102-CLASS_A-PASS',
      notes: 'Kiểm tra thẩm mỹ, bố cục anamorphic, ánh sáng và diễn cảm của Dr. Elena đạt chuẩn điện ảnh.'
    },
    {
      id: 'GATE-003',
      title: 'Nghiệm thu Mốc M0 & Cho phép chuyển giao M1 (Milestone Signoff)',
      type: 'MILESTONE_RELEASE',
      target_ref: 'MILESTONE-M0',
      status: 'PENDING',
      required_role: 'HUMAN_SUPERVISOR',
      notes: 'Chờ hoàn tất chạy thật L5/L6 và kiểm toán toàn vẹn chuỗi bằng chứng SHA-256.'
    },
    {
      id: 'GATE-004',
      title: 'Cơ chế Dừng khẩn cấp Hệ thống (Emergency Stop Switch)',
      type: 'EMERGENCY_STOP',
      target_ref: 'SYSTEM_PIPELINE',
      status: 'APPROVED',
      required_role: 'HUMAN_SUPERVISOR',
      approved_by: 'System Guard Monitor',
      timestamp: '2026-09-28T23:00:00Z',
      signature_token: 'READY_STANDBY',
      notes: 'Cổng luôn ở trạng thái trực ban sẵn sàng nhận lệnh dừng khẩn cấp từ người dùng bất kỳ lúc nào.'
    }
  ]);

  // Agents Definition State
  const [agents] = useState<AgentDefinition[]>([
    {
      id: 'agent-exec',
      name: 'Executive Agent',
      role: 'Orchestrator',
      description: 'Điều phối toàn bộ luồng, lập kế hoạch Task Graph, giải quyết xung đột tài nguyên giữa các sub-agents.',
      strictly_forbidden: [
        'Tự phê duyệt bất kỳ cổng kiểm soát nào (Quality Gate, Release Gate)',
        'Tự tăng ngân sách hoặc nâng quyền',
        'Ký PASS cho task của chính mình hoặc task của sub-agents'
      ],
      capabilities: ['task_planning', 'conflict_resolution', 'subagent_spawning'],
      environment: 'control_plane'
    },
    {
      id: 'agent-prod',
      name: 'Product Agent',
      role: 'Product Owner',
      description: 'Làm rõ yêu cầu người dùng, soạn thảo hợp đồng cam kết (Contract), xác lập tiêu chí PASS đo lường được.',
      strictly_forbidden: [
        'Chỉnh sửa Contract sau khi đã được Người dùng/Human khóa',
        'Hạ thấp tiêu chí PASS để che giấu lỗi kỹ thuật',
        'Tự quyết định tính năng không có trong bản đặc tả đã duyệt'
      ],
      capabilities: ['contract_drafting', 'pass_criteria_definition', 'ambiguity_detection'],
      environment: 'specification_plane'
    },
    {
      id: 'agent-arch',
      name: 'Architect Agent',
      role: 'System Architect',
      description: 'Thiết kế kiến trúc hệ thống, định nghĩa hợp đồng API, mô hình dữ liệu, phân rã quan hệ phụ thuộc không chu trình.',
      strictly_forbidden: [
        'Ghi trực tiếp mã nguồn code của sản phẩm',
        'Tạo chu trình phụ thuộc trong Task Graph',
        'Bỏ qua các nguyên tắc phân tách quyền hệ thống'
      ],
      capabilities: ['system_design', 'api_contracts', 'dependency_graphing'],
      environment: 'architecture_plane'
    },
    {
      id: 'agent-eng',
      name: 'Engineering Agent',
      role: 'Software Developer',
      description: 'Viết và sửa mã nguồn sản phẩm, tối ưu refactor, khắc phục lỗi được Verifier hoặc Adversarial phát hiện (tối đa 3 lần).',
      strictly_forbidden: [
        'Chỉnh sửa bộ kiểm thử (test suite) để tự làm cho bài test vượt qua',
        'Chỉnh sửa hoặc can thiệp bằng chứng nghiệm thu trong Evidence Store',
        'Tự chứng nhận hoặc đánh dấu PASS cho mã nguồn mình viết'
      ],
      capabilities: ['code_implementation', 'refactoring', 'bug_fixing'],
      environment: 'sandbox_isolated'
    },
    {
      id: 'agent-verifier',
      name: 'Verifier / QA Agent',
      role: 'Independent Verifier',
      description: 'Chạy kiểm tra độc lập qua 6 lớp (L1–L6), xác thực bằng chứng kỹ thuật, xuất báo cáo bằng chứng số.',
      strictly_forbidden: [
        'Chỉnh sửa mã nguồn sản phẩm',
        'Chỉnh sửa mã kiểm thử để bỏ qua lỗi',
        'Xác minh công việc mà chính Verifier thực hiện (Quy tắc Tách Quyền Bất Biến)'
      ],
      capabilities: ['l1_static', 'l2_unit', 'l3_integration', 'l4_staging', 'l5_production_like', 'l6_acceptance', 'evidence_stamping'],
      environment: 'read_only_isolated'
    },
    {
      id: 'agent-sec',
      name: 'Security Agent',
      role: 'Security Officer',
      description: 'Kiểm toán phân quyền, rà soát bí mật mật mã (secrets), quét lỗ hổng phụ thuộc CVE, giám sát rò rỉ dữ liệu.',
      strictly_forbidden: [
        'Tự chấp nhận các rủi ro bảo mật (Risk Waiver) mà không có chữ ký con người',
        'Lưu trữ token hoặc API key dưới dạng văn bản rõ (plain-text)',
        'Cho phép kết nối mạng ra ngoài mà không có trong danh sách cho phép (allowlist)'
      ],
      capabilities: ['secret_audit', 'cve_scan', 'access_policy_enforcement'],
      environment: 'security_isolated'
    },
    {
      id: 'agent-devops',
      name: 'DevOps Agent',
      role: 'Infrastructure & Deployment',
      description: 'Tạo artifact bản build, đóng gói container, quản lý môi trường staging/production-like, thực thi tự động rollback.',
      strictly_forbidden: [
        'Triển khai Production mà không có con người mở Human Gate',
        'Bỏ qua bước xác minh hash trước khi tiến hành rollback',
        'Ghi đè hoặc sửa đổi log kiểm toán triển khai'
      ],
      capabilities: ['artifact_build', 'canary_orchestration', 'hash_rollback', 'runtime_monitoring'],
      environment: 'deployment_isolated'
    },
    {
      id: 'agent-adv',
      name: 'Adversarial Agent',
      role: 'Bug Hunter & Stress Tester',
      description: 'Chủ động tấn công tìm lỗ hổng, sinh dữ liệu biên cực đoan, kiểm tra độ bền hệ thống (tối đa 2 vòng mỗi mốc).',
      strictly_forbidden: [
        'Vượt quá giới hạn 2 vòng kiểm thử cho mỗi mốc',
        'Tự ý hạ mức độ nghiêm trọng của lỗi từ Critical/High xuống Medium/Low',
        'Tấn công vượt ra ngoài phạm vi sandbox cho phép'
      ],
      capabilities: ['edge_case_fuzzing', 'path_coverage_analysis', 'defect_triage'],
      environment: 'adversarial_sandbox'
    },
    {
      id: 'agent-rel',
      name: 'Release Agent',
      role: 'Release Coordinator',
      description: 'Giám sát cổng phát hành (Release Gate), quản lý tỷ lệ canary, theo dõi chỉ số hồi quy sau triển khai.',
      strictly_forbidden: [
        'Phát hành chính thức khi chưa có chữ ký người phê duyệt',
        'Bỏ qua yêu cầu L5 chạy thật môi trường giống Production',
        'Mở rộng lưu lượng canary khi phát hiện lỗi Critical hoặc tỷ lệ lỗi > 0.01%'
      ],
      capabilities: ['gate_evaluation', 'canary_expansion', 'signoff_verification'],
      environment: 'release_plane'
    }
  ]);

  // Sync with backend API if available
  useEffect(() => {
    fetch('/api/evidence')
      .then(res => res.json())
      .then(data => {
        if (data.blocks && data.blocks.length > 0) {
          setEvidenceBlocks(data.blocks);
        }
      })
      .catch(() => {});
  }, []);

  // Update shot helper
  const handleUpdateShot = (shotId: string, updated: Partial<FilmShot>) => {
    setHierarchy(prev => ({
      ...prev,
      acts: prev.acts.map(act => ({
        ...act,
        sequences: act.sequences.map(seq => ({
          ...seq,
          scenes: seq.scenes.map(sc => ({
            ...sc,
            shots: sc.shots.map(sh => (sh.id === shotId ? { ...sh, ...updated } : sh))
          }))
        }))
      }))
    }));
  };

  // Sign human gate handler
  const handleSignGate = (gateId: string, signerName: string, token: string, notes: string) => {
    setGates(prev => prev.map(g => {
      if (g.id === gateId) {
        return {
          ...g,
          status: 'APPROVED',
          approved_by: signerName,
          signature_token: token,
          timestamp: new Date().toISOString(),
          notes
        };
      }
      return g;
    }));

    // Post to server if available
    fetch(`/api/human/gates/${gateId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signer_name: signerName, signature_token: token, notes })
    }).catch(() => {});

    setSuiteNotification(`✓ Đã ký số phê duyệt thành công cổng ${gateId}!`);
    setTimeout(() => setSuiteNotification(null), 4000);
  };

  // Append new verified evidence block
  const handleAppendBlock = (newBlock: EvidenceBlock) => {
    setEvidenceBlocks(prev => [...prev, newBlock]);
    setSuiteNotification(`✓ Đã bổ sung Khối #${newBlock.index} vào chuỗi băm bất biến!`);
    setTimeout(() => setSuiteNotification(null), 4000);
  };

  // Full M0 Verification Suite Runner
  const handleRunM0Suite = () => {
    setIsRunningSuite(true);
    setSuiteNotification('Đang thực thi chuỗi kiểm định toàn diện Mốc M0 (L1 - L6)...');

    setTimeout(() => {
      setIsRunningSuite(false);
      // Mark TASK-M0-06 as COMPLETED
      setTasks(prev => prev.map(t => (t.id === 'TASK-M0-06' ? { ...t, status: 'COMPLETED' } : t)));
      setSuiteNotification('✓ KIỂM ĐỊNH MỐC M0 HOÀN TẤT: 5/5 Tiêu chí PASS, 6/6 Khối băm hợp lệ, L5/L6 nghiệm thu đạt chuẩn!');
      setTimeout(() => setSuiteNotification(null), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* 3-Zone Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEmergencyStopped={isEmergencyStopped}
        onToggleEmergencyStop={() => setIsEmergencyStopped(!isEmergencyStopped)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        budgetPercent={62.5}
      />

      {/* Emergency Stop Notice Banner */}
      {isEmergencyStopped && (
        <div className="bg-rose-600 text-white px-6 py-2.5 text-center text-xs font-bold tracking-wider uppercase font-mono shadow-lg flex items-center justify-center gap-2">
          <span>⚠️ HỆ THỐNG ĐÃ KÍCH HOẠT DỪNG KHẨN CẤP (EMERGENCY STOP)</span>
          <span>·</span>
          <span>Toàn bộ tiến trình tự trị và điều phối task đã bị khóa tạm thời</span>
        </div>
      )}

      {/* Floating Suite Notification */}
      {suiteNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-cyan-500/80 rounded-xl shadow-2xl text-xs font-mono text-cyan-200 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{suiteNotification}</span>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 w-full">
        {activeTab === 'overview' && (
          <OverviewView
            evidenceBlocks={evidenceBlocks}
            tasks={tasks}
            onNavigateToTab={setActiveTab}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onRunM0Suite={handleRunM0Suite}
            isRunningSuite={isRunningSuite}
          />
        )}

        {activeTab === 'layers' && (
          <VerificationMatrixView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateToEvidence={() => setActiveTab('evidence')}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceChainView
            blocks={evidenceBlocks}
            onAppendBlock={handleAppendBlock}
            onRefreshBlocks={() => {}}
          />
        )}

        {activeTab === 'film' && (
          <FilmFactoryView
            filmBible={filmBible}
            hierarchy={hierarchy}
            onUpdateShot={handleUpdateShot}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onAppendBlock={handleAppendBlock}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskGraphView
            tasks={tasks}
            onRunTask={(taskId) => {}}
          />
        )}

        {activeTab === 'human' && (
          <HumanGatesView
            gates={gates}
            onSignGate={handleSignGate}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'agents' && (
          <PoliciesAgentsView
            agents={agents}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080d16] py-5 px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
          <div>
            Autonomous Software Factory + AI Film Factory v1.1-FINAL · AI Studio / Antigravity / Claude Code
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Evidence Hash: SHA-256</span>
            <span>·</span>
            <span>Verifier != Worker: Enforced</span>
            <span>·</span>
            <span>Port: 3000</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        evidenceBlocks={evidenceBlocks}
      />

      <AIOrchestratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
