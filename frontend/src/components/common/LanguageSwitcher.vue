<template>
  <div class="inline-flex items-center rounded-lg border border-zinc-200/90 bg-white/90 p-0.5 text-xs shadow-2xs backdrop-blur-sm">
    <button
      type="button"
      @click="langStore.setLang('km')"
      :class="[
        'flex items-center gap-1 rounded-md px-2 py-1 font-battambang font-bold transition-all cursor-pointer text-xs',
        langStore.currentLang === 'km'
          ? 'bg-zinc-900 text-white shadow-2xs'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
      ]"
      title="ប្តូរទៅភាសាខ្មែរ"
    >
      <span>ខ្មែរ</span>
    </button>
    <button
      type="button"
      @click="langStore.setLang('en')"
      :class="[
        'flex items-center gap-1 rounded-md px-2 py-1 font-sans font-semibold transition-all cursor-pointer text-xs',
        langStore.currentLang === 'en'
          ? 'bg-zinc-900 text-white shadow-2xs'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
      ]"
      title="Switch to English"
    >
      <span>EN</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLangStore } from '../../stores/lang.store';

const langStore = useLangStore();
</script>
