<template>
  <div class="mx-auto w-[90%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 py-8 space-y-6 font-battambang">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
      <div class="space-y-1">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
          {{ langStore.t.explorer.title }}
        </h1>
        <p class="text-xs sm:text-sm text-zinc-500 max-w-2xl leading-relaxed">
          {{ langStore.t.explorer.subtitle }}
        </p>
      </div>

      <!-- Mode Selector Switch -->
      <div class="flex flex-wrap items-center rounded-lg border border-zinc-200 bg-zinc-100/90 p-1 text-xs font-medium text-zinc-600 shadow-2xs self-start sm:self-auto">
        <button
          @click="activeMode = 'map'"
          class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 transition-all cursor-pointer"
          :class="activeMode === 'map' ? 'bg-white font-bold text-zinc-900 shadow-sm' : 'hover:text-zinc-900'"
        >
          <MapIcon class="w-3.5 h-3.5 text-zinc-800" />
          <span>{{ langStore.currentLang === 'km' ? 'ផែនទីអន្តរកម្ម GeoJSON' : 'Interactive Map' }}</span>
        </button>
        <button
          @click="activeMode = 'browser'"
          class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 transition-all cursor-pointer"
          :class="activeMode === 'browser' ? 'bg-white font-bold text-zinc-900 shadow-sm' : 'hover:text-zinc-900'"
        >
          <LayersIcon class="w-3.5 h-3.5 text-zinc-800" />
          <span>{{ langStore.currentLang === 'km' ? 'ឋានានុក្រម ៤ ថ្នាក់ (១៤,៥២៨ ភូមិ)' : 'Data Hierarchy (14,528 Villages)' }}</span>
        </button>
        <button
          @click="activeMode = 'sandbox'"
          class="flex items-center gap-1.5 rounded-md px-3.5 py-1.5 transition-all cursor-pointer"
          :class="activeMode === 'sandbox' ? 'bg-white font-bold text-zinc-900 shadow-sm' : 'hover:text-zinc-900'"
        >
          <TerminalIcon class="w-3.5 h-3.5 text-zinc-800" />
          <span>API Sandbox</span>
        </button>
      </div>
    </div>

    <!-- Tab 1: Interactive GeoJSON Map -->
    <div v-if="activeMode === 'map'" class="space-y-4">
      <CambodiaMap />
    </div>

    <!-- Tab 2: Interactive Hierarchy Browser -->
    <div v-else-if="activeMode === 'browser'" class="space-y-6">
      <!-- 3-Column Hierarchy Explorer -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
        <!-- 1. Provinces Column -->
        <div class="lg:col-span-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
              {{ langStore.t.explorer.step1 }} ({{ provinces.length }})
            </span>
            <span class="text-[10px] font-mono text-zinc-400">Step 1</span>
          </div>

          <div class="relative">
            <input
              v-model="provinceSearch"
              type="text"
              :placeholder="langStore.t.explorer.selectProvince"
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div class="max-h-[420px] overflow-y-auto space-y-1 pr-1 divide-y divide-zinc-50">
            <button
              v-for="p in filteredProvinces"
              :key="p.code"
              @click="selectProvince(p)"
              class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer"
              :class="selectedProvince?.code === p.code ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-100 text-zinc-800'"
            >
              <div class="truncate">
                <span class="font-km mr-1.5">{{ p.name_km }}</span>
                <span class="opacity-80 font-sans">({{ p.name_en }})</span>
              </div>
              <span class="font-mono text-[10px] opacity-70 ml-2 shrink-0">{{ p.code }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Districts Column -->
        <div class="lg:col-span-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
              {{ langStore.t.explorer.step2 }} ({{ districts.length }})
            </span>
            <span class="text-[10px] font-mono text-zinc-400">Step 2</span>
          </div>

          <div class="relative">
            <input
              v-model="districtSearch"
              type="text"
              :placeholder="langStore.t.explorer.selectDistrict"
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div v-if="isLoadingDistricts" class="p-8 text-center text-xs text-zinc-500">
            Loading districts...
          </div>

          <div v-else-if="filteredDistricts.length === 0" class="p-8 text-center text-xs text-zinc-400">
            {{ langStore.t.explorer.noDistricts }}
          </div>

          <div v-else class="max-h-[420px] overflow-y-auto space-y-1 pr-1 divide-y divide-zinc-50">
            <button
              v-for="d in filteredDistricts"
              :key="d.code"
              @click="selectDistrict(d)"
              class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer"
              :class="selectedDistrict?.code === d.code ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-100 text-zinc-800'"
            >
              <div class="truncate">
                <span class="font-km mr-1.5">{{ d.name_km }}</span>
                <span class="opacity-80 font-sans">({{ d.name_en }})</span>
              </div>
              <span class="font-mono text-[10px] opacity-70 ml-2 shrink-0">{{ d.code }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Communes Column -->
        <div class="lg:col-span-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
              {{ langStore.t.explorer.step3 }} ({{ communes.length }})
            </span>
            <span class="text-[10px] font-mono text-zinc-400">Step 3</span>
          </div>

          <div class="relative">
            <input
              v-model="communeSearch"
              type="text"
              :placeholder="langStore.t.explorer.selectCommune"
              class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div v-if="isLoadingCommunes" class="p-8 text-center text-xs text-zinc-500">
            Loading communes...
          </div>

          <div v-else-if="filteredCommunes.length === 0" class="p-8 text-center text-xs text-zinc-400">
            {{ langStore.t.explorer.noCommunes }}
          </div>

          <div v-else class="max-h-[420px] overflow-y-auto space-y-1 pr-1 divide-y divide-zinc-50">
            <button
              v-for="c in filteredCommunes"
              :key="c.code"
              @click="selectCommune(c)"
              class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors cursor-pointer"
              :class="selectedCommune?.code === c.code ? 'bg-zinc-900 text-white font-semibold' : 'hover:bg-zinc-100 text-zinc-800'"
            >
              <div class="truncate">
                <span class="font-km mr-1.5">{{ c.name_km }}</span>
                <span class="opacity-80 font-sans">({{ c.name_en }})</span>
              </div>
              <span class="font-mono text-[10px] opacity-70 ml-2 shrink-0">{{ c.code }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4. Selected Commune & Villages Grid -->
      <div v-if="selectedCommune" class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-km text-lg font-bold text-zinc-900">{{ selectedCommune.name_km }}</span>
              <span class="text-sm font-semibold text-zinc-700">({{ selectedCommune.name_en }})</span>
              <span class="font-mono text-xs bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded border border-zinc-200">
                Code: {{ selectedCommune.code }}
              </span>
              <span class="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                {{ villages.length }} Villages
              </span>
            </div>
            <div class="text-xs text-zinc-500 font-medium">
              {{ selectedProvince?.name_en }} &rarr; {{ selectedDistrict?.name_en }} &rarr; {{ selectedCommune.name_en }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="copyLocationTreeApi"
              class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-pointer shadow-2xs"
            >
              <component :is="treeCopied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5 text-zinc-500" />
              <span>{{ treeCopied ? langStore.t.common.copied : `/api/v1/locations/${selectedCommune.code}` }}</span>
            </button>
          </div>
        </div>

        <!-- Villages list -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-700">
              {{ langStore.t.explorer.step4 }} ({{ villages.length }})
            </h4>
            <span class="text-[11px] font-mono text-zinc-400">Level 4: Phum</span>
          </div>

          <div v-if="isLoadingVillages" class="py-6 text-center text-xs text-zinc-500">
            Loading villages...
          </div>

          <div v-else-if="villages.length === 0" class="py-6 text-center text-xs text-zinc-400">
            {{ langStore.t.explorer.noVillages }}
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="v in villages"
              :key="v.code"
              class="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 space-y-1 hover:bg-white hover:border-zinc-300 hover:shadow-2xs transition-all"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-km font-bold text-zinc-900 truncate">{{ v.name_km }}</span>
                <span class="font-mono text-[10px] text-zinc-500 shrink-0 ml-1">{{ v.code }}</span>
              </div>
              <div class="text-[11px] text-zinc-600 truncate">{{ v.name_en }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Full API Sandbox -->
    <div v-else>
      <ApiExplorer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Map as MapIcon,
  Layers as LayersIcon,
  Terminal as TerminalIcon,
  Copy as CopyIcon,
  Check as CheckIcon
} from 'lucide-vue-next';
import axios from 'axios';
import CambodiaMap from '../components/explorer/CambodiaMap.vue';
import ApiExplorer from '../components/explorer/ApiExplorer.vue';
import { useLangStore } from '../stores/lang.store';

const langStore = useLangStore();
const activeMode = ref<'map' | 'browser' | 'sandbox'>('browser');

const provinces = ref<any[]>([]);
const provinceSearch = ref('');
const filteredProvinces = computed(() => {
  if (!provinceSearch.value.trim()) return provinces.value;
  const q = provinceSearch.value.toLowerCase();
  return provinces.value.filter(p =>
    (p.name_en && p.name_en.toLowerCase().includes(q)) ||
    (p.name_km && p.name_km.includes(q)) ||
    (p.code && p.code.includes(q))
  );
});

const selectedProvince = ref<any>(null);

const districts = ref<any[]>([]);
const districtSearch = ref('');
const filteredDistricts = computed(() => {
  if (!districtSearch.value.trim()) return districts.value;
  const q = districtSearch.value.toLowerCase();
  return districts.value.filter(d =>
    (d.name_en && d.name_en.toLowerCase().includes(q)) ||
    (d.name_km && d.name_km.includes(q)) ||
    (d.code && d.code.includes(q))
  );
});
const isLoadingDistricts = ref(false);
const selectedDistrict = ref<any>(null);

const communes = ref<any[]>([]);
const communeSearch = ref('');
const filteredCommunes = computed(() => {
  if (!communeSearch.value.trim()) return communes.value;
  const q = communeSearch.value.toLowerCase();
  return communes.value.filter(c =>
    (c.name_en && c.name_en.toLowerCase().includes(q)) ||
    (c.name_km && c.name_km.includes(q)) ||
    (c.code && c.code.includes(q))
  );
});
const isLoadingCommunes = ref(false);
const selectedCommune = ref<any>(null);

const villages = ref<any[]>([]);
const isLoadingVillages = ref(false);
const treeCopied = ref(false);

async function fetchProvinces() {
  try {
    const res = await axios.get('/api/v1/provinces?limit=100');
    if (res.data?.data) {
      provinces.value = Array.isArray(res.data.data) ? res.data.data : [];
      if (provinces.value.length > 0) {
        selectProvince(provinces.value[0]);
      }
    }
  } catch (_e) {
    // fallback
  }
}

async function selectProvince(p: any) {
  selectedProvince.value = p;
  selectedDistrict.value = null;
  selectedCommune.value = null;
  districts.value = [];
  communes.value = [];
  villages.value = [];

  isLoadingDistricts.value = true;
  try {
    const res = await axios.get(`/api/v1/provinces/${p.code}/districts?limit=100`);
    const rawData = res.data?.data;
    if (rawData && rawData.districts && Array.isArray(rawData.districts)) {
      districts.value = rawData.districts;
    } else if (Array.isArray(rawData)) {
      districts.value = rawData;
    } else {
      districts.value = [];
    }

    if (districts.value.length > 0) {
      selectDistrict(districts.value[0]);
    }
  } catch (_e) {
    districts.value = [];
  } finally {
    isLoadingDistricts.value = false;
  }
}

async function selectDistrict(d: any) {
  selectedDistrict.value = d;
  selectedCommune.value = null;
  communes.value = [];
  villages.value = [];

  isLoadingCommunes.value = true;
  try {
    const res = await axios.get(`/api/v1/districts/${d.code}/communes?limit=100`);
    const rawData = res.data?.data;
    if (rawData && rawData.communes && Array.isArray(rawData.communes)) {
      communes.value = rawData.communes;
    } else if (Array.isArray(rawData)) {
      communes.value = rawData;
    } else {
      communes.value = [];
    }

    if (communes.value.length > 0) {
      selectCommune(communes.value[0]);
    }
  } catch (_e) {
    communes.value = [];
  } finally {
    isLoadingCommunes.value = false;
  }
}

async function selectCommune(c: any) {
  selectedCommune.value = c;
  villages.value = [];

  isLoadingVillages.value = true;
  try {
    const res = await axios.get(`/api/v1/communes/${c.code}/villages?limit=200`);
    const rawData = res.data?.data;
    if (rawData && rawData.villages && Array.isArray(rawData.villages)) {
      villages.value = rawData.villages;
    } else if (Array.isArray(rawData)) {
      villages.value = rawData;
    } else {
      villages.value = [];
    }
  } catch (_e) {
    villages.value = [];
  } finally {
    isLoadingVillages.value = false;
  }
}

async function copyLocationTreeApi() {
  if (selectedCommune.value) {
    try {
      await navigator.clipboard.writeText(`https://khmerapi.lorndavid.online/api/v1/locations/${selectedCommune.value.code}`);
      treeCopied.value = true;
      setTimeout(() => {
        treeCopied.value = false;
      }, 2000);
    } catch (_e) {
      // fallback
    }
  }
}

onMounted(() => {
  fetchProvinces();
});
</script>
