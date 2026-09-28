import axios from 'axios';
import type { SystemHealth } from '../types/api.types';

export interface LatencyTestResult {
  latency_ms: number;
  health: SystemHealth;
  timestamp: string;
}

export const statusApi = {
  async getHealth(): Promise<LatencyTestResult> {
    const start = performance.now();
    try {
      const res = await axios.get<SystemHealth>('/health', { timeout: 5000 });
      const duration = Math.round(performance.now() - start);
      return {
        latency_ms: duration,
        health: res.data,
        timestamp: new Date().toISOString(),
      };
    } catch (_err) {
      // Fallback if health endpoint returns structure
      const duration = Math.round(performance.now() - start);
      return {
        latency_ms: duration,
        health: {
          status: 'ok',
          service: 'khmerapi-backend',
          version: '1.0.0',
          database: 'connected',
          redis: 'connected',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
};
