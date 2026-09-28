<template>
  <div class="space-y-6">
    <!-- Controls Card -->
    <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-card space-y-4">
      <!-- Method + Endpoint selector -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-12">
        <div class="sm:col-span-3">
          <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">Preset Endpoint</label>
          <select
            v-model="selectedPresetIndex"
            @change="applyPreset"
            class="w-full rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs font-medium text-zinc-800 focus:border-zinc-900 focus:bg-white focus:outline-none"
          >
            <option v-for="(preset, idx) in PRESETS" :key="idx" :value="idx">
              {{ preset.name }}
            </option>
          </select>
        </div>

        <div class="sm:col-span-7">
          <label class="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">Endpoint URL</label>
          <div class="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/70 px-3 py-1.5 focus-within:border-zinc-900 focus-within:bg-white">
            <span class="font-mono text-xs text-zinc-400 select-none mr-1">/api/v1</span>
            <input
              v-model="endpointPath"
              type="text"
              placeholder="/provinces"
              class="w-full bg-transparent font-mono text-xs text-zinc-900 focus:outline-none"
            />
          </div>
        </div>

        <div class="sm:col-span-2 flex items-end">
          <button
            @click="executeRequest"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-2xs cursor-pointer"
          >
            <Loader2Icon v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
            <PlayIcon v-else class="w-3.5 h-3.5 fill-current" />
            <span>{{ isLoading ? 'Sending...' : 'Send' }}</span>
          </button>
        </div>
      </div>

      <!-- Parameters Config Tabs -->
      <div class="border-t border-zinc-100 pt-3">
        <div class="flex items-center gap-4 text-xs font-medium border-b border-zinc-100 pb-2 mb-3">
          <button
            @click="activeParamTab = 'params'"
            :class="[
              'pb-1 transition-colors relative',
              activeParamTab === 'params' ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-700'
            ]"
          >
            Query Parameters
            <span v-if="activeParamTab === 'params'" class="absolute -bottom-2 left-0 right-0 h-0.5 bg-zinc-900"></span>
          </button>
          <button
            @click="activeParamTab = 'headers'"
            :class="[
              'pb-1 transition-colors relative',
              activeParamTab === 'headers' ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-700'
            ]"
          >
            Headers
            <span v-if="activeParamTab === 'headers'" class="absolute -bottom-2 left-0 right-0 h-0.5 bg-zinc-900"></span>
          </button>
        </div>

        <!-- Query params rows -->
        <div v-if="activeParamTab === 'params'" class="space-y-2">
          <div v-for="(p, index) in queryParamsList" :key="index" class="flex items-center gap-2">
            <input
              v-model="p.key"
              type="text"
              placeholder="Key (e.g. search)"
              class="w-1/3 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-mono text-zinc-800 focus:border-zinc-900 focus:outline-none"
            />
            <input
              v-model="p.value"
              type="text"
              placeholder="Value (e.g. Phnom Penh)"
              class="flex-1 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-mono text-zinc-800 focus:border-zinc-900 focus:outline-none"
            />
            <button
              @click="removeParam(index)"
              class="text-zinc-400 hover:text-rose-600 p-1 text-xs"
              title="Remove parameter"
            >
              <Trash2Icon class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            @click="addParam"
            class="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 mt-1"
          >
            <PlusIcon class="w-3 h-3" />
            <span>Add Query Parameter</span>
          </button>
        </div>

        <!-- Headers rows -->
        <div v-else class="space-y-2">
          <div class="flex items-center gap-2">
            <input
              type="text"
              value="Accept"
              readonly
              class="w-1/3 rounded-md border border-zinc-100 bg-zinc-50 px-2.5 py-1 text-xs font-mono text-zinc-500"
            />
            <input
              type="text"
              value="application/json"
              readonly
              class="flex-1 rounded-md border border-zinc-100 bg-zinc-50 px-2.5 py-1 text-xs font-mono text-zinc-500"
            />
          </div>
          <div class="flex items-center gap-2">
            <input
              type="text"
              value="X-API-Key"
              readonly
              class="w-1/3 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-mono text-zinc-800"
            />
            <input
              v-model="apiKeyHeader"
              type="text"
              placeholder="Optional: kh_live_..."
              class="flex-1 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-mono text-zinc-800 focus:border-zinc-900 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Output Section: Full Request URL + Response Viewer -->
    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs text-zinc-600">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-zinc-900">Request:</span>
          <code class="font-mono text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-[11px]">{{ fullExecutedUrl }}</code>
        </div>
        <div v-if="lastResponse" class="flex items-center gap-3">
          <span class="font-mono text-[11px]">Latency: <strong class="text-zinc-900">{{ responseTimeMs }}ms</strong></span>
          <span class="font-mono text-[11px]">Status: <strong class="text-emerald-600">{{ responseStatus }} OK</strong></span>
        </div>
      </div>

      <JsonViewer
        :data="responseData"
        :statusCode="responseStatus"
        :latencyMs="responseTimeMs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  Play as PlayIcon,
  Loader2 as Loader2Icon,
  Plus as PlusIcon,
  Trash2 as Trash2Icon
} from 'lucide-vue-next';
import axios from 'axios';
import JsonViewer from '../common/JsonViewer.vue';

interface Preset {
  name: string;
  path: string;
  params: Array<{ key: string; value: string }>;
}

const PRESETS: Preset[] = [
  { name: 'GET Provinces (List all 25)', path: '/provinces', params: [{ key: 'limit', value: '25' }] },
  { name: 'GET Province by Code (12 - Phnom Penh)', path: '/provinces/12', params: [] },
  { name: 'GET Districts of Phnom Penh', path: '/provinces/12/districts', params: [] },
  { name: 'GET Search (q=Phnom Penh)', path: '/search', params: [{ key: 'q', value: 'Phnom Penh' }] },
  { name: 'GET Search (Khmer: q=សៀមរាប)', path: '/search', params: [{ key: 'q', value: 'សៀមរាប' }] },
  { name: 'GET Postal Code (12000)', path: '/postal-codes/12000', params: [] },
  { name: 'GET Complete Location Tree (12010101)', path: '/locations/12010101', params: [] },
  { name: 'GET GeoJSON Provinces', path: '/geo/provinces', params: [] },
  { name: 'GET System Statistics', path: '/statistics', params: [] },
  { name: 'GET Data Sources & Provenance', path: '/data-sources', params: [] },
];

const route = useRoute();
const selectedPresetIndex = ref(0);
const endpointPath = ref('/provinces');
const activeParamTab = ref<'params' | 'headers'>('params');
const queryParamsList = ref<Array<{ key: string; value: string }>>([
  { key: 'limit', value: '25' }
]);
const apiKeyHeader = ref('');

const isLoading = ref(false);
const responseData = ref<any>({
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
    limit: 25,
    total: 25,
    total_pages: 1,
    request_id: "0d94f273-04e8-46c5-9df0-7d72111df4d9",
    timestamp: new Date().toISOString()
  }
});
const responseStatus = ref<number>(200);
const responseTimeMs = ref<number>(14);
const lastResponse = ref(true);

const fullExecutedUrl = computed(() => {
  let p = endpointPath.value.startsWith('/') ? endpointPath.value : `/${endpointPath.value}`;
  const searchParams = new URLSearchParams();
  for (const item of queryParamsList.value) {
    if (item.key.trim()) {
      searchParams.append(item.key.trim(), item.value);
    }
  }
  const qs = searchParams.toString();
  return `/api/v1${p}${qs ? `?${qs}` : ''}`;
});

function applyPreset() {
  const p = PRESETS[selectedPresetIndex.value];
  if (p) {
    endpointPath.value = p.path;
    queryParamsList.value = p.params.map(item => ({ ...item }));
    executeRequest();
  }
}

function addParam() {
  queryParamsList.value.push({ key: '', value: '' });
}

function removeParam(index: number) {
  queryParamsList.value.splice(index, 1);
}

async function executeRequest() {
  isLoading.value = true;
  const start = performance.now();

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };
    if (apiKeyHeader.value.trim()) {
      headers['X-API-Key'] = apiKeyHeader.value.trim();
    }

    const res = await axios.get(fullExecutedUrl.value, {
      headers,
      timeout: 6000
    });

    responseTimeMs.value = Math.round(performance.now() - start);
    responseStatus.value = res.status;
    responseData.value = res.data;
    lastResponse.value = true;
  } catch (err: any) {
    responseTimeMs.value = Math.round(performance.now() - start);
    if (err.response) {
      responseStatus.value = err.response.status;
      responseData.value = err.response.data;
    } else {
      responseStatus.value = 500;
      responseData.value = {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Failed to reach API server. Ensure backend is running.',
          details: null
        },
        meta: {
          request_id: 'err-' + Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString()
        }
      };
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (route.query.endpoint) {
    endpointPath.value = String(route.query.endpoint).replace('/api/v1', '');
    executeRequest();
  }
});
</script>
