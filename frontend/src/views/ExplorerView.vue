<template>
  <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
    <div class="space-y-2">
      <div class="inline-flex items-center gap-2">
        <span class="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-mono text-zinc-600 border border-zinc-200">Interactive Tool</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
        API Explorer
      </h1>
      <p class="text-sm text-zinc-600 max-w-3xl leading-relaxed">
        Test endpoints in real-time, inspect response latency, analyze JSON payloads, and test query parameters before writing code in your application.
      </p>
    </div>

    <ApiExplorer />
  </div>
</template>

<script setup lang="ts">
import ApiExplorer from '../components/explorer/ApiExplorer.vue';
</script>
