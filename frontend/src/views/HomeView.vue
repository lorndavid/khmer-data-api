<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section -->
    <section class="relative pt-12 sm:pt-16 lg:pt-20">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
        <!-- Status indicator pill -->
        <div class="inline-flex items-center gap-2">
          <div class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-800 shadow-2xs">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span class="font-semibold">KhmerAPI 2025 Release</span>
            <span class="text-zinc-300">|</span>
            <span class="text-zinc-500">14,528 Villages &bull; 100% Free & Open</span>
          </div>
        </div>

        <!-- Main Title -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.12]">
          Cambodia Geographic & <br class="hidden sm:inline" />
          <span class="text-zinc-900">Administrative REST APIs</span>
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
          Standardized REST endpoints for all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages with native Khmer script, postal codes, and GeoJSON boundaries.
        </p>

        <!-- Base URL Copy Bar -->
        <div class="mx-auto max-w-xl pt-2">
          <div class="flex items-center justify-between rounded-xl border border-zinc-300/80 bg-white p-1.5 shadow-subtle hover:border-zinc-400 transition-colors">
            <div class="flex items-center gap-2 pl-3 font-mono text-xs text-zinc-700 truncate">
              <span class="text-zinc-400 select-none">GET</span>
              <span class="font-semibold text-zinc-900">https://api.khmerapi.dev/api/v1/provinces</span>
            </div>
            <button
              @click="copyQuickUrl"
              class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs shrink-0"
            >
              <component :is="urlCopied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5" />
              <span>{{ urlCopied ? 'Copied!' : 'Copy cURL' }}</span>
            </button>
          </div>
        </div>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <router-link
            to="/explorer"
            class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-all shadow-subtle hover:shadow-elevated"
          >
            <CompassIcon class="w-4 h-4" />
            <span>Interactive Explorer</span>
          </router-link>

          <router-link
            to="/docs"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-2xs"
          >
            <BookOpenIcon class="w-4 h-4 text-zinc-500" />
            <span>API Documentation</span>
          </router-link>

          <router-link
            to="/status"
            class="inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
          >
            <ActivityIcon class="w-4 h-4 text-emerald-600" />
            <span>Live Latency ({{ statusStore.latencyMs }}ms)</span>
          </router-link>
        </div>
      </div>

      <!-- Hero Code Example Panel -->
      <div class="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-stretch">
          <!-- Request snippet -->
          <div class="lg:col-span-5 space-y-2">
            <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
              <span class="font-semibold uppercase tracking-wider text-zinc-800 text-[11px]">Clean Request (No Auth)</span>
              <span class="font-mono text-[11px] text-zinc-400">GET /api/v1/provinces</span>
            </div>
            <CodeBlock
              endpoint="/provinces?limit=2"
              method="GET"
              :queryParams="{ limit: 2 }"
            />
          </div>

          <!-- Live response snippet -->
          <div class="lg:col-span-7 space-y-2">
            <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
              <span class="font-semibold uppercase tracking-wider text-zinc-800 text-[11px]">Real 2025 Data Payload</span>
              <span class="font-mono text-emerald-600 font-semibold text-[11px]">200 OK ({{ statusStore.latencyMs }}ms)</span>
            </div>
            <JsonViewer
              :data="heroResponseData"
              :statusCode="200"
              :latencyMs="statusStore.latencyMs"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Public Statistics Summary Strip -->
    <section class="border-y border-zinc-200/80 bg-zinc-50/60 py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-5 text-center">
          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              25
            </div>
            <div class="text-xs font-medium text-zinc-500">Provinces & Capital</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              210
            </div>
            <div class="text-xs font-medium text-zinc-500">Districts (Khan/Srok)</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              1,661
            </div>
            <div class="text-xs font-medium text-zinc-500">Communes (Sangkat)</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              14,528
            </div>
            <div class="text-xs font-medium text-zinc-500">Villages (Phum)</div>
          </div>

          <div class="col-span-2 sm:col-span-4 lg:col-span-1 space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 font-mono">< 10ms</div>
            <div class="text-xs font-medium text-zinc-500">Average Gateway Latency</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clean Horizontal Features Section -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-2 text-left max-w-2xl">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Core Architecture</h2>
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          Engineered for developer speed and simplicity.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Feature 1 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
            <GlobeIcon class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Zero Auth & Zero Friction</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            No signup forms, no API keys, and no credit cards. Simply send an HTTP GET request from any frontend, mobile app, or backend service.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 font-km font-bold text-xs">
            ខ្មែរ
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Full 2025 Cambodian Hierarchy</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Verified official data containing all 25 provinces, 210 districts, 1,661 communes, and 14,528 villages with bilingual Khmer/English support.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
            <ZapIcon class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Redis-Cached & GeoJSON Ready</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Sub-10ms response times powered by Redis in-memory caching, PostgreSQL indexes, and full GeoJSON boundary support for Leaflet and Mapbox.
          </p>
        </div>
      </div>
    </section>

    <!-- Interactive Cambodia GeoJSON Map Section -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div class="space-y-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Spatial Intelligence</h2>
          <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Interactive Cambodia GeoJSON Map
          </p>
        </div>
        <router-link
          to="/explorer"
          class="text-xs font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1"
        >
          <span>Open Full Map & Sandbox</span>
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <CambodiaMap />
    </section>

    <!-- Embedded Interactive Quick Playground -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div class="space-y-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Playground</h2>
          <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Test any endpoint in real time
          </p>
        </div>
        <router-link
          to="/explorer"
          class="text-xs font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1"
        >
          <span>Open Full Interactive Explorer</span>
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <ApiExplorer />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Compass as CompassIcon,
  BookOpen as BookOpenIcon,
  ArrowRight as ArrowRightIcon,
  Globe as GlobeIcon,
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Copy as CopyIcon,
  Check as CheckIcon
} from 'lucide-vue-next';
import CodeBlock from '../components/common/CodeBlock.vue';
import JsonViewer from '../components/common/JsonViewer.vue';
import CambodiaMap from '../components/explorer/CambodiaMap.vue';
import ApiExplorer from '../components/explorer/ApiExplorer.vue';
import { useStatusStore } from '../stores/status.store';

const statusStore = useStatusStore();
const urlCopied = ref(false);

async function copyQuickUrl() {
  try {
    await navigator.clipboard.writeText('curl -X GET "https://api.khmerapi.dev/api/v1/provinces?limit=2" -H "Accept: application/json"');
    urlCopied.value = true;
    setTimeout(() => {
      urlCopied.value = false;
    }, 2000);
  } catch (_err) {
    // Fallback
  }
}

const heroResponseData = {
  success: true,
  data: [
    {
      code: "12",
      name_km: "រាជធានីភ្នំពេញ",
      name_en: "Phnom Penh",
      slug: "phnom-penh",
      type: "Capital",
      latitude: 11.5564,
      longitude: 104.9282,
      is_active: true
    },
    {
      code: "17",
      name_km: "ខេត្តសៀមរាប",
      name_en: "Siem Reap",
      slug: "siem-reap",
      type: "Province",
      latitude: 13.3671,
      longitude: 103.8448,
      is_active: true
    }
  ],
  meta: {
    page: 1,
    limit: 2,
    total: 25,
    total_pages: 13,
    request_id: "5fa23d18-97e3-4c9f-8e2c-38374d8bb1a4",
    timestamp: new Date().toISOString()
  }
};

onMounted(() => {
  statusStore.checkHealth();
  statusStore.fetchStatistics();
});
</script>


