<template>
  <aside class="w-64 shrink-0 py-6 pr-6 border-r border-zinc-200/80 hidden md:block">
    <div class="sticky top-20 space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
      <!-- Search Filter in Sidebar -->
      <div class="relative">
        <SearchIcon class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="langStore.t.docs.filterEndpoints"
          class="w-full rounded-lg border border-zinc-200 bg-zinc-50/70 pl-8 pr-7 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-2 text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5 rounded"
        >
          <XIcon class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Filtered Results or Categorized Navigation -->
      <div v-if="filteredGroups.length === 0" class="py-4 text-center text-xs text-zinc-400">
        {{ langStore.currentLang === 'km' ? 'រកមិនឃើញ Endpoint ដែលត្រូវគ្នាទេ' : 'No matching endpoints found' }}
      </div>

      <nav v-else class="space-y-6 text-xs font-battambang">
        <div v-for="group in filteredGroups" :key="group.title" class="space-y-1.5">
          <!-- Group Title -->
          <div class="flex items-center justify-between px-2.5">
            <h5 class="font-bold uppercase tracking-wider text-[11px] text-zinc-900">
              {{ group.title }}
            </h5>
            <span v-if="group.badge" class="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500 border border-zinc-200">
              {{ group.badge }}
            </span>
          </div>

          <!-- Items -->
          <div class="space-y-0.5">
            <a
              v-for="item in group.items"
              :key="item.id"
              :href="`#${item.id}`"
              @click.prevent="handleNavigate(item.id)"
              :class="[
                'flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-all group cursor-pointer',
                activeId === item.id
                  ? 'bg-zinc-900 text-white font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              ]"
            >
              <div class="flex items-center gap-2 truncate">
                <span
                  v-if="item.method"
                  class="font-mono text-[10px] font-bold"
                  :class="activeId === item.id ? 'text-emerald-300' : 'text-emerald-600'"
                >
                  {{ item.method }}
                </span>
                <span class="truncate">{{ langStore.currentLang === 'km' && item.kmLabel ? item.kmLabel : item.label }}</span>
              </div>
              <span
                v-if="item.kmLabel && langStore.currentLang !== 'km'"
                class="font-km text-[11px] shrink-0 ml-2 text-zinc-400 group-hover:text-zinc-500"
                :class="activeId === item.id ? 'text-zinc-300' : ''"
              >
                {{ item.kmLabel }}
              </span>
            </a>
          </div>
        </div>
      </nav>

      <!-- Quick Platform Links Footer -->
      <div class="pt-4 border-t border-zinc-100 space-y-1 text-xs font-battambang">
        <router-link
          to="/explorer"
          class="flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <span>{{ langStore.t.nav.explorer }}</span>
          <span class="text-zinc-400 text-[10px]">↗</span>
        </router-link>
        <router-link
          to="/status"
          class="flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <span>{{ langStore.t.nav.status }}</span>
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
        </router-link>
        <a
          href="/docs/openapi.json"
          target="_blank"
          class="flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
        >
          <span>OpenAPI 3.1 Spec</span>
          <span class="text-zinc-400 text-[10px]">JSON</span>
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Search as SearchIcon, X as XIcon } from 'lucide-vue-next';
import { smoothScrollTo } from '../../utils/smoothScroll';
import { useLangStore } from '../../stores/lang.store';

const props = defineProps<{
  activeId?: string;
}>();

const router = useRouter();
const route = useRoute();
const langStore = useLangStore();
const searchQuery = ref('');

interface NavItem {
  id: string;
  label: string;
  method?: 'GET' | 'POST';
  kmLabel?: string;
  keywords?: string[];
}

interface NavGroup {
  title: string;
  badge?: string;
  items: NavItem[];
}

const navGroups = computed<NavGroup[]>(() => {
  const isKm = langStore.currentLang === 'km';
  return [
    {
      title: isKm ? 'ទិដ្ឋភាពទូទៅ' : 'Overview',
      items: [
        { id: 'getting-started', label: 'Getting Started', kmLabel: 'ការណែនាំដំបូង', keywords: ['overview', 'base url', 'quickstart'] },
        { id: 'response-format', label: 'Response Format', kmLabel: 'ទម្រង់ឆ្លើយតប', keywords: ['json', 'envelope', 'meta', 'errors'] },
        { id: 'rate-limits', label: 'Rate Limits', kmLabel: 'កម្រិតសំណើ', keywords: ['throttle', 'quotas', 'headers'] },
      ],
    },
    {
      title: isKm ? 'ទិន្នន័យរដ្ឋបាល' : 'Administrative Data',
      badge: isKm ? '៥ Endpoints' : '5 Endpoints',
      items: [
        { id: 'provinces', label: 'Provinces', method: 'GET', kmLabel: 'ខេត្ត/រាជធានី', keywords: ['provinces', 'capital', 'phnom penh'] },
        { id: 'districts', label: 'Districts', method: 'GET', kmLabel: 'ស្រុក/ខណ្ឌ', keywords: ['districts', 'khan', 'srok', 'krong'] },
        { id: 'communes', label: 'Communes', method: 'GET', kmLabel: 'ឃុំ/សង្កាត់', keywords: ['communes', 'sangkat', 'khum'] },
        { id: 'villages', label: 'Villages', method: 'GET', kmLabel: 'ភូមិ', keywords: ['villages', 'phum'] },
        { id: 'locations', label: 'Address Tree', method: 'GET', kmLabel: 'ឋានានុក្រមពេញលេញ', keywords: ['tree', 'hierarchy', 'complete'] },
      ],
    },
    {
      title: isKm ? 'លេខប្រៃសណីយ៍ & ផែនទី' : 'Postal & Spatial',
      items: [
        { id: 'postal-codes', label: 'Postal Codes', method: 'GET', kmLabel: 'លេខកូដប្រៃសណីយ៍', keywords: ['postal', 'zipcode', '12000'] },
        { id: 'geo', label: 'GeoJSON Layers', method: 'GET', kmLabel: 'ស្រទាប់ព្រំប្រទល់ GeoJSON', keywords: ['geojson', 'coordinates', 'gis', 'boundaries'] },
      ],
    },
    {
      title: isKm ? 'សេវាកម្ម & ប្រជាសាស្ត្រ' : 'Services & Demographics',
      items: [
        { id: 'search', label: 'Universal Search', method: 'GET', kmLabel: 'ស្វែងរកទូទៅ', keywords: ['search', 'query', 'khmer search'] },
        { id: 'demographics', label: 'Population & Demographics', method: 'GET', kmLabel: 'ស្ថិតិប្រជាសាស្ត្រ', keywords: ['population', 'census', 'demographics', '17.3M', '1962'] },
        { id: 'statistics', label: 'Statistics', method: 'GET', kmLabel: 'ស្ថិតិទូទៅ', keywords: ['statistics', 'counts', 'summary'] },
        { id: 'health', label: 'Health & Status', method: 'GET', kmLabel: 'សុខភាពប្រព័ន្ធ', keywords: ['health', 'ping', 'redis', 'db'] },
      ],
    },
  ];
});

const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return navGroups.value;

  return navGroups.value
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        const matchLabel = item.label.toLowerCase().includes(q);
        const matchKm = item.kmLabel ? item.kmLabel.includes(q) : false;
        const matchKeywords = item.keywords ? item.keywords.some((k) => k.toLowerCase().includes(q)) : false;
        return matchLabel || matchKm || matchKeywords;
      });
      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
});

async function handleNavigate(id: string) {
  if (route.path !== '/docs') {
    await router.push('/docs');
  }
  smoothScrollTo(id, 84, 0.55);
}
</script>
