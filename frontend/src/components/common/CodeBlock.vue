<template>
  <div class="rounded-xl border border-zinc-800 bg-[#0F0F11] text-zinc-100 overflow-hidden shadow-card">
    <!-- Header with language tabs and copy button -->
    <div class="flex items-center justify-between border-b border-zinc-800/80 bg-[#141417] px-3.5 py-2">
      <div class="flex items-center gap-1 overflow-x-auto pr-2">
        <button
          v-for="lang in availableLanguages"
          :key="lang.id"
          @click="selectedLang = lang.id"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors font-mono whitespace-nowrap cursor-pointer',
            selectedLang === lang.id
              ? 'bg-zinc-800 text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          ]"
        >
          {{ lang.label }}
        </button>
      </div>

      <button
        @click="copyCode"
        class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
        :title="copied ? 'Copied!' : 'Copy to clipboard'"
      >
        <component :is="copied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>

    <!-- Code Content -->
    <div class="relative overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed select-text">
      <pre class="m-0 bg-transparent text-zinc-200"><code>{{ currentCode }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Copy as CopyIcon, Check as CheckIcon } from 'lucide-vue-next';

interface LanguageOption {
  id: 'curl' | 'js' | 'python' | 'dart' | 'php' | 'go';
  label: string;
}

const props = withDefaults(
  defineProps<{
    endpoint?: string;
    method?: string;
    queryParams?: Record<string, any>;
    body?: any;
    customSnippets?: Partial<Record<'curl' | 'js' | 'python' | 'dart' | 'php' | 'go', string>>;
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
  { id: 'dart', label: 'Dart / Flutter' },
  { id: 'php', label: 'PHP' },
  { id: 'go', label: 'Go' },
];

const selectedLang = ref<'curl' | 'js' | 'python' | 'dart' | 'php' | 'go'>('curl');
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

    case 'dart':
      if (method === 'GET') {
        return `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<void> fetchCambodiaData() async {\n  final uri = Uri.parse('${url}');\n  final res = await http.get(uri, headers: {'Accept': 'application/json'});\n  if (res.statusCode == 200) {\n    final data = jsonDecode(res.body)['data'];\n    print(data);\n  }\n}`;
      }
      return `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nFuture<void> sendData() async {\n  final uri = Uri.parse('${url}');\n  final res = await http.${method.toLowerCase()}(\n    uri,\n    headers: {'Content-Type': 'application/json'},\n    body: jsonEncode(${JSON.stringify(props.body || {})}),\n  );\n  print(jsonDecode(res.body)['data']);\n}`;

    case 'php':
      if (method === 'GET') {
        return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);\nprint_r($data["data"]);`;
      }
      return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");\ncurl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${JSON.stringify(props.body || {})}));\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);\n$response = curl_exec($ch);\ncurl_close($ch);\n\n$data = json_decode($response, true);`;

    case 'go':
      if (method === 'GET') {
        return `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tresp, err := http.Get("${url}")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;
      }
      return `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"net/http"\n)\n\nfunc main() {\n\tpayload := []byte(\`${JSON.stringify(props.body || {})}\`)\n\treq, _ := http.NewRequest("${method}", "${url}", bytes.NewBuffer(payload))\n\treq.Header.Set("Content-Type", "application/json")\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\tfmt.Println("Status:", resp.Status)\n}`;

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

