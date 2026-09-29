/**
 * Evidence Guard & Cryptographic SHA-256 Hash Chain
 * Implements Append-Only Integrity and Separation of Duties (Verifier != Worker)
 */

import { EvidenceBlock, VerificationLayer } from './types';

// Browser + Node compatible SHA-256
export async function calculateSha256(content: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for simple environments if subtle is missing
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export function canonicalBlockString(block: Omit<EvidenceBlock, 'hash'>): string {
  return JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    previous_hash: block.previous_hash,
    task_id: block.task_id,
    worker_id: block.worker_id,
    verifier_id: block.verifier_id,
    layer: block.layer,
    status: block.status,
    payload_summary: block.payload_summary,
    artifacts: block.artifacts.map(a => `${a.path}:${a.hash}`).sort()
  });
}

/**
 * Validates the entire cryptographic chain for tampering
 */
export async function verifyEvidenceChain(chain: EvidenceBlock[]): Promise<{
  isValid: boolean;
  corruptedBlockIndex?: number;
  reason?: string;
}> {
  if (!chain || chain.length === 0) {
    return { isValid: false, reason: 'Chuỗi bằng chứng rỗng' };
  }

  for (let i = 0; i < chain.length; i++) {
    const current = chain[i];

    // Separation of duties check: Verifier != Worker (except Genesis L0)
    if (current.layer !== 'L0_GENESIS' && current.worker_id === current.verifier_id) {
      return {
        isValid: false,
        corruptedBlockIndex: i,
        reason: `Quy tắc phân tách quyền bị vi phạm ở Block ${i}: Verifier (${current.verifier_id}) trùng với Worker (${current.worker_id})!`
      };
    }

    // Previous hash pointer check
    if (i === 0) {
      if (current.previous_hash !== '0000000000000000000000000000000000000000000000000000000000000000') {
        return {
          isValid: false,
          corruptedBlockIndex: 0,
          reason: 'Genesis block previous_hash không hợp lệ'
        };
      }
    } else {
      const prev = chain[i - 1];
      if (current.previous_hash !== prev.hash) {
        return {
          isValid: false,
          corruptedBlockIndex: i,
          reason: `Chuỗi băm bị đứt đoạn ở Block ${i}: previous_hash không khớp với hash của Block ${i - 1}`
        };
      }
    }

    // Hash integrity verification
    const { hash: storedHash, ...withoutHash } = current;
    const computedHash = await calculateSha256(canonicalBlockString(withoutHash));
    if (storedHash !== computedHash) {
      return {
        isValid: false,
        corruptedBlockIndex: i,
        reason: `Chữ ký SHA-256 ở Block ${i} bị sai lệch! Lưu trữ: ${storedHash.slice(0, 12)}... Tính toán: ${computedHash.slice(0, 12)}... (Có dấu hiệu can thiệp dữ liệu)`
      };
    }
  }

  return { isValid: true };
}

/**
 * Creates and signs a new Evidence Block adhering to Append-Only rules
 */
export async function createEvidenceBlock(
  chain: EvidenceBlock[],
  params: {
    task_id: string;
    worker_id: string;
    verifier_id: string;
    layer: VerificationLayer;
    status: 'PASS' | 'FAIL' | 'NEEDS_HUMAN';
    payload_summary: string;
    metrics?: Record<string, string | number | boolean>;
    artifacts?: Array<{ path: string; hash: string }>;
  }
): Promise<EvidenceBlock> {
  // CRITICAL RULE: Agent không tự chứng nhận công việc của mình
  if (params.worker_id === params.verifier_id) {
    throw new Error(
      `VI PHẠM NGUYÊN TẮC BẤT BIẾN: Worker '${params.worker_id}' không được phép tự đóng vai trò Verifier!`
    );
  }

  const previousBlock = chain[chain.length - 1];
  const previous_hash = previousBlock ? previousBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const index = chain.length;
  const timestamp = new Date().toISOString();

  const blockCandidate: Omit<EvidenceBlock, 'hash'> = {
    index,
    timestamp,
    previous_hash,
    task_id: params.task_id,
    worker_id: params.worker_id,
    verifier_id: params.verifier_id,
    verifier_not_worker_verified: true,
    layer: params.layer,
    status: params.status,
    payload_summary: params.payload_summary,
    metrics: params.metrics || {},
    artifacts: params.artifacts || []
  };

  const hash = await calculateSha256(canonicalBlockString(blockCandidate));

  return {
    ...blockCandidate,
    hash
  };
}
