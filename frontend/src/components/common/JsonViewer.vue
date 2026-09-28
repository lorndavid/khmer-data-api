<template>
  <div class="relative rounded-xl border border-zinc-800 bg-[#0A0A0C] font-mono text-[13px] leading-relaxed shadow-card overflow-hidden">
    <div v-if="showHeader" class="flex items-center justify-between border-b border-zinc-800/80 bg-[#121215] px-4 py-2 text-xs text-zinc-400">
      <div class="flex items-center gap-2">
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
        <span class="font-medium text-zinc-300">JSON Response</span>
        <span v-if="statusCode" :class="statusBadgeClass">
          {{ statusCode }} {{ statusText }}
        </span>
        <span v-if="latencyMs" class="text-zinc-500 text-[11px]">
          {{ latencyMs }}ms
        </span>
      </div>

      <button
        @click="copyJson"
        class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        :title="copied ? 'Copied!' : 'Copy JSON'"
      >
        <component :is="copied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <div :class="['overflow-x-auto p-4 select-text max-h-[500px] overflow-y-auto', containerClass]">
      <pre class="m-0 text-zinc-200" v-html="highlightedJson"></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Copy as CopyIcon, Check as CheckIcon } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    data: any;
    showHeader?: boolean;
    statusCode?: number;
    latencyMs?: number;
    containerClass?: string;
  }>(),
  {
    showHeader: true,
    containerClass: '',
  }
);

const copied = ref(false);

const statusText = computed(() => {
  if (!props.statusCode) return 'OK';
  if (props.statusCode >= 200 && props.statusCode < 300) return 'OK';
  if (props.statusCode === 400) return 'Bad Request';
  if (props.statusCode === 401) return 'Unauthorized';
  if (props.statusCode === 404) return 'Not Found';
  if (props.statusCode === 429) return 'Rate Limited';
  return 'Error';
});

const statusBadgeClass = computed(() => {
  if (!props.statusCode || (props.statusCode >= 200 && props.statusCode < 300)) {
    return 'rounded bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400';
  }
  return 'rounded bg-rose-950/70 border border-rose-800/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-400';
});

const jsonString = computed(() => {
  try {
    return JSON.stringify(props.data, null, 2);
  } catch (_e) {
    return String(props.data);
  }
});

const highlightedJson = computed(() => {
  let json = jsonString.value;
  if (!json) return '';

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-300'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-300 font-semibold'; // key
        } else {
          cls = 'text-emerald-300'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-300 font-bold'; // boolean
      } else if (/null/.test(match)) {
        cls = 'text-zinc-500 italic'; // null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
});

async function copyJson() {
  try {
    await navigator.clipboard.writeText(jsonString.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (_e) {
    // Fallback
  }
}
</script>
