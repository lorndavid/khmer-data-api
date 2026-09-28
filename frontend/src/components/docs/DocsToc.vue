<template>
  <div class="hidden xl:block w-56 shrink-0 pl-6 border-l border-zinc-200/80 py-6 text-xs sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
    <div class="space-y-3">
      <div class="font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
        On this page
      </div>
      <ul class="space-y-2 text-zinc-500 font-medium">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="block hover:text-zinc-900 transition-colors line-clamp-1"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <div class="pt-6 border-t border-zinc-100 space-y-2">
        <div class="font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
          Resources
        </div>
        <a
          href="/docs/openapi.json"
          target="_blank"
          class="block text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          OpenAPI 3.1 Spec ↗
        </a>
        <router-link
          to="/explorer"
          class="block text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Test in Explorer →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ id: string; label: string }>;
}>();
</script>
