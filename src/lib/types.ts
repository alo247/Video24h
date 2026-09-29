/**
 * Core Type Definitions for Autonomous Software Factory & AI Film Factory v1.1-FINAL
 */

export type VerificationLayer = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  strictly_forbidden: string[];
  capabilities: string[];
  max_subagents?: number;
  max_fix_retries?: number;
  max_rounds_per_milestone?: number;
  min_path_coverage_percent?: number;
  environment: string;
}

export interface TaskNode {
  id: string;
  title: string;
  assigned_to: string; // Worker agent ID
  verifier: string;    // MUST NOT equal assigned_to
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'NEEDS_HUMAN';
  inputs: string[];
  outputs: string[];
  pass_criteria: string;
  tools: string[];
  timeout_seconds: number;
  max_cost_usd: number;
  actual_cost_usd?: number;
  evidence_type: string;
  evidence_id?: string;
  dependencies: string[];
  retry_count?: number;
}

export interface EvidenceBlock {
  index: number;
  timestamp: string;
  previous_hash: string;
  task_id: string;
  worker_id: string;
  verifier_id: string;
  verifier_not_worker_verified: boolean;
  layer: VerificationLayer | 'L0_GENESIS';
  status: 'PASS' | 'FAIL' | 'NEEDS_HUMAN';
  payload_summary: string;
  metrics?: Record<string, string | number | boolean>;
  artifacts: Array<{ path: string; hash: string }>;
  hash: string;
}

export interface HumanGateApproval {
  id: string;
  title: string;
  type: 'CONTRACT_LOCK' | 'CLASS_A_SHOT' | 'MILESTONE_RELEASE' | 'BUDGET_OVERRIDE' | 'EMERGENCY_STOP';
  target_ref: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: string;
  timestamp?: string;
  notes?: string;
  signature_token?: string;
  required_role: 'HUMAN_SUPERVISOR' | 'HUMAN_DIRECTOR' | 'HUMAN_PRODUCER' | 'HUMAN_AUDITOR';
}

export interface FilmShot {
  id: string;
  scene_id: string;
  shot_number: number;
  name: string;
  description: string;
  tier: 'CLASS_A' | 'CLASS_B' | 'CLASS_C';
  status: 'DRAFT' | 'GENERATING' | 'QC_CHECKING' | 'APPROVED' | 'REJECTED' | 'ROLLED_BACK';
  prompt: string;
  model_version: string;
  seed: number;
  parameters: {
    aspect_ratio: string;
    fps: number;
    duration_seconds: number;
    codec: string;
    resolution: string;
  };
  reference_images: string[];
  output_asset_url?: string;
  output_hash?: string;
  previous_approved_hash?: string;
  qc_results?: {
    technical_pass: boolean;
    character_cosine_similarity: number;
    dialogue_wer_percent: number;
    subtitle_offset_ms: number;
    black_freeze_frames_detected: number;
    overall_auto_qc_pass: boolean;
  };
  human_signoff?: {
    approved: boolean;
    director: string;
    timestamp: string;
    aesthetic_rating?: number;
    emotional_resonance?: string;
    notes?: string;
  };
}

export interface FilmHierarchy {
  film_id: string;
  title: string;
  logline: string;
  milestone: 'M0' | 'M1' | 'M2' | 'M3';
  acts: Array<{
    id: string;
    act_number: number;
    title: string;
    sequences: Array<{
      id: string;
      title: string;
      scenes: Array<{
        id: string;
        scene_number: number;
        title: string;
        setting: string;
        shots: FilmShot[];
      }>;
    }>;
  }>;
}

export interface FilmBible {
  title: string;
  version: string;
  is_locked: boolean;
  locked_by?: string;
  characters: Array<{
    id: string;
    name: string;
    role: string;
    description: string;
    costume: string;
    reference_prompts: string[];
    facial_features: string;
  }>;
  world_setting: {
    era: string;
    environment: string;
    atmosphere: string;
    rules: string[];
  };
  visual_style: {
    color_palette: string[];
    cinematography: string;
    lighting_key: string;
    lens_type: string;
  };
  ip_copyright_policy: {
    content_filter_strict: boolean;
    no_real_person_likeness: boolean;
    original_audio_only: boolean;
  };
}

export interface GuardStatus {
  deadlock: {
    healthy: boolean;
    cycles_detected: string[][];
    message: string;
  };
  stalled_recovery: {
    healthy: boolean;
    stalled_tasks_count: number;
    recovered_count: number;
    message: string;
  };
  circuit_breaker: {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failure_counts: Record<string, number>;
    fallback_active: boolean;
    message: string;
  };
  budget: {
    healthy: boolean;
    total_budget: number;
    spent: number;
    spent_percentage: number;
    level: 'NORMAL' | 'WARNING_70' | 'SOFT_STOP_90' | 'HARD_STOP_100';
    message: string;
  };
  evidence_integrity: {
    healthy: boolean;
    chain_length: number;
    tamper_detected: boolean;
    last_block_hash: string;
    message: string;
  };
}
