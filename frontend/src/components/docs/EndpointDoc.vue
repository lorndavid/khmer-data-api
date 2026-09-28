<template>
  <div :id="id" class="scroll-mt-24 space-y-6 pt-6 first:pt-0">
    <!-- Header -->
    <div class="space-y-2">
      <div class="flex flex-wrap items-center gap-2.5">
        <MethodBadge :method="method" />
        <span class="font-mono text-sm font-semibold text-zinc-900">{{ endpoint }}</span>
        <span
          :class="[
            'rounded px-2 py-0.5 text-[10px] font-medium',
            authRequired
              ? 'bg-amber-50 text-amber-800 border border-amber-200/70'
              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
          ]"
        >
          {{ authRequired ? 'API Key Required' : 'Public Access' }}
        </span>
      </div>
      <h3 class="text-lg font-bold tracking-tight text-zinc-900">{{ title }}</h3>
      <p class="text-sm text-zinc-600 leading-relaxed">{{ description }}</p>
    </div>

    <!-- Parameters Table -->
    <div v-if="parameters && parameters.length > 0" class="space-y-2">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Parameters</h4>
      <div class="overflow-x-auto rounded-lg border border-zinc-200/90 bg-white">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-zinc-100 bg-zinc-50/75 text-zinc-600 font-medium">
            <tr>
              <th class="px-3 py-2">Parameter</th>
              <th class="px-3 py-2">In</th>
              <th class="px-3 py-2">Type</th>
              <th class="px-3 py-2">Required</th>
              <th class="px-3 py-2">Description</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr v-for="param in parameters" :key="param.name">
              <td class="px-3 py-2 font-mono font-medium text-zinc-900">{{ param.name }}</td>
              <td class="px-3 py-2 font-mono text-[11px] text-zinc-500">{{ param.in || 'query' }}</td>
              <td class="px-3 py-2 font-mono text-[11px] text-sky-600">{{ param.type }}</td>
              <td class="px-3 py-2">
                <span v-if="param.required" class="text-rose-600 font-semibold text-[11px]">Yes</span>
                <span v-else class="text-zinc-400 text-[11px]">Optional</span>
              </td>
              <td class="px-3 py-2 text-zinc-600">
                {{ param.description }}
                <span v-if="param.default" class="text-zinc-400 font-mono text-[10px]"> (default: {{ param.default }})</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Code Examples & Response Preview -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Request Example</span>
          <router-link
            :to="{ path: '/explorer', query: { endpoint, method } }"
            class="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 hover:underline"
          >
            <span>Try API</span>
            <ExternalLinkIcon class="w-3 h-3" />
          </router-link>
        </div>
        <CodeBlock
          :endpoint="endpoint"
          :method="method"
          :queryParams="exampleParams"
          :body="exampleBody"
        />
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Response (200 OK)</span>
          <span class="text-[11px] font-mono text-zinc-400">application/json</span>
        </div>
        <JsonViewer :data="exampleResponse" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink as ExternalLinkIcon } from 'lucide-vue-next';
import MethodBadge from '../common/MethodBadge.vue';
import CodeBlock from '../common/CodeBlock.vue';
import JsonViewer from '../common/JsonViewer.vue';

interface ParamDef {
  name: string;
  in?: 'query' | 'path' | 'header' | 'body';
  type: string;
  required?: boolean;
  description: string;
  default?: string;
}

withDefaults(
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
</script>
