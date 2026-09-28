<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm transition-colors">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Left: Brand Logo & Main Nav -->
      <div class="flex items-center gap-8">
        <router-link to="/" class="group flex items-center gap-2.5 text-zinc-900 transition-opacity hover:opacity-90">
          <span class="text-xl">🇰🇭</span>
          <div class="flex items-baseline gap-1.5">
            <span class="font-bold tracking-tight text-base text-zinc-900">KhmerAPI</span>
            <span class="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-mono font-medium text-zinc-500 border border-zinc-200">v1.0</span>
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
            Docs
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
            Explorer
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
            <span>Status</span>
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </router-link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md px-3 py-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLinkIcon class="w-3 h-3 text-zinc-400" />
          </a>
        </nav>
      </div>

      <!-- Center / Right Search & Auth -->
      <div class="flex items-center gap-3">
        <!-- Quick Search Bar Trigger -->
        <button
          @click="searchStore.open()"
          class="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100/70 transition-all shadow-2xs w-44 lg:w-56"
          type="button"
          aria-label="Search documentation"
        >
          <SearchIcon class="w-3.5 h-3.5 text-zinc-400" />
          <span class="flex-1 text-left">Search API...</span>
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

        <!-- Auth Navigation -->
        <template v-if="!authStore.isAuthenticated">
          <router-link
            to="/login"
            class="hidden sm:inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            Sign In
          </router-link>

          <router-link
            to="/register"
            class="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
          >
            Get API Key
          </router-link>
        </template>

        <template v-else>
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <div class="h-4 w-4 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[9px] font-bold">
              {{ (authStore.user?.first_name || 'D').charAt(0).toUpperCase() }}
            </div>
            <span class="hidden sm:inline">Dashboard</span>
          </router-link>

          <button
            @click="handleLogout"
            class="hidden sm:inline-flex items-center text-xs text-zinc-500 hover:text-zinc-900 p-1.5"
            title="Sign out"
          >
            <LogOutIcon class="w-4 h-4" />
          </button>
        </template>

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
          API Explorer
        </router-link>
        <router-link
          to="/status"
          @click="mobileMenuOpen = false"
          class="rounded-md px-3 py-2 hover:bg-zinc-100 flex items-center justify-between"
        >
          <span>System Status</span>
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        </router-link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md px-3 py-2 hover:bg-zinc-100 flex items-center justify-between"
        >
          <span>GitHub</span>
          <ExternalLinkIcon class="w-4 h-4 text-zinc-400" />
        </a>
      </div>

      <div class="pt-3 border-t border-zinc-100 flex flex-col gap-2">
        <template v-if="!authStore.isAuthenticated">
          <router-link
            to="/login"
            @click="mobileMenuOpen = false"
            class="w-full text-center rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Sign In
          </router-link>
          <router-link
            to="/register"
            @click="mobileMenuOpen = false"
            class="w-full text-center rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Get API Key
          </router-link>
        </template>
        <template v-else>
          <router-link
            to="/dashboard"
            @click="mobileMenuOpen = false"
            class="w-full text-center rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Go to Dashboard
          </router-link>
          <button
            @click="handleLogout"
            class="w-full text-center rounded-lg border border-zinc-200 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Sign Out
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search as SearchIcon,
  ExternalLink as ExternalLinkIcon,
  Menu as MenuIcon,
  X as XIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next';
import { useAuthStore } from '../../stores/auth.store';
import { useSearchStore } from '../../stores/search.store';

const router = useRouter();
const authStore = useAuthStore();
const searchStore = useSearchStore();
const mobileMenuOpen = ref(false);

async function handleLogout() {
  await authStore.logout();
  mobileMenuOpen.value = false;
  router.push('/');
}
</script>
