<template>
  <span
    :class="[
      'inline-flex items-center font-mono font-bold uppercase rounded px-2 py-0.5 text-[11px] tracking-wider transition-colors',
      colorClasses
    ]"
  >
    {{ method }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | string;
    size?: 'sm' | 'md';
  }>(),
  {
    size: 'sm'
  }
);

const colorClasses = computed(() => {
  switch (props.method.toUpperCase()) {
    case 'GET':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50';
    case 'POST':
      return 'bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/50';
    case 'PATCH':
    case 'PUT':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50';
    case 'DELETE':
      return 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50';
    default:
      return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
  }
});
</script>
