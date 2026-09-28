<template>
  <div class="space-y-16 sm:space-y-24 pb-20 font-battambang">
    <!-- Hero Section -->
    <section class="relative pt-6 sm:pt-12 lg:pt-16 overflow-hidden">
      <!-- Ambient Background Glow & Tech Grid -->
      <div class="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div class="h-[350px] sm:h-[500px] w-[90vw] max-w-[1000px] bg-gradient-to-tr from-emerald-100/50 via-sky-100/40 to-indigo-100/30 blur-3xl rounded-full opacity-70"></div>
      </div>
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>

      <div class="mx-auto w-[92%] sm:w-[88%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 text-center space-y-6 sm:space-y-8">
        
        <!-- Live Status & Release Pill -->
        <div class="inline-flex items-center justify-center">
          <div class="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-zinc-200/90 bg-white/90 backdrop-blur-md px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs hover:border-zinc-300 hover:shadow-subtle transition-all">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span class="font-bold text-zinc-900 tracking-tight">{{ langStore.t.home.badge }}</span>
            <span class="text-zinc-300">|</span>
            <span class="font-mono text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Zero Auth • CORS Open
            </span>
          </div>
        </div>

        <!-- Main Title & Subtitle -->
        <div class="space-y-4 max-w-4xl mx-auto">
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 leading-[1.18] sm:leading-[1.15]">
            <span class="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
              {{ langStore.t.home.heroTitle }}
            </span>
          </h1>

          <p class="mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed font-normal">
            {{ langStore.t.home.heroSubtitle }}
          </p>
        </div>

        <!-- Base cURL Quick-Copy Bar -->
        <div class="mx-auto max-w-xl">
          <div class="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 shadow-subtle hover:border-zinc-300 hover:shadow-elevated transition-all">
            <div class="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 font-mono text-[11px] sm:text-xs text-zinc-700 truncate min-w-0">
              <span class="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold border border-emerald-200/60 select-none shrink-0">
                GET
              </span>
              <span class="font-semibold text-zinc-900 truncate">
                https://api.khmerapi.dev/api/v1/{{ activeHeroEndpoint.path }}
              </span>
            </div>
            <button
              @click="copyQuickUrl"
              class="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-98 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Copy cURL Command"
            >
              <component :is="urlCopied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5 text-emerald-400" v-if="urlCopied" />
              <CopyIcon v-else class="w-3.5 h-3.5" />
              <span>{{ urlCopied ? langStore.t.common.copied : 'Copy cURL' }}</span>
            </button>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-1">
          <router-link
            to="/explorer"
            class="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 active:scale-98 transition-all shadow-subtle hover:shadow-elevated"
          >
            <CompassIcon class="w-4 h-4 text-emerald-400" />
            <span>{{ langStore.t.home.exploreBtn }}</span>
          </router-link>

          <router-link
            to="/docs"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 active:scale-98 transition-all shadow-2xs"
          >
            <BookOpenIcon class="w-4 h-4 text-zinc-500" />
            <span>{{ langStore.t.home.docsBtn }}</span>
          </router-link>

          <router-link
            to="/demographics"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-800 hover:bg-zinc-50 active:scale-98 transition-all shadow-2xs"
          >
            <UsersIcon class="w-4 h-4 text-sky-600" />
            <span>{{ langStore.t.nav.demographics }}</span>
            <span class="rounded bg-sky-100 text-sky-800 text-[10px] font-mono font-bold px-1.5 py-0.2">17.3M</span>
          </router-link>

          <router-link
            to="/status"
            class="hidden sm:inline-flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:scale-98 transition-all"
          >
            <ActivityIcon class="w-4 h-4 text-emerald-600" />
            <span>{{ langStore.t.nav.status }} ({{ statusStore.latencyMs }}ms)</span>
          </router-link>
        </div>

        <!-- Interactive Hero Developer Console (Cool Terminal Box) -->
        <div class="pt-2 sm:pt-4 text-left">
          <div class="rounded-2xl border border-zinc-200/90 bg-white shadow-card overflow-hidden transition-all">
            
            <!-- Terminal Title Bar with Mac Dots and Tabs -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 bg-zinc-50/90 px-3.5 sm:px-4 py-2.5 gap-2.5">
              
              <!-- Left: Window Controls & Endpoint Selectors -->
              <div class="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
                <!-- Mac Traffic Light Dots -->
                <div class="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
                  <div class="h-2.5 w-2.5 rounded-full bg-rose-400/80"></div>
                  <div class="h-2.5 w-2.5 rounded-full bg-amber-400/80"></div>
                  <div class="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></div>
                </div>

                <!-- Endpoint Switcher Tabs -->
                <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    v-for="(ep, idx) in heroEndpoints"
                    :key="ep.id"
                    @click="activeEndpointIdx = idx"
                    :class="[
                      'inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap',
                      activeEndpointIdx === idx
                        ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                        : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900'
                    ]"
                  >
                    <span class="text-xs">{{ ep.icon }}</span>
                    <span class="font-mono text-[11px]">{{ ep.title }}</span>
                    <span class="font-battambang text-[10px] opacity-80" v-if="langStore.currentLang === 'km'">({{ ep.kmTag }})</span>
                  </button>
                </div>
              </div>

              <!-- Right: Live Telemetry Tag -->
              <div class="flex items-center justify-between sm:justify-end gap-2 text-xs">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>HTTP 200 • {{ statusStore.latencyMs }}ms</span>
                </span>
              </div>
            </div>

            <!-- Console Dual View: Request & Live Formatted JSON -->
            <div class="grid grid-cols-1 gap-0 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
              
              <!-- Left Column: Client Code Snippets -->
              <div class="lg:col-span-5 p-3.5 sm:p-5 space-y-3 bg-zinc-50/40">
                <div class="flex items-center justify-between text-xs text-zinc-500">
                  <span class="font-bold uppercase tracking-wider text-zinc-800 text-[11px] flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Client Code</span>
                  </span>
                  <span class="font-mono text-[11px] text-zinc-400">cURL, JS, Py, Dart, Go</span>
                </div>
                <CodeBlock
                  :endpoint="activeHeroEndpoint.endpoint"
                  :method="'GET'"
                  :queryParams="activeHeroEndpoint.queryParams"
                />
                <p class="text-[11.5px] text-zinc-500 leading-relaxed font-normal">
                  {{ activeHeroEndpoint.description }}
                </p>
              </div>

              <!-- Right Column: Formatted JSON Response -->
              <div class="lg:col-span-7 p-3.5 sm:p-5 space-y-3">
                <div class="flex items-center justify-between text-xs text-zinc-500">
                  <div class="flex items-center gap-2">
                    <span class="font-bold uppercase tracking-wider text-zinc-800 text-[11px] flex items-center gap-1.5">
                      <span>📄</span>
                      <span>Live JSON Output</span>
                    </span>
                  </div>
                  <span class="font-mono text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Verified 2025 Standard
                  </span>
                </div>
                <div class="max-h-[380px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-950 p-2 sm:p-3 shadow-inner">
                  <JsonViewer
                    :data="activeHeroEndpoint.response"
                    :statusCode="200"
                    :latencyMs="statusStore.latencyMs"
                    :showHeader="false"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Public Statistics Summary Strip -->
    <section class="border-y border-zinc-200/80 bg-zinc-50/60 py-8 sm:py-10">
      <div class="mx-auto w-[92%] sm:w-[88%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4">
        <div class="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-6 text-center">
          <div class="space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ langStore.currentLang === 'km' ? '២៥' : '25' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statProvinces }}</div>
          </div>

          <div class="space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ langStore.currentLang === 'km' ? '២១០' : '210' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statDistricts }}</div>
          </div>

          <div class="space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ langStore.currentLang === 'km' ? '១,៦៦១' : '1,661' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statCommunes }}</div>
          </div>

          <div class="space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ langStore.currentLang === 'km' ? '១៤,៥២៨' : '14,528' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statVillages }}</div>
          </div>

          <div class="space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-mono">
              {{ langStore.currentLang === 'km' ? '១៧.៣ លាន' : '17.3M' }}
            </div>
            <div class="text-xs font-medium text-zinc-500">{{ langStore.t.home.statPopulation }}</div>
          </div>

          <div class="col-span-2 sm:col-span-3 lg:col-span-1 space-y-1 p-2">
            <div class="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 font-mono">&lt; 10ms</div>
            <div class="text-xs font-medium text-zinc-500">Average Latency</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clean Core Features Grid -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 space-y-8 sm:space-y-10">
      <div class="space-y-2 text-left max-w-2xl">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">{{ langStore.t.home.featuresTitle }}</h2>
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          {{ langStore.t.home.featuresSubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <!-- Feature 1 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <GlobeIcon class="w-5 h-5 text-zinc-800" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature4Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            {{ langStore.t.home.feature4Desc }}
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-battambang font-bold text-base">
            🇰🇭
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature1Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            {{ langStore.t.home.feature1Desc }}
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <ZapIcon class="w-5 h-5 text-amber-600" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature3Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">
            {{ langStore.t.home.feature3Desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- Interactive Cambodia GeoJSON Map Section -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div class="space-y-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Spatial Intelligence</h2>
          <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            {{ langStore.t.explorer.mapLayers }}
          </p>
        </div>
        <router-link
          to="/explorer"
          class="text-xs font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1"
        >
          <span>{{ langStore.t.home.exploreBtn }}</span>
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <CambodiaMap />
    </section>

    <!-- Embedded Interactive Quick Playground -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 pb-4">
        <div class="space-y-1">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Playground</h2>
          <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            {{ langStore.t.apis.title }}
          </p>
        </div>
        <router-link
          to="/explorer"
          class="text-xs font-semibold text-zinc-900 hover:underline inline-flex items-center gap-1"
        >
          <span>{{ langStore.t.nav.openExplorer }}</span>
          <ArrowRightIcon class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <ApiExplorer />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Compass as CompassIcon,
  BookOpen as BookOpenIcon,
  ArrowRight as ArrowRightIcon,
  Globe as GlobeIcon,
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  Users as UsersIcon,
} from 'lucide-vue-next';
import CodeBlock from '../components/common/CodeBlock.vue';
import JsonViewer from '../components/common/JsonViewer.vue';
import CambodiaMap from '../components/explorer/CambodiaMap.vue';
import ApiExplorer from '../components/explorer/ApiExplorer.vue';
import { useStatusStore } from '../stores/status.store';
import { useLangStore } from '../stores/lang.store';

const statusStore = useStatusStore();
const langStore = useLangStore();
const urlCopied = ref(false);
const activeEndpointIdx = ref(0);

const heroEndpoints = [
  {
    id: 'provinces',
    title: '/provinces',
    icon: '🏛️',
    kmTag: '២៥ ខេត្ត',
    path: 'provinces?limit=2',
    endpoint: '/provinces?limit=2',
    queryParams: { limit: 2 },
    description: 'Fetch normalized list of Cambodia 25 provinces and capital Phnom Penh with native Khmer/English names, ISO codes, and coordinates.',
    response: {
      success: true,
      data: [
        {
          code: "12",
          name_km: "រាជធានីភ្នំពេញ",
          name_en: "Phnom Penh",
          slug: "phnom-penh",
          type: "Capital",
          latitude: 11.5564,
          longitude: 104.9282
        },
        {
          code: "17",
          name_km: "ខេត្តសៀមរាប",
          name_en: "Siem Reap",
          slug: "siem-reap",
          type: "Province",
          latitude: 13.3671,
          longitude: 103.8448
        }
      ],
      meta: {
        page: 1,
        limit: 2,
        total: 25,
        total_pages: 13,
        request_id: "req-hero-provinces"
      }
    }
  },
  {
    id: 'demographics',
    title: '/demographics',
    icon: '📊',
    kmTag: '១៧.៣ លាន',
    path: 'demographics/population',
    endpoint: '/demographics/population',
    queryParams: {},
    description: 'Official census timeline (1962–2024: 17.3M) and 25-province population breakdown from National Institute of Statistics (NIS).',
    response: {
      success: true,
      data: {
        country: "Kingdom of Cambodia",
        country_km: "ព្រះរាជាណាចក្រកម្ពុជា",
        latest: {
          year: 2024,
          year_km: "២០២៤",
          population_millions: 17.3,
          population_km: "១៧.៣ លាននាក់",
          growth_rate_pct: 2.09
        },
        total_milestones: 10,
        baseline_year: 1962,
        baseline_population: 5.7
      },
      meta: { request_id: "req-hero-demo" }
    }
  },
  {
    id: 'postal',
    title: '/postal-codes',
    icon: '📮',
    kmTag: 'ប្រៃសណីយ៍',
    path: 'postal-codes/12000',
    endpoint: '/postal-codes/12000',
    queryParams: {},
    description: 'Direct 5-digit Cambodia Post zip code mapping linked to administrative commune and district boundaries.',
    response: {
      success: true,
      data: {
        postal_code: "12000",
        province_code: "12",
        province_name_en: "Phnom Penh",
        province_name_km: "រាជធានីភ្នំពេញ",
        district_name_en: "Doun Penh",
        district_name_km: "ខណ្ឌដូនពេញ"
      },
      meta: { request_id: "req-hero-postal" }
    }
  },
  {
    id: 'search',
    title: '/search',
    icon: '🔍',
    kmTag: 'ស្វែងរក',
    path: 'search?q=Angkor',
    endpoint: '/search?q=Angkor',
    queryParams: { q: 'Angkor' },
    description: 'Fast trigram fuzzy search across 14,528 Cambodian locations in Khmer script and Romanized English.',
    response: {
      success: true,
      data: [
        {
          code: "1701",
          type: "district",
          name_en: "Angkor Chum",
          name_km: "ស្រុកអង្គរជុំ",
          province_name_en: "Siem Reap"
        },
        {
          code: "1702",
          type: "district",
          name_en: "Angkor Thum",
          name_km: "ស្រុកអង្គរធំ",
          province_name_en: "Siem Reap"
        }
      ],
      meta: { total_matches: 2, query: "Angkor" }
    }
  }
];

const activeHeroEndpoint = computed(() => heroEndpoints[activeEndpointIdx.value]);

async function copyQuickUrl() {
  try {
    const fullCmd = `curl -X GET "https://api.khmerapi.dev/api/v1/${activeHeroEndpoint.value.path}" -H "Accept: application/json"`;
    await navigator.clipboard.writeText(fullCmd);
    urlCopied.value = true;
    setTimeout(() => {
      urlCopied.value = false;
    }, 2000);
  } catch (_err) {
    // Fallback
  }
}

onMounted(() => {
  statusStore.checkHealth();
  statusStore.fetchStatistics();
});
</script>
