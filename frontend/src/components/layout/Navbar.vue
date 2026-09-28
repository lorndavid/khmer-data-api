<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md transition-all">
    <div class="mx-auto flex h-16 w-[90%] lg:w-[70%] max-w-[1440px] items-center justify-between px-2 sm:px-4">
      <!-- Left: Brand Logo & Navigation -->
      <div class="flex items-center gap-8 lg:gap-10">
        <!-- Logo -->
        <router-link
          to="/"
          class="group flex items-center gap-2.5 text-zinc-900 transition-all hover:opacity-90 active:scale-98"
        >
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-2xs group-hover:bg-zinc-800 transition-colors">
            <span class="text-base">🇰🇭</span>
          </div>
          <span class="font-extrabold tracking-tight text-lg text-zinc-900 font-sans">KhmerAPI</span>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-600 font-battambang">
          <router-link
            to="/docs"
            :class="[
              'rounded-lg px-3 py-2 transition-all',
              $route.path.startsWith('/docs')
                ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                : 'hover:text-zinc-900 hover:bg-zinc-100/80'
            ]"
          >
            {{ langStore.t.nav.docs }}
          </router-link>

          <router-link
            to="/apis"
            :class="[
              'rounded-lg px-3 py-2 transition-all',
              $route.path === '/apis'
                ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                : 'hover:text-zinc-900 hover:bg-zinc-100/80'
            ]"
          >
            {{ langStore.t.nav.apis }}
          </router-link>

          <router-link
            to="/demographics"
            :class="[
              'rounded-lg px-3 py-2 transition-all flex items-center gap-1.5',
              $route.path === '/demographics'
                ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                : 'hover:text-zinc-900 hover:bg-zinc-100/80'
            ]"
          >
            <span>{{ langStore.t.nav.demographics }}</span>
            <span class="rounded bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold px-1.5 py-0.2">17.3M</span>
          </router-link>

          <router-link
            to="/explorer"
            :class="[
              'rounded-lg px-3 py-2 transition-all',
              $route.path === '/explorer'
                ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                : 'hover:text-zinc-900 hover:bg-zinc-100/80'
            ]"
          >
            {{ langStore.t.nav.explorer }}
          </router-link>

          <router-link
            to="/status"
            :class="[
              'rounded-lg px-3 py-2 transition-all flex items-center gap-1.5',
              $route.path === '/status'
                ? 'bg-zinc-900 text-white shadow-2xs font-bold'
                : 'hover:text-zinc-900 hover:bg-zinc-100/80'
            ]"
          >
            <span>{{ langStore.t.nav.status }}</span>
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Right: Language Switcher & Quick CTA -->
      <div class="flex items-center gap-3">
        <!-- Global Language Switcher -->
        <LanguageSwitcher />

        <!-- Open Explorer CTA Button -->
        <router-link
          to="/explorer"
          class="hidden sm:inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 active:scale-98 transition-all shadow-2xs font-battambang"
        >
          <CompassIcon class="w-3.5 h-3.5" />
          <span>{{ langStore.t.nav.openExplorer }}</span>
        </router-link>

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <component :is="mobileMenuOpen ? XIcon : MenuIcon" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-b border-zinc-200/90 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 font-battambang shadow-lg animate-in slide-in-from-top-2 duration-150"
    >
      <div class="flex items-center justify-between pb-3 border-b border-zinc-100">
        <span class="text-xs text-zinc-500 font-medium">ជ្រើសរើសភាសា / Language:</span>
        <LanguageSwitcher />
      </div>

      <div class="flex flex-col space-y-1 font-semibold text-sm text-zinc-700">
        <router-link
          to="/docs"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-lg px-3.5 py-2.5 transition-colors',
            $route.path.startsWith('/docs') ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-100'
          ]"
        >
          {{ langStore.t.nav.docs }}
        </router-link>
        <router-link
          to="/apis"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-lg px-3.5 py-2.5 transition-colors',
            $route.path === '/apis' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-100'
          ]"
        >
          {{ langStore.t.nav.apis }}
        </router-link>
        <router-link
          to="/demographics"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-lg px-3.5 py-2.5 transition-colors flex items-center justify-between',
            $route.path === '/demographics' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-100'
          ]"
        >
          <span>{{ langStore.t.nav.demographics }}</span>
          <span class="rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5">17.3M</span>
        </router-link>
        <router-link
          to="/explorer"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-lg px-3.5 py-2.5 transition-colors',
            $route.path === '/explorer' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-100'
          ]"
        >
          {{ langStore.t.nav.explorer }}
        </router-link>
        <router-link
          to="/status"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-lg px-3.5 py-2.5 transition-colors flex items-center justify-between',
            $route.path === '/status' ? 'bg-zinc-900 text-white font-bold' : 'hover:bg-zinc-100'
          ]"
        >
          <span>{{ langStore.t.nav.status }}</span>
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </router-link>
      </div>

      <div class="pt-2 border-t border-zinc-100">
        <router-link
          to="/explorer"
          @click="mobileMenuOpen = false"
          class="flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white shadow-2xs"
        >
          <CompassIcon class="w-4 h-4" />
          <span>{{ langStore.t.nav.openExplorer }}</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Menu as MenuIcon,
  X as XIcon,
  Compass as CompassIcon,
} from 'lucide-vue-next';
import { useLangStore } from '../../stores/lang.store';
import LanguageSwitcher from '../common/LanguageSwitcher.vue';

const langStore = useLangStore();
const mobileMenuOpen = ref(false);
</script>
