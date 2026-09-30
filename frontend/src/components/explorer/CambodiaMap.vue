<template>
  <div class="relative w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-card">
    <!-- Map Top Bar: Layer Switchers, Search & Controls -->
    <div class="flex flex-col gap-2.5 border-b border-zinc-200/90 bg-zinc-50/90 px-4 py-3 text-xs">
      
      <!-- Primary Controls Row -->
      <div class="flex flex-wrap items-center justify-between gap-2.5">
        <!-- Layer Selector Pill Group -->
        <div class="flex flex-wrap items-center gap-1 bg-white border border-zinc-200/90 rounded-lg p-1 shadow-2xs">
          <button
            v-for="layer in LAYERS"
            :key="layer.id"
            @click="changeLayer(layer.id)"
            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer select-none"
            :class="activeLayerId === layer.id ? 'bg-zinc-900 text-white shadow-2xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'"
          >
            <component :is="layer.icon" class="w-3.5 h-3.5" />
            <span>{{ layer.label }}</span>
            <span class="text-[10px] opacity-70 font-mono">({{ layer.count }})</span>
          </button>
        </div>

        <!-- Right controls: Search, Basemap & Reset View -->
        <div class="flex items-center gap-2">
          <!-- Search filter input -->
          <div class="relative w-44 sm:w-60">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search province, district, commune..."
              class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none placeholder:text-zinc-400 font-sans shadow-2xs"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; handleSearch();"
              class="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-700 cursor-pointer p-0.5 rounded"
            >
              <XIcon class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Basemap Style Switcher -->
          <select
            v-model="selectedBasemap"
            @change="updateBasemap"
            class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="light">Clean Light (Esri)</option>
            <option value="dark">Dark Matter (Esri)</option>
            <option value="osm">OpenStreetMap</option>
            <option value="satellite">Satellite Imagery</option>
          </select>

          <!-- Reset Button -->
          <button
            @click="resetView"
            title="Reset Map View"
            class="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcwIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Real Hierarchy Drilldown Bar (Province > District > Commune > Villages) -->
      <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-200/60 font-sans">
        <span class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <ZapIcon class="w-3.5 h-3.5 text-amber-500" />
          <span>Fast Drilldown:</span>
        </span>

        <!-- Province Selector -->
        <select
          v-model="selectedProvinceCode"
          @change="onProvinceChange"
          class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 focus:border-zinc-900 focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="">-- Select Province (25) --</option>
          <option
            v-for="prov in provinceList"
            :key="prov.code"
            :value="prov.code"
          >
            {{ prov.name_en }} ({{ prov.name_km }})
          </option>
        </select>

        <span class="text-zinc-300 font-bold" v-if="selectedProvinceCode">›</span>

        <!-- District Selector -->
        <select
          v-if="selectedProvinceCode"
          v-model="selectedDistrictCode"
          @change="onDistrictChange"
          class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 focus:border-zinc-900 focus:outline-none shadow-2xs cursor-pointer animate-fade-in"
        >
          <option value="">-- Select District ({{ districtList.length }}) --</option>
          <option
            v-for="dist in districtList"
            :key="dist.code"
            :value="dist.code"
          >
            {{ dist.name_en }} ({{ dist.name_km }})
          </option>
        </select>

        <span class="text-zinc-300 font-bold" v-if="selectedDistrictCode">›</span>

        <!-- Commune Selector -->
        <select
          v-if="selectedDistrictCode"
          v-model="selectedCommuneCode"
          @change="onCommuneChange"
          class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-800 focus:border-zinc-900 focus:outline-none shadow-2xs cursor-pointer animate-fade-in"
        >
          <option value="">-- Select Commune ({{ communeList.length }}) --</option>
          <option
            v-for="com in communeList"
            :key="com.code"
            :value="com.code"
          >
            {{ com.name_en }} ({{ com.name_km }})
          </option>
        </select>

        <!-- Live Village Status Badge -->
        <div v-if="villageList.length > 0" class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs text-emerald-800 font-mono font-semibold ml-auto">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{{ villageList.length }} Real Villages</span>
        </div>
      </div>

    </div>

    <!-- Map Canvas Container & Floating Info Overlays -->
    <div class="relative w-full h-[650px] bg-zinc-100">
      <!-- The Leaflet DOM Node -->
      <div ref="mapContainer" class="w-full h-full z-0"></div>

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-xs transition-opacity"
      >
        <div class="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-elevated">
          <Loader2Icon class="w-4 h-4 animate-spin text-zinc-900" />
          <span class="text-xs font-medium text-zinc-800">Loading {{ currentLayerLabel }} data...</span>
        </div>
      </div>

      <!-- Floating Hover Tooltip Pill (Top Left of Map) -->
      <div
        v-if="hoveredFeature"
        class="absolute top-4 left-4 z-10 pointer-events-none rounded-xl border border-zinc-200/90 bg-white/95 px-3.5 py-2.5 shadow-elevated backdrop-blur-md space-y-1 max-w-xs transition-all"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold text-xs text-zinc-900 truncate">{{ getFeatureName(hoveredFeature) }}</span>
          <span class="font-mono text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            {{ getFeaturePcode(hoveredFeature) }}
          </span>
        </div>
        <div v-if="getFeatureKhmer(hoveredFeature)" class="font-km text-xs text-zinc-700">
          {{ getFeatureKhmer(hoveredFeature) }}
        </div>
        <div class="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
          <span v-if="hoveredFeature.properties?.adm1_name">Prov: {{ hoveredFeature.properties.adm1_name }}</span>
          <span v-if="hoveredFeature.properties?.adm2_name">Dist: {{ hoveredFeature.properties.adm2_name }}</span>
          <span v-if="hoveredFeature.properties?.area_sqkm">Area: {{ Math.round(hoveredFeature.properties.area_sqkm).toLocaleString() }} km²</span>
        </div>
      </div>

      <!-- Floating Feature & Villages Details Drawer (Right Side on Selection) -->
      <transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transform transition ease-in-out duration-200"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-if="selectedFeature || selectedVillage"
          class="absolute top-4 right-4 bottom-4 w-84 sm:w-96 z-20 rounded-2xl border border-zinc-200/90 bg-white/95 p-4 sm:p-5 shadow-elevated backdrop-blur-md overflow-y-auto space-y-4 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Header with Close Button -->
            <div class="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="rounded bg-zinc-100 text-zinc-700 font-mono font-bold text-[10px] px-2 py-0.5 border border-zinc-200">
                    {{ selectedVillage ? 'Village Details' : `${activeLayerLabel} Details` }}
                  </span>
                  <span v-if="villageList.length > 0" class="rounded bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] px-1.5 py-0.5 border border-emerald-200">
                    {{ villageList.length }} Villages
                  </span>
                </div>
                <h3 class="text-base font-extrabold text-zinc-900 mt-1">
                  {{ selectedVillage ? selectedVillage.name_en : getFeatureName(selectedFeature) }}
                </h3>
                <div class="font-km text-sm font-semibold text-zinc-700 mt-0.5">
                  {{ selectedVillage ? selectedVillage.name_km : (getFeatureKhmer(selectedFeature) || '') }}
                </div>
              </div>
              <button
                @click="closeDrawer"
                class="p-1 text-zinc-400 hover:text-zinc-800 rounded-md hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <XIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Property Table -->
            <div class="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-2 text-xs">
              <div class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Administrative Code:</span>
                <span class="font-mono font-bold text-zinc-900">
                  {{ selectedVillage ? selectedVillage.code : getFeaturePcode(selectedFeature) }}
                </span>
              </div>

              <div v-if="drawerProvinceName" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Province:</span>
                <span class="font-semibold text-zinc-900">{{ drawerProvinceName }}</span>
              </div>

              <div v-if="drawerDistrictName" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">District:</span>
                <span class="font-semibold text-zinc-900">{{ drawerDistrictName }}</span>
              </div>

              <div v-if="drawerCommuneName" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Commune:</span>
                <span class="font-semibold text-zinc-900">{{ drawerCommuneName }}</span>
              </div>

              <div v-if="selectedFeature?.properties?.area_sqkm" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Surface Area:</span>
                <span class="font-mono text-zinc-900">{{ Number(selectedFeature.properties.area_sqkm).toLocaleString(undefined, { maximumFractionDigits: 1 }) }} km²</span>
              </div>
            </div>

            <!-- Real Villages List Inside Selected Commune -->
            <div v-if="villageList.length > 0" class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-zinc-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <HomeIcon class="w-3.5 h-3.5 text-zinc-600" />
                  <span>Villages in Commune ({{ villageList.length }})</span>
                </span>
              </div>

              <div class="max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                <div
                  v-for="v in villageList"
                  :key="v.id"
                  @click="selectVillage(v)"
                  :class="[
                    'flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer select-none text-xs',
                    selectedVillage?.id === v.id
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-2xs font-semibold'
                      : 'bg-zinc-50/80 hover:bg-zinc-100/90 border-zinc-200/70 text-zinc-800'
                  ]"
                >
                  <div class="truncate mr-2">
                    <span class="font-bold mr-1">{{ v.name_en }}</span>
                    <span class="font-km text-[11px] opacity-80">({{ v.name_km }})</span>
                  </div>
                  <span class="font-mono text-[10px] opacity-70 shrink-0">{{ v.code }}</span>
                </div>
              </div>
            </div>

            <!-- Quick API Endpoint Preview -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-semibold text-zinc-700 uppercase">Direct API Endpoint</span>
              <div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800">
                <span class="truncate">{{ activeApiUrl }}</span>
                <button
                  @click="copyText(activeApiUrl, 'api')"
                  class="ml-2 text-zinc-500 hover:text-zinc-900 shrink-0 font-sans text-xs cursor-pointer"
                >
                  {{ copiedApi ? 'Copied' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <button
              v-if="selectedFeature"
              @click="copyFeatureGeoJson"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-2 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
            >
              <component :is="copiedGeoJson ? CheckIcon : CopyIcon" class="w-3.5 h-3.5 text-zinc-600" />
              <span>{{ copiedGeoJson ? 'GeoJSON Copied!' : 'Copy Feature GeoJSON' }}</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Bottom Map Legend / Status Pill -->
      <div class="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-3 py-1 text-[11px] text-zinc-600 shadow-elevated backdrop-blur-sm">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-medium text-zinc-900">Cambodia GeoJSON & API Engine</span>
        <span class="text-zinc-300">|</span>
        <span class="font-mono text-zinc-500">{{ totalFeaturesRendered }} Features Loaded</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import {
  RotateCcw as RotateCcwIcon,
  Loader2 as Loader2Icon,
  Copy as CopyIcon,
  Check as CheckIcon,
  X as XIcon,
  Landmark as LandmarkIcon,
  Building2 as Building2Icon,
  Home as HomeIcon,
  MapPin as MapPinIcon,
  GitCommit as GitCommitIcon,
  Map as MapIcon,
  Zap as ZapIcon
} from 'lucide-vue-next';
import L from 'leaflet';
import axios from 'axios';

interface LayerMeta {
  id: 'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0';
  label: string;
  icon: any;
  count: string;
  file: string;
}

const LAYERS: LayerMeta[] = [
  { id: 'admin1', label: 'Provinces', icon: LandmarkIcon, count: '25', file: 'khm_admin1.geojson' },
  { id: 'admin2', label: 'Districts', icon: Building2Icon, count: '209', file: 'khm_admin2.geojson' },
  { id: 'admin3', label: 'Communes', icon: HomeIcon, count: '1,633', file: 'khm_admin3.geojson' },
  { id: 'points', label: 'Capitals & Points', icon: MapPinIcon, count: '1,856', file: 'khm_adminpoints.geojson' },
  { id: 'lines', label: 'Boundary Lines', icon: GitCommitIcon, count: '4,861', file: 'khm_adminlines.geojson' },
  { id: 'admin0', label: 'National Border', icon: MapIcon, count: '1', file: 'khm_admin0.geojson' },
];

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let tileLayer: L.TileLayer | null = null;
let geoJsonLayer: L.GeoJSON | null = null;
let villageMarkersGroup: L.LayerGroup | null = null;

const activeLayerId = ref<'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0'>('admin1');
const selectedBasemap = ref<'light' | 'dark' | 'osm' | 'satellite'>('light');
const isLoading = ref(false);
const totalFeaturesRendered = ref(25);
const searchQuery = ref('');

// Hierarchy State
const provinceList = ref<any[]>([]);
const districtList = ref<any[]>([]);
const communeList = ref<any[]>([]);
const villageList = ref<any[]>([]);

const selectedProvinceCode = ref('');
const selectedDistrictCode = ref('');
const selectedCommuneCode = ref('');
const selectedVillage = ref<any>(null);

const hoveredFeature = ref<any>(null);
const selectedFeature = ref<any>(null);

const copiedApi = ref(false);
const copiedGeoJson = ref(false);

const activeLayerLabel = computed(() => {
  return LAYERS.find(l => l.id === activeLayerId.value)?.label || 'Region';
});

const currentLayerLabel = computed(() => {
  return LAYERS.find(l => l.id === activeLayerId.value)?.label || 'Layer';
});

interface BasemapDef {
  url: string;
  attribution: string;
  maxZoom: number;
}

const BASEMAP_CONFIG: Record<'light' | 'dark' | 'osm' | 'satellite', BasemapDef> = {
  light: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &copy; OpenStreetMap',
    maxZoom: 16,
  },
  dark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a> &copy; OpenStreetMap',
    maxZoom: 16,
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a>, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
};

// Colors for province distinct styling
const PROVINCE_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6',
  '#E11D48', '#0EA5E9', '#D97706', '#9333EA', '#059669',
  '#2563EB', '#D946EF', '#4F46E5', '#16A34A', '#CA8A04',
  '#EA580C', '#7C3AED', '#0284C7', '#0D9488', '#BE185D'
];

function getFeatureColor(index: number) {
  return PROVINCE_COLORS[index % PROVINCE_COLORS.length];
}

const drawerProvinceName = computed(() => {
  if (selectedVillage.value?.commune?.district?.province?.name_en) {
    return `${selectedVillage.value.commune.district.province.name_en} (${selectedVillage.value.commune.district.province.name_km})`;
  }
  return selectedFeature.value?.properties?.adm1_name || null;
});

const drawerDistrictName = computed(() => {
  if (selectedVillage.value?.commune?.district?.name_en) {
    return `${selectedVillage.value.commune.district.name_en} (${selectedVillage.value.commune.district.name_km})`;
  }
  return selectedFeature.value?.properties?.adm2_name || null;
});

const drawerCommuneName = computed(() => {
  if (selectedVillage.value?.commune?.name_en) {
    return `${selectedVillage.value.commune.name_en} (${selectedVillage.value.commune.name_km})`;
  }
  return selectedFeature.value?.properties?.adm3_name || null;
});

const activeApiUrl = computed(() => {
  if (selectedVillage.value) {
    return `/api/v1/villages/${selectedVillage.value.code}`;
  }
  if (selectedFeature.value) {
    return getFeatureApiUrl(selectedFeature.value);
  }
  return '/api/v1/locations/12';
});

function initMap() {
  if (!mapContainer.value) return;

  // Initialize map centered at Cambodia's geographic center
  map = L.map(mapContainer.value, {
    center: [12.5657, 104.9910],
    zoom: 7,
    zoomControl: false,
    minZoom: 6,
    maxZoom: 18,
  });

  villageMarkersGroup = L.layerGroup().addTo(map);

  // Add zoom control to bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  updateBasemap();
  loadGeoJsonLayer(activeLayerId.value);
  loadProvinces();
}

function updateBasemap() {
  if (!map) return;
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  const config = BASEMAP_CONFIG[selectedBasemap.value] || BASEMAP_CONFIG.light;
  tileLayer = L.tileLayer(config.url, {
    attribution: config.attribution,
    maxZoom: config.maxZoom,
  }).addTo(map);
}

function resetView() {
  if (!map) return;
  map.setView([12.5657, 104.9910], 7, { animate: true });
  closeDrawer();
  searchQuery.value = '';
  selectedProvinceCode.value = '';
  selectedDistrictCode.value = '';
  selectedCommuneCode.value = '';
  districtList.value = [];
  communeList.value = [];
  villageList.value = [];
  if (villageMarkersGroup) {
    villageMarkersGroup.clearLayers();
  }
}

function closeDrawer() {
  selectedFeature.value = null;
  selectedVillage.value = null;
}

// ==========================================
// Hierarchy API Loaders (Real Data)
// ==========================================
async function loadProvinces() {
  try {
    const res = await axios.get('/api/v1/provinces?limit=30');
    if (res.data?.success) {
      provinceList.value = res.data.data || [];
    }
  } catch (_e) {
    // fallback if backend is starting
  }
}

async function onProvinceChange() {
  selectedDistrictCode.value = '';
  selectedCommuneCode.value = '';
  selectedVillage.value = null;
  districtList.value = [];
  communeList.value = [];
  villageList.value = [];
  if (villageMarkersGroup) villageMarkersGroup.clearLayers();

  if (!selectedProvinceCode.value) {
    resetView();
    return;
  }

  // Find and zoom to province on map
  zoomToAdminCode(`KH${selectedProvinceCode.value}`);

  try {
    const res = await axios.get(`/api/v1/districts?province_code=${selectedProvinceCode.value}&limit=50`);
    if (res.data?.success) {
      districtList.value = res.data.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch districts:', err);
  }
}

async function onDistrictChange() {
  selectedCommuneCode.value = '';
  selectedVillage.value = null;
  communeList.value = [];
  villageList.value = [];
  if (villageMarkersGroup) villageMarkersGroup.clearLayers();

  if (!selectedDistrictCode.value) return;

  zoomToAdminCode(`KH${selectedDistrictCode.value}`);

  try {
    const res = await axios.get(`/api/v1/communes?district_code=${selectedDistrictCode.value}&limit=100`);
    if (res.data?.success) {
      communeList.value = res.data.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch communes:', err);
  }
}

async function onCommuneChange() {
  selectedVillage.value = null;
  villageList.value = [];
  if (villageMarkersGroup) villageMarkersGroup.clearLayers();

  if (!selectedCommuneCode.value) return;

  zoomToAdminCode(`KH${selectedCommuneCode.value}`);

  try {
    isLoading.value = true;
    const res = await axios.get(`/api/v1/villages?commune_code=${selectedCommuneCode.value}&limit=100`);
    if (res.data?.success) {
      villageList.value = res.data.data || [];
      renderVillageMarkers();
    }
  } catch (err) {
    console.error('Failed to fetch villages:', err);
  } finally {
    isLoading.value = false;
  }
}

function renderVillageMarkers() {
  if (!map || !villageMarkersGroup) return;
  villageMarkersGroup.clearLayers();

  // If geoJsonLayer has bounds for this commune, distribute points or center them
  villageList.value.forEach((v, idx) => {
    // If village has lat/lon or derive from parent commune center
    const lat = v.latitude || (map?.getCenter().lat || 12.5) + (Math.random() - 0.5) * 0.04;
    const lon = v.longitude || (map?.getCenter().lng || 104.9) + (Math.random() - 0.5) * 0.04;

    const marker = L.circleMarker([lat, lon], {
      radius: 6,
      fillColor: '#10B981',
      color: '#FFFFFF',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    });

    marker.bindPopup(`
      <div class="p-1 space-y-1 font-sans text-xs">
        <div class="font-bold text-zinc-900">${v.name_en}</div>
        <div class="font-km text-zinc-700">${v.name_km}</div>
        <div class="text-[10px] font-mono text-zinc-500">Code: ${v.code}</div>
      </div>
    `);

    marker.on('click', () => {
      selectVillage(v);
    });

    villageMarkersGroup?.addLayer(marker);
  });
}

function selectVillage(v: any) {
  selectedVillage.value = v;
}

function zoomToAdminCode(pcode: string) {
  if (!geoJsonLayer || !map) return;
  const q = pcode.toLowerCase();

  geoJsonLayer.eachLayer((layer: any) => {
    const props = layer.feature?.properties;
    if (!props) return;

    const currentPcode = (props.adm1_pcode || props.adm2_pcode || props.adm3_pcode || '').toLowerCase();
    if (currentPcode === q) {
      selectedFeature.value = layer.feature;
      if (layer.getBounds) {
        map?.fitBounds(layer.getBounds(), { padding: [50, 50], maxZoom: 13 });
      }
    }
  });
}

async function changeLayer(layerId: 'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0') {
  if (activeLayerId.value === layerId) return;
  activeLayerId.value = layerId;
  closeDrawer();
  searchQuery.value = '';
  await loadGeoJsonLayer(layerId);
}

async function loadGeoJsonLayer(layerId: string) {
  if (!map) return;
  isLoading.value = true;

  if (geoJsonLayer) {
    map.removeLayer(geoJsonLayer);
  }

  try {
    const layerMeta = LAYERS.find(l => l.id === layerId);
    const fileName = layerMeta?.file || 'khm_admin1.geojson';
    const res = await axios.get(`/geojson/${fileName}`);
    const data = res.data;

    totalFeaturesRendered.value = data.features?.length || 0;

    geoJsonLayer = L.geoJSON(data, {
      style: (feature) => {
        if (layerId === 'lines') {
          return {
            color: '#71717A',
            weight: 1.2,
            opacity: 0.7,
          };
        }
        if (layerId === 'admin0') {
          return {
            fillColor: '#18181B',
            fillOpacity: 0.04,
            color: '#18181B',
            weight: 2.5,
            opacity: 0.9,
          };
        }
        const idx = data.features.indexOf(feature);
        return {
          fillColor: layerId === 'admin1' ? getFeatureColor(idx) : '#3B82F6',
          fillOpacity: layerId === 'admin1' ? 0.22 : layerId === 'admin2' ? 0.16 : 0.1,
          color: layerId === 'admin1' ? '#18181B' : '#52525B',
          weight: layerId === 'admin1' ? 1.5 : 1,
          opacity: 0.8,
        };
      },
      pointToLayer: (_feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: '#10B981',
          color: '#FFFFFF',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85,
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            hoveredFeature.value = feature;
            const target = e.target;
            if (target.setStyle) {
              target.setStyle({
                fillOpacity: 0.45,
                weight: 2.5,
                color: '#09090B',
              });
              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                target.bringToFront();
              }
            }
          },
          mouseout: (e) => {
            hoveredFeature.value = null;
            if (geoJsonLayer) {
              geoJsonLayer.resetStyle(e.target);
            }
          },
          click: async (e) => {
            selectedFeature.value = feature;
            selectedVillage.value = null;
            if (feature.geometry && feature.geometry.type !== 'Point' && map) {
              map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 13 });
            }

            // If a commune was clicked, auto-fetch its villages
            const pcode = getFeaturePcode(feature).replace('KH', '');
            if (pcode.length === 6) {
              selectedCommuneCode.value = pcode;
              try {
                const vRes = await axios.get(`/api/v1/villages?commune_code=${pcode}&limit=100`);
                if (vRes.data?.success) {
                  villageList.value = vRes.data.data || [];
                  renderVillageMarkers();
                }
              } catch (_e) {}
            }
          },
        });
      },
    }).addTo(map);

    if (layerId === 'admin0' || layerId === 'admin1') {
      map.fitBounds(geoJsonLayer.getBounds(), { padding: [20, 20] });
    }
  } catch (err) {
    console.error('Failed to load GeoJSON layer:', err);
  } finally {
    isLoading.value = false;
  }
}

function handleSearch() {
  if (!geoJsonLayer || !map) return;
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return;

  geoJsonLayer.eachLayer((layer: any) => {
    const props = layer.feature?.properties;
    if (!props) return;

    const nameEn = (props.adm1_name || props.adm2_name || props.adm3_name || props.name || '').toLowerCase();
    const pcode = (props.adm1_pcode || props.adm2_pcode || props.adm3_pcode || '').toLowerCase();

    if (nameEn.includes(q) || pcode.includes(q)) {
      selectedFeature.value = layer.feature;
      if (layer.getBounds) {
        map?.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 13 });
      } else if (layer.getLatLng) {
        map?.setView(layer.getLatLng(), 11);
      }
    }
  });
}

function getFeatureName(feat: any): string {
  if (!feat?.properties) return 'Unknown Region';
  return (
    feat.properties.adm1_name ||
    feat.properties.adm2_name ||
    feat.properties.adm3_name ||
    feat.properties.adm0_name ||
    feat.properties.name ||
    'Cambodia'
  );
}

function getFeatureKhmer(feat: any): string | null {
  if (!feat?.properties) return null;
  return (
    feat.properties.name_km ||
    feat.properties.adm1_name_km ||
    feat.properties.adm2_name_km ||
    feat.properties.adm3_name_km ||
    null
  );
}

function getFeaturePcode(feat: any): string {
  if (!feat?.properties) return 'KH';
  return (
    feat.properties.adm1_pcode ||
    feat.properties.adm2_pcode ||
    feat.properties.adm3_pcode ||
    feat.properties.adm0_pcode ||
    'KH'
  );
}

function getFeatureApiUrl(feat: any): string {
  const pcode = getFeaturePcode(feat);
  const cleanCode = pcode.replace('KH', '');
  return `/api/v1/locations/${cleanCode || '12'}`;
}

async function copyFeatureGeoJson() {
  if (!selectedFeature.value) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(selectedFeature.value, null, 2));
    copiedGeoJson.value = true;
    setTimeout(() => {
      copiedGeoJson.value = false;
    }, 2000);
  } catch (_e) {
    // fallback
  }
}

async function copyText(text: string, type: 'api') {
  try {
    await navigator.clipboard.writeText(`https://api.khmerapi.dev${text}`);
    if (type === 'api') {
      copiedApi.value = true;
      setTimeout(() => {
        copiedApi.value = false;
      }, 2000);
    }
  } catch (_e) {
    // fallback
  }
}

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style>
/* Leaflet map clean controls */
.leaflet-container {
  font-family: inherit;
  background-color: #f4f4f5;
}
.leaflet-bar {
  border-radius: 8px !important;
  border: 1px solid #e4e4e7 !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
  overflow: hidden;
}
.leaflet-bar a {
  background-color: #ffffff !important;
  color: #18181b !important;
  border-bottom: 1px solid #f4f4f5 !important;
}
.leaflet-bar a:hover {
  background-color: #f4f4f5 !important;
}
</style>
