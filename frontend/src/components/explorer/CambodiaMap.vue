<template>
  <div class="relative w-full rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-card">
    <!-- Map Top Bar: Layer Switchers, Search & Controls -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/90 bg-zinc-50/90 px-4 py-3 text-xs">
      <!-- Layer Selector Pill Group -->
      <div class="flex flex-wrap items-center gap-1.5 bg-white border border-zinc-200/90 rounded-lg p-1 shadow-2xs">
        <button
          v-for="layer in LAYERS"
          :key="layer.id"
          @click="changeLayer(layer.id)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer"
          :class="activeLayerId === layer.id ? 'bg-zinc-900 text-white shadow-2xs font-semibold' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'"
        >
          <span>{{ layer.icon }}</span>
          <span>{{ layer.label }}</span>
          <span class="text-[10px] opacity-70 font-mono">({{ layer.count }})</span>
        </button>
      </div>

      <!-- Right controls: Search, Basemap & Reset View -->
      <div class="flex items-center gap-2">
        <!-- Search filter input -->
        <div class="relative w-48 sm:w-64">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search region on map..."
            class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none placeholder:text-zinc-400 font-sans shadow-2xs"
          />
          <span v-if="searchQuery" @click="searchQuery = ''; handleSearch();" class="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-700 cursor-pointer text-xs">✕</span>
        </div>

        <!-- Basemap Style Switcher -->
        <select
          v-model="selectedBasemap"
          @change="updateBasemap"
          class="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="positron">Light (Positron)</option>
          <option value="dark">Dark Matter</option>
          <option value="osm">OpenStreetMap</option>
          <option value="voyager">Voyager Clean</option>
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

    <!-- Map Canvas Container & Floating Info Overlays -->
    <div class="relative w-full h-[620px] bg-zinc-100">
      <!-- The Leaflet DOM Node -->
      <div ref="mapContainer" class="w-full h-full z-0"></div>

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-xs transition-opacity"
      >
        <div class="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-elevated">
          <Loader2Icon class="w-4 h-4 animate-spin text-zinc-900" />
          <span class="text-xs font-medium text-zinc-800">Loading {{ currentLayerLabel }}...</span>
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
          <span v-if="hoveredFeature.properties?.area_sqkm">Area: {{ Math.round(hoveredFeature.properties.area_sqkm).toLocaleString() }} km²</span>
        </div>
      </div>

      <!-- Floating Feature Details Drawer (Right Side on Selection) -->
      <transition
        enter-active-class="transform transition ease-in-out duration-300"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transform transition ease-in-out duration-200"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <div
          v-if="selectedFeature"
          class="absolute top-4 right-4 bottom-4 w-80 sm:w-96 z-20 rounded-2xl border border-zinc-200/90 bg-white/95 p-5 shadow-elevated backdrop-blur-md overflow-y-auto space-y-4 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Header with Close Button -->
            <div class="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <span class="rounded bg-zinc-100 text-zinc-700 font-mono font-bold text-[10px] px-2 py-0.5 border border-zinc-200">
                  {{ activeLayerLabel }} Details
                </span>
                <h3 class="text-base font-extrabold text-zinc-900 mt-1">
                  {{ getFeatureName(selectedFeature) }}
                </h3>
                <div v-if="getFeatureKhmer(selectedFeature)" class="font-km text-sm font-semibold text-zinc-700 mt-0.5">
                  {{ getFeatureKhmer(selectedFeature) }}
                </div>
              </div>
              <button
                @click="selectedFeature = null"
                class="p-1 text-zinc-400 hover:text-zinc-800 rounded-md hover:bg-zinc-100 transition-colors"
              >
                <XIcon class="w-4 h-4" />
              </button>
            </div>

            <!-- Property Table -->
            <div class="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3.5 space-y-2 text-xs">
              <div class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Administrative Code:</span>
                <span class="font-mono font-bold text-zinc-900">{{ getFeaturePcode(selectedFeature) }}</span>
              </div>

              <div v-if="selectedFeature.properties?.adm1_name" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Province:</span>
                <span class="font-semibold text-zinc-900">{{ selectedFeature.properties.adm1_name }}</span>
              </div>

              <div v-if="selectedFeature.properties?.adm2_name" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">District:</span>
                <span class="font-semibold text-zinc-900">{{ selectedFeature.properties.adm2_name }}</span>
              </div>

              <div v-if="selectedFeature.properties?.area_sqkm" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Surface Area:</span>
                <span class="font-mono text-zinc-900">{{ Number(selectedFeature.properties.area_sqkm).toLocaleString(undefined, { maximumFractionDigits: 1 }) }} km²</span>
              </div>

              <div v-if="selectedFeature.properties?.center_lat" class="flex items-center justify-between text-zinc-600">
                <span class="text-zinc-400 font-medium">Coordinates:</span>
                <span class="font-mono text-[11px] text-zinc-900">
                  {{ selectedFeature.properties.center_lat.toFixed(4) }}, {{ selectedFeature.properties.center_lon.toFixed(4) }}
                </span>
              </div>
            </div>

            <!-- Quick API Endpoint Preview -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-semibold text-zinc-700 uppercase">Direct API Endpoint</span>
              <div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 font-mono text-[11px] text-zinc-800">
                <span class="truncate">{{ getFeatureApiUrl(selectedFeature) }}</span>
                <button
                  @click="copyText(getFeatureApiUrl(selectedFeature), 'api')"
                  class="ml-2 text-zinc-500 hover:text-zinc-900 shrink-0 font-sans text-xs"
                >
                  {{ copiedApi ? 'Copied' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <button
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
        <span class="font-medium text-zinc-900">Cambodia GeoJSON Engine</span>
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
  X as XIcon
} from 'lucide-vue-next';
import L from 'leaflet';
import axios from 'axios';

interface LayerMeta {
  id: 'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0';
  label: string;
  icon: string;
  count: string;
  file: string;
}

const LAYERS: LayerMeta[] = [
  { id: 'admin1', label: 'Provinces', icon: '🏛️', count: '25', file: 'khm_admin1.geojson' },
  { id: 'admin2', label: 'Districts', icon: '🏙️', count: '197', file: 'khm_admin2.geojson' },
  { id: 'admin3', label: 'Communes', icon: '🏡', count: '1,633', file: 'khm_admin3.geojson' },
  { id: 'points', label: 'Capitals & Points', icon: '📍', count: '1,856', file: 'khm_adminpoints.geojson' },
  { id: 'lines', label: 'Boundary Lines', icon: '〰️', count: '4,861', file: 'khm_adminlines.geojson' },
  { id: 'admin0', label: 'National Border', icon: '🗺️', count: '1', file: 'khm_admin0.geojson' },
];

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let tileLayer: L.TileLayer | null = null;
let geoJsonLayer: L.GeoJSON | null = null;

const activeLayerId = ref<'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0'>('admin1');
const selectedBasemap = ref<'positron' | 'dark' | 'osm' | 'voyager'>('positron');
const isLoading = ref(false);
const totalFeaturesRendered = ref(25);
const searchQuery = ref('');

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

const BASEMAP_TILES = {
  positron: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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

function initMap() {
  if (!mapContainer.value) return;

  // Initialize map centered at Cambodia's geographic center
  map = L.map(mapContainer.value, {
    center: [12.5657, 104.9910],
    zoom: 7,
    zoomControl: false,
    minZoom: 6,
    maxZoom: 16,
  });

  // Add zoom control to bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  updateBasemap();
  loadGeoJsonLayer(activeLayerId.value);
}

function updateBasemap() {
  if (!map) return;
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }

  const url = BASEMAP_TILES[selectedBasemap.value];
  tileLayer = L.tileLayer(url, {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(map);
}

function resetView() {
  if (!map) return;
  map.setView([12.5657, 104.9910], 7, { animate: true });
  selectedFeature.value = null;
  searchQuery.value = '';
}

async function changeLayer(layerId: 'admin1' | 'admin2' | 'admin3' | 'points' | 'lines' | 'admin0') {
  if (activeLayerId.value === layerId) return;
  activeLayerId.value = layerId;
  selectedFeature.value = null;
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
          click: (e) => {
            selectedFeature.value = feature;
            if (feature.geometry && feature.geometry.type !== 'Point' && map) {
              map.fitBounds(e.target.getBounds(), { padding: [50, 50], maxZoom: 12 });
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
        map?.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 12 });
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
