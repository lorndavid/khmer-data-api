<template>
  <div
    v-if="searchStore.isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-zinc-950/40 backdrop-blur-xs"
    @click.self="searchStore.close()"
    @keydown.esc="searchStore.close()"
  >
    <div
      class="w-full max-w-xl rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-100"
    >
      <!-- Search Input Header -->
      <div class="flex items-center border-b border-zinc-100 px-4 py-3 gap-3">
        <SearchIcon class="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          ref="inputRef"
          v-model="searchInput"
          @input="handleInput"
          type="text"
          :placeholder="langStore.currentLang === 'km' ? 'ស្វែងរកទីតាំង ខេត្ត ស្រុក ឃុំ ភូមិ លេខប្រៃសណីយ៍ និង API...' : 'Search documentation, APIs, provinces, postal codes...'"
          class="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
          autofocus
        />
        <div v-if="searchStore.isLoading" class="shrink-0">
          <Loader2Icon class="w-4 h-4 text-zinc-400 animate-spin" />
        </div>
        <kbd
          @click="searchStore.close()"
          class="hidden sm:inline-block cursor-pointer rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 hover:bg-zinc-100"
        >
          ESC
        </kbd>
      </div>

      <!-- Search Results Area -->
      <div class="max-h-[380px] overflow-y-auto p-2 space-y-4">
        <!-- Live Location Search Results (if available) -->
        <div v-if="searchStore.locationResults.length > 0" class="space-y-1">
          <div class="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {{ langStore.currentLang === 'km' ? 'ទិន្នន័យភូមិសាស្ត្រកម្ពុជា' : 'Cambodia Public Data' }}
          </div>
          <div
            v-for="item in searchStore.locationResults"
            :key="item.type + item.code"
            @click="navigateToLocation(item)"
            class="group flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2.5">
              <span class="rounded bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 uppercase">
                {{ item.type }}
              </span>
              <div>
                <span class="font-medium text-zinc-900">{{ item.name_en }}</span>
                <span class="ml-1.5 font-km text-zinc-500">{{ item.name_km }}</span>
              </div>
            </div>
            <span class="font-mono text-[11px] text-zinc-400">Code: {{ item.code }}</span>
          </div>
        </div>

        <!-- Documentation & Endpoint Results -->
        <div v-if="searchStore.docResults.length > 0" class="space-y-1">
          <div class="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {{ searchStore.query ? (langStore.currentLang === 'km' ? 'លទ្ធផលស្វែងរក' : 'Matching Topics') : (langStore.currentLang === 'km' ? 'ផ្លូវកាត់រហ័ស' : 'Quick Navigation') }}
          </div>
          <div
            v-for="doc in searchStore.docResults"
            :key="doc.id"
            @click="navigateToDoc(doc.path)"
            class="group flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            <div class="flex items-center gap-2.5">
              <MethodBadge v-if="doc.method" :method="doc.method" />
              <FileTextIcon v-else class="w-3.5 h-3.5 text-zinc-400" />
              <div>
                <div class="font-medium text-zinc-900">{{ doc.title }}</div>
                <div class="text-[11px] text-zinc-500 line-clamp-1">{{ doc.description }}</div>
              </div>
            </div>
            <ArrowRightIcon class="w-3.5 h-3.5 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!searchStore.isLoading && searchStore.docResults.length === 0 && searchStore.locationResults.length === 0"
          class="py-8 text-center text-xs text-zinc-500"
        >
          {{ langStore.currentLang === 'km' ? 'រកមិនឃើញលទ្ធផលសម្រាប់ ' : 'No results found for ' }}"<span class="font-semibold text-zinc-800">{{ searchStore.query }}</span>".
        </div>
      </div>

      <!-- Footer Help Hints -->
      <div class="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-4 py-2 text-[11px] text-zinc-400">
        <div class="flex items-center gap-3">
          <span><kbd class="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px]">↑</kbd> <kbd class="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px]">↓</kbd> {{ langStore.currentLang === 'km' ? 'ជ្រើសរើស' : 'navigate' }}</span>
          <span><kbd class="font-mono bg-white border border-zinc-200 px-1 py-0.5 rounded text-[10px]">↵</kbd> {{ langStore.currentLang === 'km' ? 'បើក' : 'select' }}</span>
        </div>
        <span class="font-mono text-[10px]">KhmerAPI Universal Search</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search as SearchIcon,
  Loader2 as Loader2Icon,
  FileText as FileTextIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-vue-next';
import MethodBadge from '../common/MethodBadge.vue';
import { useSearchStore } from '../../stores/search.store';
import { useLangStore } from '../../stores/lang.store';
import type { SearchResultItem } from '../../types/location.types';

const router = useRouter();
const searchStore = useSearchStore();
const langStore = useLangStore();
const searchInput = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

function handleInput() {
  searchStore.performSearch(searchInput.value);
}

function navigateToDoc(path: string) {
  searchStore.addRecent(searchInput.value);
  searchStore.close();
  router.push(path);
}

function navigateToLocation(item: SearchResultItem) {
  searchStore.addRecent(item.name_en);
  searchStore.close();
  if (item.type === 'province') {
    router.push(`/docs/provinces`);
  } else if (item.type === 'district') {
    router.push(`/docs/districts`);
  } else if (item.type === 'postal_code') {
    router.push(`/docs/postal-codes`);
  } else {
    router.push(`/explorer?search=${encodeURIComponent(item.code)}`);
  }
}

function handleKeydown(e: KeyboardEvent) {
  // Trigger on Ctrl+K, Cmd+K, or "/" when not inside an input/textarea
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchStore.toggle();
    if (searchStore.isOpen) {
      nextTick(() => inputRef.value?.focus());
    }
  } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
    e.preventDefault();
    searchStore.open();
    nextTick(() => inputRef.value?.focus());
  } else if (e.key === 'Escape' && searchStore.isOpen) {
    searchStore.close();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
