<template>
  <footer class="border-t border-zinc-200 bg-[#FAFAFA] text-zinc-600 transition-colors font-battambang">
    <div class="mx-auto w-[92%] lg:w-[85%] max-w-[1440px] px-2 sm:px-4 py-12">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
        <!-- Brand column -->
        <div class="col-span-2 space-y-3">
          <div class="flex items-center gap-2.5">
            <img src="/logo_v4.png" alt="KhmerAPI Logo" class="h-8 w-auto object-contain" />
            <span class="font-bold tracking-tight text-zinc-900 text-base">KhmerAPI</span>
            <span class="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-mono font-medium text-zinc-700 border border-zinc-200">v1.0</span>
          </div>
          <p class="text-xs text-zinc-500 max-w-sm leading-relaxed">
            {{ langStore.t.footer.tagline }}
          </p>
          <div class="pt-2">
            <router-link
              to="/status"
              class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ langStore.t.status.allOperational }}</span>
            </router-link>
          </div>
        </div>

        <!-- Column: APIs -->
        <div class="space-y-3 text-xs">
          <h4 class="font-bold uppercase tracking-wider text-zinc-900 text-[11px]">{{ langStore.t.nav.apis }}</h4>
          <ul class="space-y-2">
            <li><router-link to="/docs#provinces" class="hover:text-zinc-900 transition-colors">{{ langStore.t.home.statProvinces }}</router-link></li>
            <li><router-link to="/docs#districts" class="hover:text-zinc-900 transition-colors">{{ langStore.t.home.statDistricts }}</router-link></li>
            <li><router-link to="/docs#communes" class="hover:text-zinc-900 transition-colors">{{ langStore.t.home.statCommunes }}</router-link></li>
            <li><router-link to="/docs#villages" class="hover:text-zinc-900 transition-colors">{{ langStore.t.home.statVillages }}</router-link></li>
            <li><router-link to="/docs#postal-codes" class="hover:text-zinc-900 transition-colors">{{ langStore.t.home.statPostal }}</router-link></li>
          </ul>
        </div>

        <!-- Column: Platform -->
        <div class="space-y-3 text-xs">
          <h4 class="font-bold uppercase tracking-wider text-zinc-900 text-[11px]">{{ langStore.t.footer.navigation }}</h4>
          <ul class="space-y-2">
            <li><router-link to="/docs" class="hover:text-zinc-900 transition-colors">{{ langStore.t.nav.docs }}</router-link></li>
            <li><router-link to="/explorer" class="hover:text-zinc-900 transition-colors">{{ langStore.t.nav.explorer }}</router-link></li>
            <li><router-link to="/demographics" class="hover:text-zinc-900 transition-colors">{{ langStore.t.nav.demographics }}</router-link></li>
            <li><router-link to="/apis" class="hover:text-zinc-900 transition-colors">{{ langStore.t.nav.apis }}</router-link></li>
            <li><router-link to="/status" class="hover:text-zinc-900 transition-colors">{{ langStore.t.nav.status }}</router-link></li>
          </ul>
        </div>

        <!-- Column: Developer -->
        <div class="space-y-3 text-xs">
          <h4 class="font-bold uppercase tracking-wider text-zinc-900 text-[11px]">{{ langStore.t.footer.resources }}</h4>
          <ul class="space-y-2">
            <li><a href="/docs/openapi.json" target="_blank" class="hover:text-zinc-900 transition-colors">OpenAPI 3.1 Spec (JSON)</a></li>
            <li><router-link to="/docs#geo" class="hover:text-zinc-900 transition-colors">GeoJSON GIS Layers</router-link></li>
            <li><router-link to="/demographics" class="hover:text-zinc-900 transition-colors">Census Demographics 1962–2024</router-link></li>
            <li><router-link to="/docs#rate-limits" class="hover:text-zinc-900 transition-colors">Rate Limit Policy</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/80 pt-6 sm:flex-row text-xs text-zinc-500">
        <p>{{ langStore.t.footer.legal }}</p>
        <div class="flex items-center gap-6">
          <span class="inline-flex items-center gap-1 font-semibold text-zinc-700">
            {{ langStore.t.footer.allRights }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useLangStore } from '../../stores/lang.store';

const langStore = useLangStore();
</script>
