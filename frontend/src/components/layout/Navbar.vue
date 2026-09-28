<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm transition-colors">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Left: Brand Logo & Main Nav -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="group flex items-center gap-2.5 text-zinc-900 transition-opacity hover:opacity-90">
          <span class="text-xl">🇰🇭</span>
          <div class="flex items-baseline gap-1.5">
            <span class="font-bold tracking-tight text-base text-zinc-900">KhmerAPI</span>
            <span class="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-mono font-medium text-zinc-700 border border-zinc-200">v1.0</span>
          </div>
        </router-link>

        <nav class="hidden md:flex items-center gap-1 text-[13.5px] font-medium text-zinc-600">
          <router-link
            to="/docs"
            :class="[
              'rounded-md px-3 py-1.5 transition-colors',
              $route.path.startsWith('/docs')
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'hover:text-zinc-900 hover:bg-zinc-50'
            ]"
          >
            Documentation
          </router-link>

          <router-link
            to="/apis"
            :class="[
              'rounded-md px-3 py-1.5 transition-colors',
              $route.path === '/apis'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'hover:text-zinc-900 hover:bg-zinc-50'
            ]"
          >
            APIs
          </router-link>

          <router-link
            to="/explorer"
            :class="[
              'rounded-md px-3 py-1.5 transition-colors',
              $route.path === '/explorer'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'hover:text-zinc-900 hover:bg-zinc-50'
            ]"
          >
            Explorer & Map
          </router-link>

          <router-link
            to="/status"
            :class="[
              'rounded-md px-3 py-1.5 transition-colors flex items-center gap-1.5',
              $route.path === '/status'
                ? 'bg-zinc-100 text-zinc-900 font-semibold'
                : 'hover:text-zinc-900 hover:bg-zinc-50'
            ]"
          >
            <span>API State & Latency</span>
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </router-link>
        </nav>
      </div>

      <!-- Right: Search & Actions -->
      <div class="flex items-center gap-3">
        <!-- Quick Search Bar Trigger -->
        <button
          @click="searchStore.open()"
          class="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100/70 transition-all shadow-2xs w-48 lg:w-60"
          type="button"
          aria-label="Search documentation"
        >
          <SearchIcon class="w-3.5 h-3.5 text-zinc-400" />
          <span class="flex-1 text-left truncate">Search 14,500+ locations...</span>
          <kbd class="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">⌘K</kbd>
        </button>

        <!-- Search Icon on mobile -->
        <button
          @click="searchStore.open()"
          class="sm:hidden p-2 text-zinc-600 hover:text-zinc-900"
          aria-label="Search"
        >
          <SearchIcon class="w-5 h-5" />
        </button>

        <!-- Base URL Copy Quick Action -->
        <button
          @click="copyBaseUrl"
          class="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs"
          :title="copied ? 'Copied base URL!' : 'Copy Base API URL'"
        >
          <component :is="copied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5 text-zinc-500" />
          <span>/api/v1</span>
        </button>

        <!-- Explorer Button -->
        <router-link
          to="/explorer"
          class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
        >
          <span>Open Explorer</span>
        </router-link>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
          aria-label="Toggle Menu"
        >
          <component :is="mobileMenuOpen ? XIcon : MenuIcon" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-3"
    >
      <div class="flex flex-col space-y-1 font-medium text-sm text-zinc-700">
        <router-link
          to="/docs"
          @click="mobileMenuOpen = false"
          class="rounded-md px-3 py-2 hover:bg-zinc-100"
        >
          Documentation
        </router-link>
        <router-link
          to="/apis"
          @click="mobileMenuOpen = false"
          class="rounded-md px-3 py-2 hover:bg-zinc-100"
        >
          API Catalog
        </router-link>
        <router-link
          to="/explorer"
          @click="mobileMenuOpen = false"
          class="rounded-md px-3 py-2 hover:bg-zinc-100"
        >
          Interactive Explorer
        </router-link>
        <router-link
          to="/status"
          @click="mobileMenuOpen = false"
          class="rounded-md px-3 py-2 hover:bg-zinc-100 flex items-center justify-between"
        >
          <span>Telemetry & Status</span>
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        </router-link>
      </div>

      <div class="pt-3 border-t border-zinc-100 flex flex-col gap-2">
        <button
          @click="copyBaseUrl"
          class="w-full text-center rounded-lg border border-zinc-200 py-2 text-xs font-mono font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {{ copied ? '✓ Base URL Copied' : 'Copy Base URL: /api/v1' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  X as XIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  GitFork as GithubIcon
} from 'lucide-vue-next';
import { useSearchStore } from '../../stores/search.store';

const searchStore = useSearchStore();
const mobileMenuOpen = ref(false);
const copied = ref(false);

async function copyBaseUrl() {
  try {
    await navigator.clipboard.writeText('https://api.khmerapi.dev/api/v1');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (_e) {
    // Fallback
  }
}
</script>
