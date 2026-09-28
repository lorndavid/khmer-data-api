<template>
  <div class="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-16 text-center space-y-4">
    <span class="font-mono text-xs font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
      404 NOT FOUND
    </span>
    <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
      Page Not Found
    </h1>
    <p class="text-xs text-zinc-500 max-w-sm leading-relaxed">
      The requested endpoint, documentation page, or URL could not be found on the KhmerAPI platform.
    </p>
    <div class="pt-2 flex items-center gap-3">
      <router-link
        to="/"
        class="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
      >
        Back to Home
      </router-link>
      <router-link
        to="/docs"
        class="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
      >
        Documentation
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Page
</script>
