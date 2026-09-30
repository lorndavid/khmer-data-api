<template>
  <header
    :class="[
      'sticky top-0 z-40 w-full transition-all duration-300 ease-in-out',
      isScrolled || mobileMenuOpen
        ? 'bg-white/90 backdrop-blur-xl border-b border-zinc-200/80 shadow-xs'
        : 'bg-transparent border-b border-transparent shadow-none'
    ]"
  >
    <div class="mx-auto flex h-[68px] w-[92%] lg:w-[85%] max-w-[1440px] items-center justify-between px-2 sm:px-4 relative">
      <!-- Left: Brand Logo Only -->
      <div class="flex items-center shrink-0">
        <router-link
          to="/"
          class="group relative flex items-center transition-transform hover:scale-105 active:scale-95 duration-200"
          title="KhmerAPI - Home"
        >
          <img
            src="/logo_v4.png"
            alt="KhmerAPI Logo"
            class="h-9 sm:h-10 w-auto object-contain transition-all duration-200"
          />
        </router-link>
      </div>

      <!-- Center: Desktop Navigation Links (Modern Frosted Capsule Dock) -->
      <nav class="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-600 font-battambang absolute left-1/2 -translate-x-1/2 rounded-full border border-zinc-200/80 bg-white/80 backdrop-blur-xl p-1 shadow-2xs ring-1 ring-black/5 hover:border-zinc-300/90 transition-all duration-300 whitespace-nowrap">
        <router-link
          to="/docs"
          :class="[
            'rounded-full px-3.5 py-1.5 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0',
            $route.path.startsWith('/docs')
              ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
              : 'hover:text-zinc-900 hover:bg-zinc-100/90 text-zinc-600'
          ]"
        >
          <BookOpenIcon class="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t.nav.docs }}</span>
        </router-link>

        <router-link
          to="/apis"
          :class="[
            'rounded-full px-3.5 py-1.5 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0',
            $route.path === '/apis'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
              : 'hover:text-zinc-900 hover:bg-zinc-100/90 text-zinc-600'
          ]"
        >
          <Code2Icon class="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t.nav.apis }}</span>
        </router-link>

        <router-link
          to="/demographics"
          :class="[
            'rounded-full px-3.5 py-1.5 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0',
            $route.path === '/demographics'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
              : 'hover:text-zinc-900 hover:bg-zinc-100/90 text-zinc-600'
          ]"
        >
          <UsersIcon class="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t.nav.demographics }}</span>
          <span
            :class="[
              'rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-tight shrink-0',
              $route.path === '/demographics'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
            ]"
          >
            17.3M
          </span>
        </router-link>

        <router-link
          to="/explorer"
          :class="[
            'rounded-full px-3.5 py-1.5 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0',
            $route.path === '/explorer'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
              : 'hover:text-zinc-900 hover:bg-zinc-100/90 text-zinc-600'
          ]"
        >
          <CompassIcon class="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t.nav.explorer }}</span>
        </router-link>

        <router-link
          to="/status"
          :class="[
            'rounded-full px-3.5 py-1.5 transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0',
            $route.path === '/status'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold scale-[1.02]'
              : 'hover:text-zinc-900 hover:bg-zinc-100/90 text-zinc-600'
          ]"
        >
          <ActivityIcon class="w-3.5 h-3.5 opacity-75 shrink-0" />
          <span class="whitespace-nowrap">{{ langStore.t.nav.status }}</span>
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
        </router-link>
      </nav>

      <!-- Right: Language Switcher & Mobile Menu Toggle -->
      <div class="flex items-center gap-2.5 shrink-0">
        <!-- Global Language Switcher -->
        <LanguageSwitcher />

        <!-- Mobile Menu Toggle Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
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
            'rounded-xl px-3.5 py-2.5 transition-all flex items-center gap-2.5',
            $route.path.startsWith('/docs') ? 'bg-zinc-900 text-white font-bold shadow-xs' : 'hover:bg-zinc-100/90 text-zinc-700'
          ]"
        >
          <BookOpenIcon class="w-4 h-4 opacity-75" />
          <span>{{ langStore.t.nav.docs }}</span>
        </router-link>
        <router-link
          to="/apis"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-xl px-3.5 py-2.5 transition-all flex items-center gap-2.5',
            $route.path === '/apis' ? 'bg-zinc-900 text-white font-bold shadow-xs' : 'hover:bg-zinc-100/90 text-zinc-700'
          ]"
        >
          <Code2Icon class="w-4 h-4 opacity-75" />
          <span>{{ langStore.t.nav.apis }}</span>
        </router-link>
        <router-link
          to="/demographics"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-xl px-3.5 py-2.5 transition-all flex items-center justify-between',
            $route.path === '/demographics' ? 'bg-zinc-900 text-white font-bold shadow-xs' : 'hover:bg-zinc-100/90 text-zinc-700'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <UsersIcon class="w-4 h-4 opacity-75" />
            <span>{{ langStore.t.nav.demographics }}</span>
          </div>
          <span
            :class="[
              'rounded-full px-2 py-0.5 text-[10px] font-mono font-bold tracking-tight',
              $route.path === '/demographics'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
            ]"
          >
            17.3M
          </span>
        </router-link>
        <router-link
          to="/explorer"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-xl px-3.5 py-2.5 transition-all flex items-center gap-2.5',
            $route.path === '/explorer' ? 'bg-zinc-900 text-white font-bold shadow-xs' : 'hover:bg-zinc-100/90 text-zinc-700'
          ]"
        >
          <CompassIcon class="w-4 h-4 opacity-75" />
          <span>{{ langStore.t.nav.explorer }}</span>
        </router-link>
        <router-link
          to="/status"
          @click="mobileMenuOpen = false"
          :class="[
            'rounded-xl px-3.5 py-2.5 transition-all flex items-center justify-between',
            $route.path === '/status' ? 'bg-zinc-900 text-white font-bold shadow-xs' : 'hover:bg-zinc-100/90 text-zinc-700'
          ]"
        >
          <div class="flex items-center gap-2.5">
            <ActivityIcon class="w-4 h-4 opacity-75" />
            <span>{{ langStore.t.nav.status }}</span>
          </div>
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Menu as MenuIcon,
  X as XIcon,
  Compass as CompassIcon,
  BookOpen as BookOpenIcon,
  Code2 as Code2Icon,
  Users as UsersIcon,
  Activity as ActivityIcon,
} from 'lucide-vue-next';
import { useLangStore } from '../../stores/lang.store';
import LanguageSwitcher from '../common/LanguageSwitcher.vue';

const langStore = useLangStore();
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 15;
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
