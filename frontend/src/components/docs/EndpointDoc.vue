<template>
  <div :id="id" class="doc-section scroll-mt-24 space-y-6 pt-10 pb-8 border-b border-zinc-200/80 last:border-0">
    <!-- Header -->
    <div class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <MethodBadge :method="method" />
          <div class="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1">
            <span class="font-mono text-xs sm:text-sm font-bold text-zinc-900">
              {{ endpoint }}
            </span>
            <button
              @click="copyEndpoint"
              class="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5"
              title="Copy endpoint path"
            >
              <CheckIcon v-if="copiedEndpoint" class="w-3.5 h-3.5 text-emerald-600" />
              <CopyIcon v-else class="w-3.5 h-3.5" />
            </button>
          </div>
          <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-700 border border-emerald-200/60">
            200 OK
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- 1-Click Send Live Request -->
          <button
            @click="testEndpointLive"
            :disabled="isTesting"
            class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Loader2Icon v-if="isTesting" class="w-3.5 h-3.5 animate-spin" />
            <PlayIcon v-else class="w-3.5 h-3.5 fill-current" />
            <span>{{ isTesting ? langStore.t.docs.testing : langStore.t.docs.sendRequest }}</span>
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-900">{{ title }}</h3>
        <p class="text-xs sm:text-sm text-zinc-600 leading-relaxed">{{ description }}</p>
      </div>
    </div>

    <!-- Parameters Table -->
    <div v-if="parameters && parameters.length > 0" class="space-y-2">
      <h4 class="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
        <span>{{ langStore.t.docs.parameters }}</span>
        <span class="text-[10px] font-mono text-zinc-400 font-normal">({{ parameters.length }})</span>
      </h4>
      <div class="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-zinc-100 bg-zinc-50/75 text-zinc-600 font-semibold">
            <tr>
              <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ប៉ារ៉ាម៉ែត្រ' : 'Parameter' }}</th>
              <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ទីតាំង' : 'In' }}</th>
              <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ប្រភេទ' : 'Type' }}</th>
              <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'កាតព្វកិច្ច' : 'Required' }}</th>
              <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ការពន្យល់' : 'Description' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr v-for="param in parameters" :key="param.name" class="hover:bg-zinc-50/50 transition-colors">
              <td class="px-4 py-2.5 font-mono font-bold text-zinc-900">{{ param.name }}</td>
              <td class="px-4 py-2.5 font-mono text-[11px] text-zinc-500">{{ param.in || 'query' }}</td>
              <td class="px-4 py-2.5 font-mono text-[11px] text-sky-700 font-semibold">{{ param.type }}</td>
              <td class="px-4 py-2.5">
                <span v-if="param.required" class="text-rose-600 font-bold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/50">{{ langStore.currentLang === 'km' ? 'ចាំបាច់' : 'Required' }}</span>
                <span v-else class="text-zinc-400 text-[11px]">{{ langStore.currentLang === 'km' ? 'មិនចាំបាច់' : 'Optional' }}</span>
              </td>
              <td class="px-4 py-2.5 text-zinc-600">
                {{ param.description }}
                <span v-if="param.default" class="text-zinc-400 font-mono text-[10px]"> (default: {{ param.default }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Code Examples & Response Preview -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2 items-start">
      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-700">
          <span>{{ langStore.t.docs.clientImplementation }}</span>
          <span class="text-[10px] font-mono text-zinc-400 lowercase font-normal">6 languages</span>
        </div>
        <CodeBlock
          :endpoint="endpoint"
          :method="method"
          :queryParams="exampleParams"
          :body="exampleBody"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-700">
          <span>{{ langStore.t.docs.payloadPreview }}</span>
          <span v-if="liveLatency !== null" class="font-mono text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ langStore.currentLang === 'km' ? 'ផ្ទាល់' : 'Live' }}: {{ liveLatency }}ms
          </span>
          <span v-else class="text-[10px] font-mono text-zinc-400 font-normal">JSON Schema</span>
        </div>
        <JsonViewer
          :data="liveResponse || exampleResponse"
          :statusCode="liveStatusCode || 200"
          :latencyMs="liveLatency ?? 8"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Play as PlayIcon,
  Loader2 as Loader2Icon,
  Copy as CopyIcon,
  Check as CheckIcon,
} from 'lucide-vue-next';
import axios from 'axios';
import MethodBadge from '../common/MethodBadge.vue';
import CodeBlock from '../common/CodeBlock.vue';
import JsonViewer from '../common/JsonViewer.vue';
import { useLangStore } from '../../stores/lang.store';

const langStore = useLangStore();

interface ParamDef {
  name: string;
  in?: 'query' | 'path' | 'header' | 'body';
  type: string;
  required?: boolean;
  description: string;
  default?: string;
}

const props = withDefaults(
  defineProps<{
    id: string;
    title: string;
    endpoint: string;
    method?: string;
    description: string;
    authRequired?: boolean;
    parameters?: ParamDef[];
    exampleParams?: Record<string, any>;
    exampleBody?: any;
    exampleResponse: any;
  }>(),
  {
    method: 'GET',
    authRequired: false,
  }
);

const isTesting = ref(false);
const liveResponse = ref<any>(null);
const liveStatusCode = ref<number | null>(null);
const liveLatency = ref<number | null>(null);
const copiedEndpoint = ref(false);

function copyEndpoint() {
  navigator.clipboard.writeText(props.endpoint);
  copiedEndpoint.value = true;
  setTimeout(() => {
    copiedEndpoint.value = false;
  }, 2000);
}

async function testEndpointLive() {
  isTesting.value = true;
  const start = performance.now();

  try {
    let url = props.endpoint;
    // Replace url path params like :code or :postalCode with valid Cambodian test keys
    if (url.includes(':code')) {
      url = url.replace(':code', '12');
    }
    if (url.includes(':postalCode')) {
      url = url.replace(':postalCode', '12000');
    }
    if (url.includes(':layer')) {
      url = url.replace(':layer', 'provinces');
    }

    const searchParams = new URLSearchParams();
    if (props.exampleParams) {
      for (const [k, v] of Object.entries(props.exampleParams)) {
        searchParams.append(k, String(v));
      }
    }
    const qs = searchParams.toString();
    const targetUrl = `${url}${qs ? `?${qs}` : ''}`;

    const res = await axios.get(targetUrl, { timeout: 6000 });
    liveLatency.value = Math.max(1, Math.round(performance.now() - start));
    liveStatusCode.value = res.status;
    liveResponse.value = res.data;
  } catch (err: any) {
    liveLatency.value = Math.max(1, Math.round(performance.now() - start));
    liveStatusCode.value = err.response ? err.response.status : 500;
    liveResponse.value = err.response ? err.response.data : { error: err.message };
  } finally {
    isTesting.value = false;
  }
}
</script>
