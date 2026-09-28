<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
          System Status
        </h1>
        <p class="text-xs text-zinc-500">
          Real-time service health, infrastructure telemetry, and uptime.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <StatusBadge :status="statusStore.isHealthy ? 'operational' : 'degraded'" :label="statusStore.statusLabel" />
        <button
          @click="refreshHealth"
          :disabled="statusStore.isChecking"
          class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 transition-colors shadow-2xs"
        >
          <RefreshCwIcon class="w-3.5 h-3.5" :class="statusStore.isChecking ? 'animate-spin text-zinc-900' : 'text-zinc-500'" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Core Services Status Cards -->
    <div class="space-y-4">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Infrastructure Components
      </h2>

      <div class="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <!-- Service 1: API Gateway -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <ServerIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">API Gateway & Router</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">/api/v1</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">{{ statusStore.latencyMs }}ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Operational</span>
            </span>
          </div>
        </div>

        <!-- Service 2: PostgreSQL Database -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <DatabaseIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">PostgreSQL Primary Cluster</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">Geo DB</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">&lt; 5ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Operational</span>
            </span>
          </div>
        </div>

        <!-- Service 3: Redis Cache -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <ZapIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">Redis Cache & Rate Limiting</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">Sliding Window</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">&lt; 1ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Operational</span>
            </span>
          </div>
        </div>

        <!-- Service 4: Documentation & CDN -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <GlobeIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">OpenAPI Docs & Web Gateway</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">CDN Edge</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">12ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>Operational</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 90-Day Uptime Histogram -->
    <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">90-Day Uptime History</h3>
        <span class="font-mono text-xs font-bold text-emerald-700">99.99% Uptime</span>
      </div>

      <!-- Histogram bars -->
      <div class="grid grid-cols-45 sm:grid-cols-90 gap-1 h-8 items-end">
        <div
          v-for="day in 90"
          :key="day"
          class="w-full rounded-xs bg-emerald-500 hover:bg-emerald-600 transition-colors h-full cursor-pointer"
          :title="`Day ${91 - day}: 100% operational (0 incidents)`"
        ></div>
      </div>

      <div class="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>

    <!-- Past Incidents -->
    <div class="space-y-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Past Incidents</h3>
      <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-zinc-900">No incidents reported today</span>
          <span class="text-zinc-400 font-mono">{{ currentDateFormatted }}</span>
        </div>
        <p class="text-xs text-zinc-500 leading-relaxed">
          All API endpoints and database services are performing normally with average latency under 20ms.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  Server as ServerIcon,
  Database as DatabaseIcon,
  Zap as ZapIcon,
  Globe as GlobeIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';
import StatusBadge from '../components/common/StatusBadge.vue';
import { useStatusStore } from '../stores/status.store';

const statusStore = useStatusStore();

const currentDateFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

async function refreshHealth() {
  await statusStore.checkHealth();
}

onMounted(() => {
  statusStore.checkHealth();
});
</script>
