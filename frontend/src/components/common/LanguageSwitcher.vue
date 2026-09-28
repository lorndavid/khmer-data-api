<template>
  <div class="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 text-xs shadow-2xs">
    <button
      type="button"
      @click="langStore.setLang('km')"
      :class="[
        'flex items-center gap-1.5 rounded-md px-2 py-1 font-battambang font-bold transition-all cursor-pointer',
        langStore.currentLang === 'km'
          ? 'bg-zinc-900 text-white shadow-2xs'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
      ]"
      title="ប្តូរទៅភាសាខ្មែរ"
    >
      <span class="text-xs">🇰🇭</span>
      <span>ខ្មែរ</span>
    </button>
    <button
      type="button"
      @click="langStore.setLang('en')"
      :class="[
        'flex items-center gap-1.5 rounded-md px-2 py-1 font-sans font-semibold transition-all cursor-pointer',
        langStore.currentLang === 'en'
          ? 'bg-zinc-900 text-white shadow-2xs'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
      ]"
      title="Switch to English"
    >
      <span class="text-xs">🇬🇧</span>
      <span>EN</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLangStore } from '../../stores/lang.store';

const langStore = useLangStore();
</script>
