<template>
  <footer class="border-t border-zinc-200 bg-[#FAFAFA] text-zinc-600 transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
        <!-- Brand column -->
        <div class="col-span-2 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">🇰🇭</span>
            <span class="font-bold tracking-tight text-zinc-900 text-base">KhmerAPI</span>
          </div>
          <p class="text-xs text-zinc-500 max-w-sm leading-relaxed">
            Free, open, and developer-friendly REST APIs providing Cambodia-specific public administrative, postal, and geographic datasets.
          </p>
          <div class="pt-2">
            <router-link
              to="/status"
              class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </router-link>
          </div>
        </div>

        <!-- Column: APIs -->
        <div class="space-y-3 text-xs">
          <h4 class="font-semibold uppercase tracking-wider text-zinc-900 text-[11px]">APIs</h4>
          <ul class="space-y-2">
            <li><router-link to="/docs/provinces" class="hover:text-zinc-900 transition-colors">Provinces</router-link></li>
            <li><router-link to="/docs/districts" class="hover:text-zinc-900 transition-colors">Districts</router-link></li>
            <li><router-link to="/docs/communes" class="hover:text-zinc-900 transition-colors">Communes</router-link></li>
            <li><router-link to="/docs/villages" class="hover:text-zinc-900 transition-colors">Villages</router-link></li>
            <li><router-link to="/docs/postal-codes" class="hover:text-zinc-900 transition-colors">Postal Codes</router-link></li>
          </ul>
        </div>

        <!-- Column: Platform -->
        <div class="space-y-3 text-xs">
          <h4 class="font-semibold uppercase tracking-wider text-zinc-900 text-[11px]">Platform</h4>
          <ul class="space-y-2">
            <li><router-link to="/docs" class="hover:text-zinc-900 transition-colors">Documentation</router-link></li>
            <li><router-link to="/explorer" class="hover:text-zinc-900 transition-colors">API Explorer</router-link></li>
            <li><router-link to="/apis" class="hover:text-zinc-900 transition-colors">API Catalog</router-link></li>
            <li><router-link to="/status" class="hover:text-zinc-900 transition-colors">System Health</router-link></li>
            <li><router-link to="/docs/rate-limits" class="hover:text-zinc-900 transition-colors">Rate Limits</router-link></li>
          </ul>
        </div>

        <!-- Column: Developer -->
        <div class="space-y-3 text-xs">
          <h4 class="font-semibold uppercase tracking-wider text-zinc-900 text-[11px]">Developer</h4>
          <ul class="space-y-2">
            <li><router-link to="/login" class="hover:text-zinc-900 transition-colors">Developer Portal</router-link></li>
            <li><router-link to="/register" class="hover:text-zinc-900 transition-colors">Get API Key</router-link></li>
            <li><a href="/docs/openapi.json" target="_blank" class="hover:text-zinc-900 transition-colors">OpenAPI 3.1 JSON</a></li>
            <li><a href="https://github.com" target="_blank" class="hover:text-zinc-900 transition-colors">GitHub Repository</a></li>
            <li><router-link to="/docs/statistics" class="hover:text-zinc-900 transition-colors">Public Statistics</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 sm:flex-row text-xs text-zinc-500">
        <p>© 2026 KhmerAPI. Free & Open Data for Cambodian Developers.</p>
        <div class="flex items-center gap-6">
          <span class="inline-flex items-center gap-1">
            Built with pride for Cambodia 🇰🇭
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>
