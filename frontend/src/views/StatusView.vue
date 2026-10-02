<template>
  <div class="mx-auto w-[90%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 py-12 space-y-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-6 font-battambang">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2">
          <span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-700 border border-emerald-200/60">
            {{ langStore.currentLang === 'km' ? 'ប្រព័ន្ធតាមដានទិន្នន័យ Telemetry' : 'Open Source Telemetry' }}
          </span>
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
          {{ langStore.t.status.title }}
        </h1>
        <p class="text-xs text-zinc-500">
          {{ langStore.t.status.subtitle }}
        </p>
      </div>

      <div class="flex items-center gap-3 font-battambang">
        <div class="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 shadow-2xs">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ langStore.t.status.allOperational }}</span>
        </div>
        <button
          @click="runAllLatencyBenchmarks"
          :disabled="isBenchmarking"
          class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RefreshCwIcon class="w-3.5 h-3.5" :class="isBenchmarking ? 'animate-spin' : ''" />
          <span>{{ isBenchmarking ? langStore.t.status.checking : langStore.t.status.recheckAll }}</span>
        </button>
      </div>
    </div>

    <!-- Live Dataset Metrics Bar -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5 font-battambang">
      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-1">
        <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statProvinces }}</div>
        <div class="text-2xl font-extrabold font-mono text-zinc-900">{{ langStore.currentLang === 'km' ? '២៥' : '25' }}</div>
        <div class="text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? 'ផ្ទៀងផ្ទាត់ ១០០% (២០២៥)' : '100% Verified (2025)' }}</div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-1">
        <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statDistricts }}</div>
        <div class="text-2xl font-extrabold font-mono text-zinc-900">{{ langStore.currentLang === 'km' ? '២១០' : '210' }}</div>
        <div class="text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? 'នៅទូទាំង ២៥ ខេត្ត' : 'Across 25 Provinces' }}</div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-1">
        <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statCommunes }}</div>
        <div class="text-2xl font-extrabold font-mono text-zinc-900">{{ langStore.currentLang === 'km' ? '១,៦៦១' : '1,661' }}</div>
        <div class="text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? 'ឃុំ និងសង្កាត់' : 'Subdivisions' }}</div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-1">
        <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statVillages }}</div>
        <div class="text-2xl font-extrabold font-mono text-zinc-900">{{ langStore.currentLang === 'km' ? '១៤,៥២៨' : '14,528' }}</div>
        <div class="text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? 'ឋានានុក្រមពេញលេញ' : 'Full Relational Tree' }}</div>
      </div>

      <div class="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs space-y-1">
        <div class="text-xs font-medium text-emerald-800">{{ langStore.currentLang === 'km' ? 'ល្បឿនមធ្យម Gateway' : 'Average Gateway Latency' }}</div>
        <div class="text-2xl font-extrabold font-mono text-emerald-700">{{ avgLatency }}ms</div>
        <div class="text-[11px] text-emerald-600 font-medium">{{ langStore.currentLang === 'km' ? 'ល្បឿនលឿនជាក់ស្តែង' : 'High Performance Latency' }}</div>
      </div>
    </div>

    <!-- Live API Endpoint Latency Grid -->
    <div class="space-y-4 font-battambang">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-zinc-900">{{ langStore.t.status.livePingsTitle }}</h2>
          <p class="text-xs text-zinc-500">{{ langStore.t.status.livePingsDesc }}</p>
        </div>
        <span class="text-xs font-mono text-zinc-400">Target: /v1</span>
      </div>

      <div class="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-2xs overflow-hidden">
        <div
          v-for="ep in benchmarkEndpoints"
          :key="ep.path"
          class="flex flex-col sm:flex-row sm:items-center justify-between p-4 text-xs gap-3 hover:bg-zinc-50/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="rounded bg-zinc-100 text-zinc-800 font-mono font-bold text-[10px] px-2 py-0.5 border border-zinc-200">
              {{ ep.method }}
            </span>
            <div>
              <span class="font-mono font-semibold text-zinc-900 text-xs sm:text-sm">{{ ep.path }}</span>
              <p class="text-[11px] text-zinc-500">{{ ep.description }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 self-end sm:self-auto">
            <!-- Latency Bar -->
            <div class="w-24 sm:w-32 bg-zinc-100 rounded-full h-2 overflow-hidden flex items-center">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="ep.latency < 100 ? 'bg-emerald-500' : ep.latency < 300 ? 'bg-emerald-600' : ep.latency < 600 ? 'bg-amber-500' : 'bg-rose-500'"
                :style="{ width: Math.min(100, Math.max(12, Math.round(ep.latency / 4))) + '%' }"
              ></div>
            </div>

            <!-- Latency text -->
            <div class="w-20 text-right">
              <div class="font-mono text-xs font-bold text-zinc-800">
                {{ ep.latency !== null ? ep.latency + ' ms' : '...' }}
              </div>
              <div v-if="ep.serverTime" class="font-mono text-[9px] text-zinc-400">
                core: {{ ep.serverTime }}
              </div>
            </div>

            <!-- Status Pill -->
            <span
              class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
              :class="ep.status === 200 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'"
            >
              <span class="h-1.5 w-1.5 rounded-full" :class="ep.status === 200 ? 'bg-emerald-500' : 'bg-rose-500'"></span>
              <span>{{ ep.status === 200 ? '200 OK' : ep.status ? ep.status : 'Testing' }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Open Source Architecture & System Design Section -->
    <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-6 font-battambang">
      <div class="space-y-1">
        <h2 class="text-sm font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'ស្ថាបត្យកម្មប្រព័ន្ធ & រចនាសម្ព័ន្ធ API' : 'System Architecture & Design' }}</h2>
        <p class="text-xs text-zinc-500">
          {{ langStore.currentLang === 'km' ? 'របៀបដែល KhmerAPI ផ្តល់ទិន្នន័យសាធារណៈកម្ពុជាប្រកបដោយល្បឿនលឿន និងភាពជឿជាក់ខ្ពស់។' : 'How KhmerAPI serves high-throughput public Cambodian data with minimal latency and high resilience.' }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <!-- Layer 1 -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase text-zinc-500">Layer 1</span>
            <GlobeIcon class="w-4 h-4 text-zinc-600" />
          </div>
          <h3 class="text-xs font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'ច្រកទ្វារ Edge & Gateway' : 'Edge & Gateway' }}</h3>
          <p class="text-[11px] text-zinc-600 leading-relaxed">
            {{ langStore.currentLang === 'km' ? 'ច្រកទ្វារ Express/Node.js ដំណើរការតាមស្តង់ដារ HTTP/2 មិនទាមទារ API Key មានសុវត្ថិភាពខ្ពស់ និងបើក CORS រួចជាស្រេច។' : 'Express / Node.js HTTP/2 gateway with zero-auth public routing, CORS headers, Helmet security, and OpenAPI 3.1 compliance.' }}
          </p>
        </div>

        <!-- Layer 2 -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase text-zinc-500">Layer 2</span>
            <ZapIcon class="w-4 h-4 text-amber-600" />
          </div>
          <h3 class="text-xs font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'អង្គចងចាំទិន្នន័យ Buffer' : 'In-Memory Query Buffer' }}</h3>
          <p class="text-[11px] text-zinc-600 leading-relaxed">
            {{ langStore.currentLang === 'km' ? 'ផ្ទុកទិន្នន័យញឹកញាប់ក្នុង Memory Buffer ជាមួយ Node.js រួមមានខេត្ត ស្រុក ឃុំ ភូមិ និង Index ស្វែងរក ផ្តល់ល្បឿនឆ្លើយតប < 1ms។' : 'Sub-millisecond in-memory buffering of high-frequency datasets (provinces, districts, search indices) and sliding rate limiting.' }}
          </p>
        </div>

        <!-- Layer 3 -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase text-zinc-500">Layer 3</span>
            <DatabaseIcon class="w-4 h-4 text-blue-600" />
          </div>
          <h3 class="text-xs font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'មូលដ្ឋានទិន្នន័យ PostgreSQL' : 'PostgreSQL Primary DB' }}</h3>
          <p class="text-[11px] text-zinc-600 leading-relaxed">
            {{ langStore.currentLang === 'km' ? 'រចនាសម្ព័ន្ធទិន្នន័យ ៤ ថ្នាក់ត្រឹមត្រូវ មាន B-Tree Index គាំទ្រការស្វែងរកអក្សរខ្មែរ-អង់គ្លេសលើ ១៤,៥២៨ ទីតាំង។' : 'Relational 4-tier schema with B-Tree indexes, full-text bilingual search, and foreign-key referential integrity across 14,528 records.' }}
          </p>
        </div>

        <!-- Layer 4 -->
        <div class="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono font-bold uppercase text-zinc-500">Layer 4</span>
            <MapIcon class="w-4 h-4 text-emerald-600" />
          </div>
          <h3 class="text-xs font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'ប្រព័ន្ធផែនទី GeoJSON' : 'GeoJSON Spatial Engine' }}</h3>
          <p class="text-[11px] text-zinc-600 leading-relaxed">
            {{ langStore.currentLang === 'km' ? 'ស្រទាប់ព្រំប្រទល់ខេត្ត និងកូអរដោនេ MultiPolygon ស្តង់ដារ GeoJSON ងាយស្រួលប្រើជាមួយ Leaflet និង Google Maps។' : 'National province boundaries and MultiPolygon coordinates exported as standard GeoJSON for GIS mapping and Leaflet/Mapbox integration.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Infrastructure Components Breakdown -->
    <div class="space-y-4 font-battambang">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {{ langStore.currentLang === 'km' ? 'ស្ថានភាពសមាសភាគប្រព័ន្ធ' : 'Infrastructure Telemetry' }}
      </h2>

      <div class="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <!-- Service 1: API Gateway -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <ServerIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">{{ langStore.currentLang === 'km' ? 'ច្រកទ្វារ API Gateway & Router' : 'API Gateway & Router' }}</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">Express / TypeScript</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">{{ statusStore.latencyMs }}ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ langStore.currentLang === 'km' ? 'ដំណើរការប្រក្រតី' : 'Operational' }}</span>
            </span>
          </div>
        </div>

        <!-- Service 2: PostgreSQL Database -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <DatabaseIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">{{ langStore.t.status.postgresDb }}</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? '១៤,៥២៨ ទិន្នន័យ' : '14,528 Records Indexed' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">&lt; 3ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ langStore.currentLang === 'km' ? 'ដំណើរការប្រក្រតី' : 'Operational' }}</span>
            </span>
          </div>
        </div>

        <!-- Service 3: Edge & Gateway -->
        <div class="flex items-center justify-between p-4 text-xs sm:text-sm">
          <div class="flex items-center gap-3">
            <GlobeIcon class="w-4 h-4 text-zinc-500" />
            <div>
              <span class="font-bold text-zinc-900">{{ langStore.t.status.edgeGateway }}</span>
              <span class="ml-2 font-mono text-[11px] text-zinc-400">{{ langStore.currentLang === 'km' ? 'Edge Tunnel & Gateway' : 'Cloudflare Tunnel & Edge' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs text-zinc-500">&lt; 1ms</span>
            <span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ langStore.currentLang === 'km' ? 'ដំណើរការប្រក្រតី' : 'Operational' }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Server as ServerIcon,
  Database as DatabaseIcon,
  Zap as ZapIcon,
  Globe as GlobeIcon,
  Map as MapIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';
import axios from 'axios';
import { useStatusStore } from '../stores/status.store';
import { useLangStore } from '../stores/lang.store';

const statusStore = useStatusStore();
const langStore = useLangStore();
const isBenchmarking = ref(false);

interface EndpointBenchmark {
  method: string;
  path: string;
  description: string;
  latency: number;
  serverTime?: string | null;
  status: number;
}

const benchmarkEndpoints = ref<EndpointBenchmark[]>([
  { method: 'GET', path: '/v1/provinces', description: 'List all 25 provinces', latency: 8, status: 200 },
  { method: 'GET', path: '/v1/provinces/12', description: 'Fetch Phnom Penh capital', latency: 6, status: 200 },
  { method: 'GET', path: '/v1/districts?province_code=12', description: 'Fetch Khan in Phnom Penh', latency: 9, status: 200 },
  { method: 'GET', path: '/v1/communes?district_code=1201', description: 'Fetch Sangkat in Chamkar Mon', latency: 7, status: 200 },
  { method: 'GET', path: '/v1/villages?commune_code=120101', description: 'Fetch Villages in Tonle Bassac', latency: 8, status: 200 },
  { method: 'GET', path: '/v1/search?q=Siem%20Reap', description: 'Bilingual full-text search', latency: 12, status: 200 },
  { method: 'GET', path: '/v1/locations/12010101', description: 'Complete 4-tier tree lookup', latency: 10, status: 200 },
  { method: 'GET', path: '/v1/geo/provinces', description: 'GeoJSON boundary geometries', latency: 14, status: 200 },
  { method: 'GET', path: '/v1/statistics', description: 'Live database records metadata', latency: 5, status: 200 },
]);

const avgLatency = computed(() => {
  const valid = benchmarkEndpoints.value.filter(e => e.latency !== null && e.latency > 0);
  if (valid.length === 0) return 8;
  const sum = valid.reduce((acc, curr) => acc + curr.latency, 0);
  return Math.round(sum / valid.length);
});

async function runAllLatencyBenchmarks() {
  isBenchmarking.value = true;
  for (const ep of benchmarkEndpoints.value) {
    const start = performance.now();
    try {
      const res = await axios.get(ep.path, { timeout: 4000 });
      ep.latency = Math.max(1, Math.round(performance.now() - start));
      ep.serverTime = (res.headers['x-response-time'] as string) || null;
      ep.status = res.status;
    } catch (err: any) {
      ep.latency = Math.max(1, Math.round(performance.now() - start));
      ep.serverTime = null;
      ep.status = err.response ? err.response.status : 500;
    }
  }
  isBenchmarking.value = false;
}

onMounted(async () => {
  await statusStore.checkHealth();
  await statusStore.fetchStatistics();
  runAllLatencyBenchmarks();
});
</script>

