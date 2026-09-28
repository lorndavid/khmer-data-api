<template>
  <div class="rounded-xl border border-zinc-800 bg-[#0F0F11] text-zinc-100 overflow-hidden shadow-card">
    <!-- Header with language tabs and copy button -->
    <div class="flex items-center justify-between border-b border-zinc-800/80 bg-[#141417] px-3.5 py-2">
      <div class="flex items-center gap-1.5">
        <button
          v-for="lang in availableLanguages"
          :key="lang.id"
          @click="selectedLang = lang.id"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors font-mono',
            selectedLang === lang.id
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          ]"
        >
          {{ lang.label }}
        </button>
      </div>

      <button
        @click="copyCode"
        class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        :title="copied ? 'Copied!' : 'Copy to clipboard'"
      >
        <component :is="copied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <!-- Code Content -->
    <div class="relative overflow-x-auto p-4 font-mono text-[13px] leading-relaxed select-text">
      <pre class="m-0 bg-transparent text-zinc-200"><code>{{ currentCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Copy as CopyIcon, Check as CheckIcon } from 'lucide-vue-next';

interface LanguageOption {
  id: 'curl' | 'js' | 'python' | 'php';
  label: string;
}

const props = withDefaults(
  defineProps<{
    endpoint?: string;
    method?: string;
    queryParams?: Record<string, any>;
    body?: any;
    customSnippets?: Partial<Record<'curl' | 'js' | 'python' | 'php', string>>;
  }>(),
  {
    endpoint: '/provinces',
    method: 'GET',
  }
);

const availableLanguages: LanguageOption[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
];

const selectedLang = ref<'curl' | 'js' | 'python' | 'php'>('curl');
const copied = ref(false);

const fullUrl = computed(() => {
  const base = 'https://api.khmerapi.dev/api/v1';
  let url = `${base}${props.endpoint.startsWith('/') ? '' : '/'}${props.endpoint}`;
  if (props.queryParams && Object.keys(props.queryParams).length > 0) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(props.queryParams)) {
      if (v !== undefined && v !== null && v !== '') {
        params.append(k, String(v));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
});

const currentCode = computed(() => {
  if (props.customSnippets && props.customSnippets[selectedLang.value]) {
    return props.customSnippets[selectedLang.value]!;
  }

  const method = (props.method || 'GET').toUpperCase();
  const url = fullUrl.value;

  switch (selectedLang.value) {
    case 'curl':
      if (method === 'GET') {
        return `curl -X GET "${url}" \\\n  -H "Accept: application/json"`;
      }
      return `curl -X ${method} "${url}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(props.body || {}, null, 2)}'`;

    case 'js':
      if (method === 'GET') {
        return `const response = await fetch("${url}", {\n  headers: {\n    "Accept": "application/json"\n  }\n});\nconst result = await response.json();\nconsole.log(result.data);`;
      }
      return `const response = await fetch("${url}", {\n  method: "${method}",\n  headers: {\n    "Content-Type": "application/json",\n    "Accept": "application/json"\n  },\n  body: JSON.stringify(${JSON.stringify(props.body || {}, null, 2)})\n});\nconst result = await response.json();\nconsole.log(result.data);`;

    case 'python':
      if (method === 'GET') {
        return `import requests\n\nresponse = requests.get("${url}")\ndata = response.json()\nprint(data["data"])`;
      }
      return `import requests\n\npayload = ${JSON.stringify(props.body || {}, null, 2)}\nresponse = requests.${method.toLowerCase()}("${url}", json=payload)\ndata = response.json()\nprint(data["data"])`;

    case 'php':
      if (method === 'GET') {
        return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);\nprint_r($data["data"]);`;
      }
      return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${JSON.stringify(props.body || {})}));\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);`;

    default:
      return '';
  }
});

async function copyCode() {
  try {
    await navigator.clipboard.writeText(currentCode.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (_err) {
    // Fallback
  }
}
</script>
