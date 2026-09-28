<template>
  <aside class="w-64 shrink-0 py-6 pr-6 border-r border-zinc-200/80 hidden md:block">
    <nav class="space-y-6 text-xs sticky top-20">
      <!-- Section: Overview -->
      <div class="space-y-1.5">
        <h5 class="px-2.5 font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
          Overview
        </h5>
        <div class="space-y-0.5">
          <router-link
            v-for="item in overviewLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-colors',
              $route.path === item.path
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            ]"
          >
            <span>{{ item.title }}</span>
          </router-link>
        </div>
      </div>

      <!-- Section: Location & Administrative Hierarchy -->
      <div class="space-y-1.5">
        <h5 class="px-2.5 font-semibold uppercase tracking-wider text-[11px] text-zinc-900 flex items-center justify-between">
          <span>Administrative Data</span>
          <span class="rounded bg-zinc-100 px-1.5 py-0.2 font-mono text-[9px] text-zinc-500 border border-zinc-200">5 Endpoints</span>
        </h5>
        <div class="space-y-0.5">
          <router-link
            v-for="item in locationLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-colors',
              $route.path === item.path
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] text-emerald-600 font-bold" :class="$route.path === item.path ? 'text-emerald-300' : ''">GET</span>
              <span>{{ item.title }}</span>
            </div>
            <span v-if="item.badge" class="font-km text-[11px] text-zinc-400" :class="$route.path === item.path ? 'text-zinc-300' : ''">{{ item.badge }}</span>
          </router-link>
        </div>
      </div>

      <!-- Section: Utilities & Services -->
      <div class="space-y-1.5">
        <h5 class="px-2.5 font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
          Services & Search
        </h5>
        <div class="space-y-0.5">
          <router-link
            v-for="item in serviceLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-colors',
              $route.path === item.path
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            ]"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] text-emerald-600 font-bold" :class="$route.path === item.path ? 'text-emerald-300' : ''">GET</span>
              <span>{{ item.title }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Section: Developer Platform -->
      <div class="space-y-1.5">
        <h5 class="px-2.5 font-semibold uppercase tracking-wider text-[11px] text-zinc-900">
          Platform & Status
        </h5>
        <div class="space-y-0.5">
          <router-link
            v-for="item in platformLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center justify-between rounded-lg px-2.5 py-1.5 font-medium transition-colors',
              $route.path === item.path
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            ]"
          >
            <span>{{ item.title }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const overviewLinks = [
  { title: 'Getting Started', path: '/docs/getting-started' },
  { title: 'Authentication', path: '/docs/authentication' },
  { title: 'Rate Limits', path: '/docs/rate-limits' },
  { title: 'Errors & Request IDs', path: '/docs/errors' },
];

const locationLinks = [
  { title: 'Provinces', path: '/docs/provinces', badge: 'ខេត្ត/រាជធានី' },
  { title: 'Districts', path: '/docs/districts', badge: 'ស្រុក/ខណ្ឌ' },
  { title: 'Communes', path: '/docs/communes', badge: 'ឃុំ/សង្កាត់' },
  { title: 'Villages', path: '/docs/villages', badge: 'ភូមិ' },
  { title: 'Postal Codes', path: '/docs/postal-codes', badge: 'លេខកូដប្រៃសណីយ៍' },
  { title: 'Address Tree', path: '/docs/locations', badge: 'ឋានានុក្រម' },
];

const serviceLinks = [
  { title: 'Search API', path: '/docs/search' },
  { title: 'Geo Spatial (GeoJSON)', path: '/docs/geo' },
  { title: 'Statistics API', path: '/docs/statistics' },
  { title: 'Data Provenance', path: '/docs/data-sources' },
];

const platformLinks = [
  { title: 'Interactive Explorer', path: '/explorer' },
  { title: 'System Status', path: '/status' },
  { title: 'OpenAPI Specification', path: '/docs/openapi' },
];
</script>
