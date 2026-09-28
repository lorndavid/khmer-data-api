<template>
  <div class="space-y-20 pb-20">
    <!-- Hero Section -->
    <section class="relative pt-12 sm:pt-16 lg:pt-20">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6">
        <!-- Status indicator pill -->
        <div class="inline-flex items-center gap-2">
          <StatusBadge :status="statusStore.isHealthy ? 'operational' : 'degraded'" :label="statusStore.statusLabel" />
        </div>

        <!-- Main Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
          Free & Open APIs for <br class="hidden sm:inline" />
          <span class="text-zinc-900">Cambodian Developers</span>
        </h1>

        <!-- Subtitle -->
        <p class="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed">
          Access Cambodia's administrative hierarchy, postal codes, geographic coordinates, and public developer utilities through simple, standardized REST APIs.
        </p>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <router-link
            to="/apis"
            class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-all shadow-subtle hover:shadow-elevated"
          >
            <CompassIcon class="w-4 h-4" />
            <span>Explore APIs</span>
          </router-link>

          <router-link
            to="/docs"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-2xs"
          >
            <BookOpenIcon class="w-4 h-4 text-zinc-500" />
            <span>Read Documentation</span>
          </router-link>

          <router-link
            to="/explorer"
            class="inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all"
          >
            <span>Try in Explorer</span>
            <ArrowRightIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Hero Code Example Panel -->
      <div class="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-stretch">
          <!-- Request snippet -->
          <div class="lg:col-span-5 space-y-2">
            <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
              <span class="font-semibold uppercase tracking-wider text-zinc-800 text-[11px]">Request</span>
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
              <span class="font-semibold uppercase tracking-wider text-zinc-800 text-[11px]">Live Response</span>
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
              {{ statusStore.statistics?.province_count ?? 25 }}
            </div>
            <div class="text-xs font-medium text-zinc-500">Provinces & Capital</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ statusStore.statistics?.district_count ?? '200+' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">Districts (Khan/Srok)</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ statusStore.statistics?.commune_count ?? '1,600+' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">Communes (Sangkat)</div>
          </div>

          <div class="space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ statusStore.statistics?.village_count ?? '14,000+' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">Villages (Phum)</div>
          </div>

          <div class="col-span-2 sm:col-span-4 lg:col-span-1 space-y-1">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">100%</div>
            <div class="text-xs font-medium text-zinc-500">Free & Open Access</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clean Horizontal Features Section -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="space-y-2 text-left max-w-2xl">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Core Architecture</h2>
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          Engineered for developer productivity.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Feature 1 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
            <MapPinIcon class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Complete Geographic Tree</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Normalized 4-tier hierarchy: Country → Province → District → Commune → Village with verified official administrative codes and postal mapping.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 font-km font-bold text-xs">
            ខ្មែរ
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Native Khmer & English</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Every record contains native Khmer script (ឈ្មោះខ្មែរ), standardized Latin transcription, and URL-safe slugs for search and lookup.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
            <ZapIcon class="w-4 h-4" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">Redis-Accelerated Speed</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Fast sub-millisecond responses via multi-tier Redis caching and PostgreSQL indexes, with OpenAPI 3.1 documentation and automated rate limiting.
          </p>
        </div>
      </div>
    </section>

    <!-- Embedded Interactive Quick Playground -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div class="space-y-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Playground</h2>
          <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Test the API right now
          </p>
        </div>
        <router-link
          to="/explorer"
          class="text-xs font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1"
        >
          <span>Open Fullscreen Explorer</span>
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <ApiExplorer />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  Compass as CompassIcon,
  BookOpen as BookOpenIcon,
  ArrowRight as ArrowRightIcon,
  MapPin as MapPinIcon,
  Zap as ZapIcon
} from 'lucide-vue-next';
import StatusBadge from '../components/common/StatusBadge.vue';
import CodeBlock from '../components/common/CodeBlock.vue';
import JsonViewer from '../components/common/JsonViewer.vue';
import ApiExplorer from '../components/explorer/ApiExplorer.vue';
import { useStatusStore } from '../stores/status.store';

const statusStore = useStatusStore();

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
