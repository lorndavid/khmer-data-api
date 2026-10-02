<template>
  <div class="space-y-16 sm:space-y-24 pb-20 font-battambang">
    <!-- Hero Section -->
    <section class="relative pt-8 sm:pt-14 lg:pt-20 pb-4 sm:pb-8 overflow-hidden">
      
      <!-- Animated Background Layer -->
      <div class="pointer-events-none absolute inset-0 -z-10">
        <!-- Animated gradient orbs -->
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
        <!-- Dot grid -->
        <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:28px_28px] opacity-50"></div>
      </div>

      <!-- Floating Particles -->
      <div class="pointer-events-none absolute inset-0 -z-5 overflow-hidden">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
        <div class="particle particle-6"></div>
        <div class="particle particle-7"></div>
        <div class="particle particle-8"></div>
      </div>

      <div class="mx-auto w-[92%] sm:w-[88%] lg:w-[80%] max-w-[1440px] px-2 sm:px-4 text-center space-y-6 sm:space-y-8">
        
        <!-- Main Title & Subtitle (GSAP Animated) -->
        <div class="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
          <h1 class="gsap-hero-title text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-6xl font-black tracking-tight text-zinc-900 leading-[1.12] sm:leading-[1.1]">
            <span class="hero-gradient-text">
              {{ langStore.t.home.heroTitle }}
            </span>
          </h1>

          <p class="gsap-hero-subtitle mx-auto max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-600 leading-relaxed font-normal">
            {{ langStore.t.home.heroSubtitle }}
          </p>
        </div>

        <!-- Hero Video Showcase — Seamless, Borderless with Bottom Overlaid CTAs -->
        <div class="gsap-video-container relative mx-auto max-w-5xl mb-6 sm:mb-10">
          <div class="hero-float-container relative">
            <!-- Borderless Video Frame -->
            <div class="hero-video-frame rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 relative">
              <video
                autoplay
                loop
                muted
                playsinline
                preload="auto"
                poster="/hero-illustration.jpg"
                class="w-full h-auto block select-none"
              >
                <source src="/gemini_generated_video_1eb6cc98.mp4" type="video/mp4" />
              </video>

              <!-- Bottom Overlaid CTAs on the Video (Single Row, No Dark Container) -->
              <div class="absolute bottom-3 sm:bottom-6 left-0 right-0 px-2 sm:px-4 z-10 flex items-center justify-center">
                <div class="flex items-center flex-nowrap justify-center gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 max-w-full">
                  <router-link
                    to="/explorer"
                    class="gsap-hero-cta group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-900 backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-elevated hover:shadow-2xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 border border-white/20"
                  >
                    <CompassIcon class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span>{{ langStore.t.home.exploreBtn }}</span>
                  </router-link>

                  <router-link
                    to="/docs"
                    class="gsap-hero-cta group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white/95 hover:bg-white backdrop-blur-md px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-zinc-900 shadow-elevated hover:shadow-2xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 border border-zinc-200/80"
                  >
                    <BookOpenIcon class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                    <span>{{ langStore.t.home.docsBtn }}</span>
                  </router-link>

                  <router-link
                    to="/demographics"
                    class="gsap-hero-cta group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white/95 hover:bg-white backdrop-blur-md px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-zinc-900 shadow-elevated hover:shadow-2xl active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 border border-zinc-200/80"
                  >
                    <UsersIcon class="w-3.5 sm:w-4 h-3.5 sm:h-4 text-sky-600" />
                    <span>{{ langStore.t.nav.demographics }}</span>
                    <span class="rounded bg-sky-100 text-sky-800 text-[10px] font-mono font-bold px-1.5 py-0.5 group-hover:bg-sky-200 transition-colors">17.3M</span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Soft Ambient Glows beneath video -->
            <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-gradient-to-r from-emerald-400/20 via-sky-400/15 to-violet-400/15 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- Public Statistics Summary Strip (Section Container with Borderless Points) -->
    <section ref="statsSectionRef" class="border-y border-zinc-200/80 bg-zinc-50/60 py-8 sm:py-10 relative overflow-hidden">
      <div class="mx-auto w-[94%] sm:w-[90%] lg:w-[88%] max-w-[1440px] px-2 sm:px-4">
        <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 sm:grid-cols-3 lg:grid-cols-6 text-center">
          
          <!-- Provinces -->
          <div class="gsap-stat-card space-y-1 p-2 rounded-xl hover:bg-zinc-100/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-mono">
              {{ displayProvinces }}
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.t.home.statProvinces }}
            </div>
          </div>

          <!-- Districts -->
          <div class="gsap-stat-card space-y-1 p-2 rounded-xl hover:bg-zinc-100/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-mono">
              {{ displayDistricts }}
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.t.home.statDistricts }}
            </div>
          </div>

          <!-- Communes -->
          <div class="gsap-stat-card space-y-1 p-2 rounded-xl hover:bg-zinc-100/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-mono">
              {{ displayCommunes }}
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.t.home.statCommunes }}
            </div>
          </div>

          <!-- Villages -->
          <div class="gsap-stat-card space-y-1 p-2 rounded-xl hover:bg-zinc-100/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-mono">
              {{ displayVillages }}
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.t.home.statVillages }}
            </div>
          </div>

          <!-- Population -->
          <div class="gsap-stat-card space-y-1 p-2 rounded-xl hover:bg-zinc-100/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 font-mono">
              {{ displayPopulation }}
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.t.home.statPopulation }}
            </div>
          </div>

          <!-- Latency -->
          <div class="gsap-stat-card col-span-2 sm:col-span-3 lg:col-span-1 space-y-1 p-2 rounded-xl hover:bg-emerald-50/60 transition-colors duration-200 flex flex-col items-center justify-center">
            <div class="whitespace-nowrap flex items-center justify-center gap-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-600 font-mono">
              <span>{{ displayLatency }}</span>
              <span class="relative flex h-2 w-2 shrink-0">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div class="whitespace-nowrap text-xs font-semibold text-zinc-500 font-battambang">
              {{ langStore.currentLang === 'km' ? 'ល្បឿនមធ្យម' : 'Average Latency' }}
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Clean Core Features Grid -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[85%] max-w-[1440px] px-2 sm:px-4 space-y-8 sm:space-y-10">
      <div class="space-y-2.5 text-center max-w-3xl mx-auto">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">{{ langStore.t.home.featuresTitle }}</h2>
        <p class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          {{ langStore.t.home.featuresSubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
        <!-- Feature 1 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3 text-center flex flex-col items-center">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <GlobeIcon class="w-5 h-5 text-zinc-800" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature4Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed max-w-xs">
            {{ langStore.t.home.feature4Desc }}
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3 text-center flex flex-col items-center">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <Building2Icon class="w-5 h-5 text-zinc-800" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature1Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed max-w-xs">
            {{ langStore.t.home.feature1Desc }}
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-2xs hover:shadow-subtle hover:border-zinc-300 transition-all space-y-3 text-center flex flex-col items-center">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900">
            <ZapIcon class="w-5 h-5 text-amber-600" />
          </div>
          <h3 class="text-sm font-bold text-zinc-900">{{ langStore.t.home.feature3Title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed max-w-xs">
            {{ langStore.t.home.feature3Desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- Interactive Cambodia GeoJSON Map Section -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[85%] max-w-[1440px] px-2 sm:px-4 space-y-6">
      <div class="text-center space-y-2 max-w-2xl mx-auto border-b border-zinc-200/80 pb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Spatial Intelligence</h2>
        <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          {{ langStore.t.explorer.mapLayers }}
        </p>
        <div>
          <router-link
            to="/explorer"
            class="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline inline-flex items-center gap-1.5"
          >
            <span>{{ langStore.t.home.exploreBtn }}</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <CambodiaMap />
    </section>

    <!-- Interactive Developer Console — Under Map GeoJSON -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[85%] max-w-[1440px] px-2 sm:px-4 space-y-6 text-left">
      <div class="text-center space-y-2 max-w-2xl mx-auto border-b border-zinc-200/80 pb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Developer API Client & Console</h2>
        <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          {{ langStore.currentLang === 'km' ? 'សាកល្បងហៅ API ផ្ទាល់ (Code & JSON)' : 'Interactive API Endpoints & Code Snippets' }}
        </p>
        <div>
          <router-link
            to="/docs"
            class="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline inline-flex items-center gap-1.5"
          >
            <span>{{ langStore.t.home.docsBtn }}</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <div class="rounded-2xl border border-zinc-200/90 bg-white shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-zinc-300">
        <!-- Terminal Title Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 bg-zinc-50/90 px-3.5 sm:px-4 py-2.5 gap-2.5">
          <div class="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
            <div class="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
              <div class="h-2.5 w-2.5 rounded-full bg-rose-400/80 hover:bg-rose-500 transition-colors cursor-pointer"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-amber-400/80 hover:bg-amber-500 transition-colors cursor-pointer"></div>
              <div class="h-2.5 w-2.5 rounded-full bg-emerald-400/80 hover:bg-emerald-500 transition-colors cursor-pointer"></div>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                v-for="(ep, idx) in heroEndpoints"
                :key="ep.id"
                @click="activeEndpointIdx = idx"
                :class="[
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
                  activeEndpointIdx === idx
                    ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
                    : 'text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900'
                ]"
              >
                <component :is="ep.icon" class="w-3.5 h-3.5 shrink-0" />
                <span class="font-mono text-[11px]">{{ ep.title }}</span>
                <span class="font-battambang text-[10px] opacity-80" v-if="langStore.currentLang === 'km'">{{ ep.kmTag }}</span>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>HTTP 200 • {{ statusStore.latencyMs }}ms</span>
            </span>
          </div>
        </div>

        <!-- Console Dual View -->
        <div class="grid grid-cols-1 gap-0 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100">
          <div class="lg:col-span-5 p-3.5 sm:p-5 space-y-3 bg-zinc-50/40">
            <div class="flex items-center justify-between text-xs text-zinc-500">
              <span class="font-bold uppercase tracking-wider text-zinc-800 text-[11px] flex items-center gap-1.5">
                <ZapIcon class="w-3.5 h-3.5 text-amber-500" />
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
          <div class="lg:col-span-7 p-3.5 sm:p-5 space-y-3">
            <div class="flex items-center justify-between text-xs text-zinc-500">
              <div class="flex items-center gap-2">
                <span class="font-bold uppercase tracking-wider text-zinc-800 text-[11px] flex items-center gap-1.5">
                  <FileCodeIcon class="w-3.5 h-3.5 text-zinc-500" />
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
    </section>

    <!-- Embedded Interactive Quick Playground -->
    <section class="mx-auto w-[92%] sm:w-[88%] lg:w-[85%] max-w-[1440px] px-2 sm:px-4 space-y-6">
      <div class="text-center space-y-2 max-w-2xl mx-auto border-b border-zinc-200/80 pb-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Playground</h2>
        <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
          {{ langStore.t.apis.title }}
        </p>
        <div>
          <router-link
            to="/explorer"
            class="text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:underline inline-flex items-center gap-1.5"
          >
            <span>{{ langStore.t.nav.openExplorer }}</span>
            <ArrowRightIcon class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

      <ApiExplorer />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
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
  Landmark as LandmarkIcon,
  BarChart3 as BarChart3Icon,
  Mail as MailIcon,
  Search as SearchIcon,
  FileCode as FileCodeIcon,
  Building2 as Building2Icon,
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
const statsSectionRef = ref<HTMLElement | null>(null);

// Reactive statistics for scroll animation
const statsState = reactive({
  provinces: 0,
  districts: 0,
  communes: 0,
  villages: 0,
  population: 0,
  latency: 50,
  hasAnimated: false,
});

function toKhmerDigits(numStr: string | number): string {
  const kmDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(numStr).replace(/[0-9]/g, (d) => kmDigits[parseInt(d, 10)]);
}

const displayProvinces = computed(() => {
  const val = Math.round(statsState.provinces);
  return langStore.currentLang === 'km' ? toKhmerDigits(val) : val.toString();
});

const displayDistricts = computed(() => {
  const val = Math.round(statsState.districts);
  return langStore.currentLang === 'km' ? toKhmerDigits(val) : val.toString();
});

const displayCommunes = computed(() => {
  const val = Math.round(statsState.communes).toLocaleString();
  return langStore.currentLang === 'km' ? toKhmerDigits(val) : val;
});

const displayVillages = computed(() => {
  const val = Math.round(statsState.villages).toLocaleString();
  return langStore.currentLang === 'km' ? toKhmerDigits(val) : val;
});

const displayPopulation = computed(() => {
  const val = statsState.population;
  if (langStore.currentLang === 'km') {
    return val >= 17.3 ? '១៧.៣\u00A0លាន' : `${toKhmerDigits(val.toFixed(1))}\u00A0លាន`;
  }
  return `${val.toFixed(1)}M`;
});

const displayLatency = computed(() => {
  const val = Math.round(statsState.latency);
  return `< ${val}ms`;
});

let statsObserver: IntersectionObserver | null = null;

function startStatsAnimation() {
  if (statsState.hasAnimated) return;
  statsState.hasAnimated = true;

  // Stagger cards entrance
  gsap.fromTo(
    '.gsap-stat-card',
    { opacity: 0, y: 24, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.65, ease: 'back.out(1.4)' }
  );

  // Smooth count up numbers
  gsap.to(statsState, {
    provinces: 25,
    districts: 210,
    communes: 1661,
    villages: 14528,
    population: 17.3,
    latency: 8,
    duration: 1.8,
    ease: 'power2.out',
  });
}

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // GSAP Smooth Entrance Timeline for Hero
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    '.gsap-hero-title',
    { opacity: 0, y: 30, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, delay: 0.15 }
  )
  .fromTo(
    '.gsap-hero-subtitle',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.6'
  )
  .fromTo(
    '.gsap-video-container',
    { opacity: 0, scale: 0.96, y: 25 },
    { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power2.out' },
    '-=0.5'
  )
  .fromTo(
    '.gsap-hero-cta',
    { opacity: 0, y: 20, scale: 0.92 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'back.out(1.4)' },
    '-=0.6'
  );

  // IntersectionObserver for Stats section on scroll
  if (statsSectionRef.value) {
    statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startStatsAnimation();
            if (statsObserver && statsSectionRef.value) {
              statsObserver.unobserve(statsSectionRef.value);
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    statsObserver.observe(statsSectionRef.value);
  }

  statusStore.checkHealth();
  statusStore.fetchStatistics();
});

onUnmounted(() => {
  if (statsObserver) {
    statsObserver.disconnect();
  }
});

const heroEndpoints = [
  {
    id: 'provinces',
    title: '/provinces',
    icon: LandmarkIcon,
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
    icon: BarChart3Icon,
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
    icon: MailIcon,
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
    icon: SearchIcon,
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
    const fullCmd = `curl -X GET "https://khmerapi.lorndavid.online/api/v1/${activeHeroEndpoint.value.path}" -H "Accept: application/json"`;
    await navigator.clipboard.writeText(fullCmd);
    urlCopied.value = true;
    setTimeout(() => {
      urlCopied.value = false;
    }, 2000);
  } catch (_err) {
    // Fallback
  }
}
</script>
