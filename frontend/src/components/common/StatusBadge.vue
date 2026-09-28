<template>
  <div
    :class="[
      'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
      status === 'operational' || status === 'ok'
        ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800'
        : status === 'degraded'
        ? 'border-amber-200 bg-amber-50/70 text-amber-800'
        : 'border-rose-200 bg-rose-50/70 text-rose-800'
    ]"
  >
    <span class="relative flex h-2 w-2">
      <span
        :class="[
          'absolute inline-flex h-full w-full rounded-full opacity-75',
          status === 'operational' || status === 'ok'
            ? 'bg-emerald-500 animate-ping'
            : status === 'degraded'
            ? 'bg-amber-500 animate-ping'
            : 'bg-rose-500 animate-ping'
        ]"
      ></span>
      <span
        :class="[
          'relative inline-flex h-2 w-2 rounded-full',
          status === 'operational' || status === 'ok'
            ? 'bg-emerald-600'
            : status === 'degraded'
            ? 'bg-amber-600'
            : 'bg-rose-600'
        ]"
      ></span>
    </span>
    <span class="tracking-tight">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    status?: 'operational' | 'ok' | 'degraded' | 'error';
    label?: string;
  }>(),
  {
    status: 'operational',
    label: 'All systems operational',
  }
);
</script>
