<template>
  <aside class="hidden xl:block w-60 shrink-0 pl-6 border-l border-zinc-200/80 py-6 text-xs sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
    <div class="space-y-4">
      <div class="flex items-center justify-between font-bold uppercase tracking-wider text-[11px] text-zinc-900">
        <span>On this page</span>
        <span class="font-mono text-[10px] text-zinc-400 font-normal">{{ items.length }} sections</span>
      </div>

      <ul class="space-y-1 relative border-l border-zinc-200 pl-3">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            @click.prevent="scrollTo(item.id)"
            :class="[
              'block py-1 text-xs transition-all line-clamp-1 relative cursor-pointer',
              activeId === item.id
                ? 'text-zinc-950 font-bold -ml-[13px] pl-[13px] border-l-2 border-zinc-950'
                : 'text-zinc-500 hover:text-zinc-900 font-medium'
            ]"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <!-- Quick Resources Section -->
      <div class="pt-6 border-t border-zinc-100 space-y-2">
        <div class="font-bold uppercase tracking-wider text-[11px] text-zinc-900">
          Developer Resources
        </div>
        <a
          href="/docs/openapi.json"
          target="_blank"
          class="flex items-center justify-between text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
        >
          <span>OpenAPI 3.1 Spec</span>
          <span class="text-zinc-400 text-[10px]">↗</span>
        </a>
        <router-link
          to="/explorer"
          class="flex items-center justify-between text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
        >
          <span>Interactive Explorer</span>
          <span class="text-zinc-400 text-[10px]">→</span>
        </router-link>
        <router-link
          to="/status"
          class="flex items-center justify-between text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
        >
          <span>Live API Latency</span>
          <span class="text-zinc-400 text-[10px]">→</span>
        </router-link>
      </div>

      <!-- Back to Top Button -->
      <div class="pt-4">
        <button
          @click="scrollToTop"
          class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-2xs w-full justify-center cursor-pointer"
        >
          <ArrowUpIcon class="w-3 h-3" />
          <span>Back to top</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ArrowUp as ArrowUpIcon } from 'lucide-vue-next';
import { smoothScrollTo, smoothScrollToTop } from '../../utils/smoothScroll';

defineProps<{
  items: Array<{ id: string; label: string }>;
  activeId?: string;
}>();

function scrollTo(id: string) {
  smoothScrollTo(id, 84, 0.55);
}

function scrollToTop() {
  smoothScrollToTop(0.5);
}
</script>
