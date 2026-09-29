/**
 * Software Factory & Film Factory Guards Engine
 * Implements Deadlock Detector, Stalled Recovery, Circuit Breaker, and Budget Guard
 */

import { TaskNode, GuardStatus } from './types';

export class DeadlockDetector {
  /**
   * Detects dependency cycles in the Task Graph DAG using Tarjan / DFS
   */
  static detectCycles(tasks: TaskNode[]): { hasCycle: boolean; cycles: string[][] } {
    const adj = new Map<string, string[]>();
    for (const t of tasks) {
      adj.set(t.id, [...t.dependencies]);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];
    const currentPath: string[] = [];

    function dfs(node: string) {
      visited.add(node);
      recStack.add(node);
      currentPath.push(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        } else if (recStack.has(neighbor)) {
          // Found cycle
          const cycleStartIndex = currentPath.indexOf(neighbor);
          if (cycleStartIndex !== -1) {
            const detectedCycle = currentPath.slice(cycleStartIndex);
            detectedCycle.push(neighbor);
            cycles.push(detectedCycle);
          }
        }
      }

      recStack.delete(node);
      currentPath.pop();
    }

    for (const t of tasks) {
      if (!visited.has(t.id)) {
        dfs(t.id);
      }
    }

    return {
      hasCycle: cycles.length > 0,
      cycles
    };
  }
}

export class StalledRecoveryEngine {
  /**
   * Identifies tasks exceeding timeout limits or stuck in progress
   */
  static scanStalled(tasks: TaskNode[], maxRetries = 3): {
    stalledTasks: TaskNode[];
    reassignedTasks: TaskNode[];
    needsHumanTasks: TaskNode[];
  } {
    const stalledTasks: TaskNode[] = [];
    const reassignedTasks: TaskNode[] = [];
    const needsHumanTasks: TaskNode[] = [];

    for (const task of tasks) {
      if (task.status === 'IN_PROGRESS') {
        const retries = task.retry_count || 0;
        stalledTasks.push(task);
        if (retries >= maxRetries) {
          needsHumanTasks.push({
            ...task,
            status: 'NEEDS_HUMAN'
          });
        } else {
          reassignedTasks.push({
            ...task,
            retry_count: retries + 1,
            status: 'PENDING'
          });
        }
      }
    }

    return { stalledTasks, reassignedTasks, needsHumanTasks };
  }
}

export class CircuitBreaker {
  private static failures: Record<string, number> = {};
  private static lastFailureTime: Record<string, number> = {};
  private static threshold = 3;
  private static cooldownMs = 60000;

  static recordFailure(provider: string): { isOpen: boolean; failures: number } {
    this.failures[provider] = (this.failures[provider] || 0) + 1;
    this.lastFailureTime[provider] = Date.now();
    const isOpen = this.failures[provider] >= this.threshold;
    return { isOpen, failures: this.failures[provider] };
  }

  static recordSuccess(provider: string) {
    this.failures[provider] = 0;
  }

  static getStatus(provider: string): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    const count = this.failures[provider] || 0;
    if (count < this.threshold) return 'CLOSED';
    const elapsed = Date.now() - (this.lastFailureTime[provider] || 0);
    if (elapsed > this.cooldownMs) return 'HALF_OPEN';
    return 'OPEN';
  }

  static getAllStatuses(): Record<string, 'CLOSED' | 'OPEN' | 'HALF_OPEN'> {
    const providers = ['gemini_api', 'veo_video', 'cloud_sandbox', 'evidence_store'];
    const res: Record<string, 'CLOSED' | 'OPEN' | 'HALF_OPEN'> = {};
    for (const p of providers) {
      res[p] = this.getStatus(p);
    }
    return res;
  }
}

export class BudgetGuard {
  static evaluate(spent: number, total: number): {
    healthy: boolean;
    percentage: number;
    level: 'NORMAL' | 'WARNING_70' | 'SOFT_STOP_90' | 'HARD_STOP_100';
    allowNewTasks: boolean;
    message: string;
  } {
    const percentage = total > 0 ? (spent / total) * 100 : 0;

    if (percentage >= 100) {
      return {
        healthy: false,
        percentage,
        level: 'HARD_STOP_100',
        allowNewTasks: false,
        message: 'DỪNG CỨNG (100%): Vượt hạn mức ngân sách! Toàn bộ pipeline bị tạm khóa ngay lập tức.'
      };
    }
    if (percentage >= 90) {
      return {
        healthy: false,
        percentage,
        level: 'SOFT_STOP_90',
        allowNewTasks: false,
        message: 'DỪNG MỀM (90%): Ngân sách chạm ngưỡng 90%. Không cho phép nhận hoặc điều phối thêm task mới.'
      };
    }
    if (percentage >= 70) {
      return {
        healthy: true,
        percentage,
        level: 'WARNING_70',
        allowNewTasks: true,
        message: 'CẢNH BÁO (70%): Chi phí đã sử dụng vượt 70% hạn mức dự trù. Cần tối ưu chi phí token.'
      };
    }

    return {
      healthy: true,
      percentage,
      level: 'NORMAL',
      allowNewTasks: true,
      message: 'Ngân sách trong ngưỡng an toàn danh định.'
    };
  }
}
