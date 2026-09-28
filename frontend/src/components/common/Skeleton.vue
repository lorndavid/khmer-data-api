<template>
  <div
    :class="[
      'animate-pulse rounded-md bg-zinc-200/80 dark:bg-zinc-800/60',
      customClass
    ]"
    :style="{ width, height }"
  ></div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    customClass?: string;
  }>(),
  {
    width: '100%',
    height: '1rem',
    customClass: '',
  }
);
</script>
