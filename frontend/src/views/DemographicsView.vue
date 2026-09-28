<template>
  <div class="mx-auto w-[90%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 py-10 space-y-12">
    <!-- Header Hero -->
    <div class="space-y-4 max-w-3xl">
      <div class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs shadow-2xs">
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-medium text-zinc-600">Demographics API & Historical Dataset</span>
        <span class="text-zinc-300">|</span>
        <span class="font-battambang text-zinc-900 font-bold">ស្ថិតិប្រជាជនកម្ពុជា (១៩៦២ - ២០២៤)</span>
      </div>

      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 font-battambang">
        Cambodia Population & Demographics
      </h1>
      <p class="text-base text-zinc-600 font-battambang leading-relaxed">
        ទិន្នន័យស្ថិតិប្រជាជនផ្លូវការរបស់ព្រះរាជាណាចក្រកម្ពុជា ចាប់ពីឆ្នាំ១៩៦២ រហូតដល់បច្ចុប្បន្នឆ្នាំ២០២៤ យោងតាមជំរឿនទូទៅប្រជាជន និងរបាយការណ៍អង្កេតរបស់វិទ្យាស្ថានជាតិស្ថិតិ (NIS) នៃក្រសួងផែនការ។
      </p>

      <!-- Language & Numeral Toggle -->
      <div class="flex flex-wrap items-center gap-2 pt-2">
        <button
          @click="useKhmerNumerals = false"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shadow-2xs',
            !useKhmerNumerals
              ? 'bg-zinc-900 text-white'
              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          ]"
        >
          English Format (17.3M)
        </button>
        <button
          @click="useKhmerNumerals = true"
          :class="[
            'rounded-lg px-3 py-1.5 text-xs font-battambang font-bold transition-all shadow-2xs',
            useKhmerNumerals
              ? 'bg-zinc-900 text-white'
              : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
          ]"
        >
          ទម្រង់លេខខ្មែរ (១៧.៣ លាននាក់)
        </button>
      </div>
    </div>

    <!-- 4 Key Stat Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
          <span>{{ useKhmerNumerals ? 'ប្រជាជនបច្ចុប្បន្ន (២០២៤)' : 'Current Population (2024)' }}</span>
          <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Latest</span>
        </div>
        <div class="text-3xl font-extrabold text-zinc-900 font-battambang">
          {{ useKhmerNumerals ? '១៧.៣ លាន' : '17.3 Million' }}
        </div>
        <div class="text-xs text-zinc-500 font-battambang">
          {{ useKhmerNumerals ? 'ស្មើនឹង ១៧,៣០០,០០០ នាក់' : '17,300,000 Total citizens' }}
        </div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
          <span>{{ useKhmerNumerals ? 'កំណើនសរុប (១៩៦២-២០២៤)' : 'Overall Growth (1962–2024)' }}</span>
          <span class="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">+203.5%</span>
        </div>
        <div class="text-3xl font-extrabold text-zinc-900 font-battambang">
          {{ useKhmerNumerals ? '+១១.៦ លាន' : '+11.6 Million' }}
        </div>
        <div class="text-xs text-zinc-500 font-battambang">
          {{ useKhmerNumerals ? 'កើនឡើង ៣ ដងធៀបនឹងឆ្នាំ១៩៦២' : '3.03x increase from 5.7M base' }}
        </div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
          <span>{{ useKhmerNumerals ? 'អត្រាកំណើនប្រចាំឆ្នាំ' : 'Annual Growth Rate' }}</span>
          <span class="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">Annual</span>
        </div>
        <div class="text-3xl font-extrabold text-zinc-900 font-battambang">
          {{ useKhmerNumerals ? '~២.០៩% / ឆ្នាំ' : '~2.09% / yr' }}
        </div>
        <div class="text-xs text-zinc-500 font-battambang">
          {{ useKhmerNumerals ? 'ផ្អែកលើការប៉ាន់ស្មាន ២០១៩-២០២៤' : 'Based on 2019-2024 census interval' }}
        </div>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs font-medium text-zinc-500">
          <span>{{ useKhmerNumerals ? 'ចំនួនជំរឿនផ្លូវការ' : 'Census Milestones' }}</span>
          <span class="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-700">NIS</span>
        </div>
        <div class="text-3xl font-extrabold text-zinc-900 font-battambang">
          {{ useKhmerNumerals ? '១០ លើក' : '10 Records' }}
        </div>
        <div class="text-xs text-zinc-500 font-battambang">
          {{ useKhmerNumerals ? '១៩៦២, ១៩៨០, ១៩៩៤, ១៩៩៨...' : 'From 1962 to 2024' }}
        </div>
      </div>
    </div>

    <!-- Historical Population Interactive Bar Chart & Timeline -->
    <div class="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-zinc-900 font-battambang">
            {{ useKhmerNumerals ? 'តារាងប្រៀបធៀបការវិវត្តន៍ចំនួនប្រជាជន (១៩៦២ - ២០២៤)' : 'Historical Population Timeline (1962 - 2024)' }}
          </h3>
          <p class="text-xs text-zinc-500 font-battambang">
            {{ useKhmerNumerals ? 'ចុចលើឆ្នាំនីមួយៗដើម្បីមើលព័ត៌មានលម្អិតនៃជំរឿន' : 'Click on any year to inspect survey provenance & growth calculation' }}
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span class="inline-block h-3 w-3 rounded bg-zinc-900"></span>
          <span>Population (Millions)</span>
        </div>
      </div>

      <!-- Custom SVG / CSS Dynamic Bar Chart -->
      <div class="pt-6 pb-2">
        <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-4 items-end h-64 border-b border-zinc-200 pb-2">
          <div
            v-for="item in historicalData"
            :key="item.year"
            @click="selectedYear = item"
            :class="[
              'group flex flex-col items-center justify-end h-full cursor-pointer transition-all',
              selectedYear?.year === item.year ? 'scale-105' : 'hover:opacity-90'
            ]"
          >
            <!-- Population label above bar -->
            <div class="text-[10px] sm:text-xs font-mono font-bold mb-1.5 transition-colors" :class="selectedYear?.year === item.year ? 'text-emerald-600' : 'text-zinc-700'">
              {{ useKhmerNumerals ? item.population_km.split(' ')[0] : item.population_millions + 'M' }}
            </div>

            <!-- Bar element -->
            <div class="w-full bg-zinc-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end" :style="{ height: `${(item.population_millions / 18) * 100}%` }">
              <div
                class="w-full rounded-t-lg transition-all duration-500"
                :class="[
                  selectedYear?.year === item.year
                    ? 'bg-zinc-900 shadow-sm'
                    : 'bg-zinc-800 group-hover:bg-zinc-700'
                ]"
                :style="{ height: '100%' }"
              ></div>
            </div>

            <!-- Year label below bar -->
            <div class="mt-2 text-[10px] sm:text-xs font-battambang font-bold" :class="selectedYear?.year === item.year ? 'text-zinc-950 underline' : 'text-zinc-500'">
              {{ useKhmerNumerals ? item.year_km : item.year }}
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Milestone Detail Card -->
      <div v-if="selectedYear" class="rounded-xl border border-zinc-200/90 bg-zinc-50/75 p-4 sm:p-5 text-xs text-zinc-700 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="rounded bg-zinc-900 text-white font-mono px-2 py-0.5 text-xs font-bold">
              {{ useKhmerNumerals ? selectedYear.year_km : selectedYear.year }}
            </span>
            <span class="font-battambang font-bold text-sm text-zinc-900">
              {{ useKhmerNumerals ? `ចំនួនប្រជាជន៖ ${selectedYear.population_km}` : `Total Population: ${selectedYear.population_millions} Million (${selectedYear.population_total.toLocaleString()} citizens)` }}
            </span>
          </div>

          <div v-if="selectedYear.growth_since_previous_pct" class="font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            +{{ selectedYear.growth_since_previous_pct }}% since previous census
          </div>
        </div>

        <div class="text-xs text-zinc-600 font-battambang flex items-start gap-1.5">
          <span class="font-bold text-zinc-900 shrink-0">ប្រភពឯកសារ៖</span>
          <span>{{ selectedYear.source_km }} ({{ selectedYear.source }})</span>
        </div>
      </div>
    </div>

    <!-- Province Breakdown & Distribution Table -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left: Province Table (2 Cols) -->
      <div class="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-base font-bold text-zinc-900 font-battambang">
              {{ useKhmerNumerals ? 'ការបែងចែកប្រជាជនតាមរាជធានី-ខេត្ត (២០២៤)' : 'Population Distribution by Province (2024 Estimates)' }}
            </h3>
            <p class="text-xs text-zinc-500 font-battambang">
              {{ useKhmerNumerals ? 'ទិន្នន័យប្រមាណចំនួនប្រជាជនទាំង ២៥ រាជធានី-ខេត្ត' : '25 Capital & Provinces breakdown based on NIS Cambodia' }}
            </p>
          </div>

          <input
            v-model="provinceSearch"
            type="text"
            placeholder="Search province..."
            class="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 w-44 font-battambang"
          />
        </div>

        <div class="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table class="w-full text-left text-xs">
            <thead class="sticky top-0 bg-zinc-50/95 backdrop-blur-xs border-b border-zinc-200 text-zinc-600 font-semibold">
              <tr>
                <th class="px-3.5 py-2.5">Code</th>
                <th class="px-3.5 py-2.5">Province (English)</th>
                <th class="px-3.5 py-2.5 font-battambang">រាជធានី-ខេត្ត (Khmer)</th>
                <th class="px-3.5 py-2.5 text-right">Population</th>
                <th class="px-3.5 py-2.5 text-right">% Share</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 text-zinc-700">
              <tr v-for="prov in filteredProvinces" :key="prov.code" class="hover:bg-zinc-50/60 transition-colors">
                <td class="px-3.5 py-2 font-mono font-bold text-zinc-900">{{ prov.code }}</td>
                <td class="px-3.5 py-2 font-medium text-zinc-900">{{ prov.name_en }}</td>
                <td class="px-3.5 py-2 font-battambang text-zinc-800">{{ prov.name_km }}</td>
                <td class="px-3.5 py-2 text-right font-mono font-bold text-zinc-900">
                  {{ useKhmerNumerals ? prov.population_km : prov.population_estimate.toLocaleString() }}
                </td>
                <td class="px-3.5 py-2 text-right font-mono text-zinc-500">
                  <div class="flex items-center justify-end gap-2">
                    <span>{{ prov.pct_of_total }}%</span>
                    <div class="w-12 h-1.5 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                      <div class="bg-zinc-900 h-full" :style="{ width: `${prov.pct_of_total * 5}%` }"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Live API Tester -->
      <div class="space-y-6">
        <div class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                GET /api/v1/demographics/population
              </span>
              <span v-if="latencyMs" class="font-mono text-[10px] text-emerald-600 font-bold">
                {{ latencyMs }}ms
              </span>
            </div>
            <h4 class="text-sm font-bold text-zinc-900 font-battambang">
              Demographics REST API
            </h4>
            <p class="text-xs text-zinc-600 font-battambang leading-relaxed">
              ទាញយកទិន្នន័យប្រជាសាស្ត្រ និងស្ថិតិប្រជាជនជាទម្រង់ JSON សម្រាប់យកទៅប្រើប្រាស់ក្នុង App ឬ Website របស់អ្នក។
            </p>
          </div>

          <button
            @click="fetchApiLive"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-2xs cursor-pointer"
          >
            <Loader2Icon v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
            <PlayIcon v-else class="w-3.5 h-3.5 fill-current" />
            <span>{{ isLoading ? 'Fetching from API...' : 'Test Live API' }}</span>
          </button>

          <!-- Response Snippet -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-bold text-zinc-700 uppercase">
              <span>JSON Response</span>
              <span class="text-[10px] font-mono text-zinc-400">200 OK</span>
            </div>
            <JsonViewer
              :data="apiResponse || SAMPLE_RESPONSE"
              :showHeader="false"
              :maxHeight="'260px'"
            />
          </div>
        </div>

        <!-- Code Block -->
        <div class="space-y-2">
          <div class="text-xs font-bold uppercase tracking-wider text-zinc-700">
            Client Integration
          </div>
          <CodeBlock
            endpoint="/api/v1/demographics/population"
            method="GET"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import {
  Play as PlayIcon,
  Loader2 as Loader2Icon,
} from 'lucide-vue-next';
import JsonViewer from '../components/common/JsonViewer.vue';
import CodeBlock from '../components/common/CodeBlock.vue';

const useKhmerNumerals = ref(true);
const provinceSearch = ref('');
const isLoading = ref(false);
const latencyMs = ref<number | null>(null);
const apiResponse = ref<any>(null);

const historicalData = [
  { year: 1962, year_km: '១៩៦២', population_millions: 5.7, population_total: 5700000, population_km: '៥.៧ លាននាក់', growth_since_previous_pct: null, source: 'Census 1962', source_km: 'ជំរឿនប្រជាជនទូទៅនៃប្រទេសកម្ពុជា ឆ្នាំ១៩៦២' },
  { year: 1980, year_km: '១៩៨០', population_millions: 6.6, population_total: 6600000, population_km: '៦.៦ លាននាក់', growth_since_previous_pct: 15.79, source: 'UN Assessment', source_km: 'ការប៉ាន់ប្រមាណស្ថិតិប្រជាជនក្រោយសង្គ្រាម' },
  { year: 1994, year_km: '១៩៩៤', population_millions: 9.9, population_total: 9900000, population_km: '៩.៩ លាននាក់', growth_since_previous_pct: 50.0, source: 'NIS Socio-Economic Survey', source_km: 'ការអង្កេតសេដ្ឋកិច្ច-សង្គមកិច្ចកម្ពុជា' },
  { year: 1996, year_km: '១៩៩៦', population_millions: 10.7, population_total: 10700000, population_km: '១០.៧ លាននាក់', growth_since_previous_pct: 8.08, source: 'Demographic Survey 1996', source_km: 'ការអង្កេតប្រជាសាស្ត្រកម្ពុជា ឆ្នាំ១៩៩៦' },
  { year: 1998, year_km: '១៩៩៨', population_millions: 11.4, population_total: 11400000, population_km: '១១.៤ លាននាក់', growth_since_previous_pct: 6.54, source: 'Census 1998 (NIS)', source_km: 'ជំរឿនប្រជាជនទូទៅនៃកម្ពុជា ឆ្នាំ១៩៩៨' },
  { year: 2004, year_km: '២០០៤', population_millions: 12.8, population_total: 12800000, population_km: '១២.៨ លាននាក់', growth_since_previous_pct: 12.28, source: 'Inter-Censal Survey 2004', source_km: 'ការអង្កេតចន្លោះជំរឿនប្រជាជនកម្ពុជា ឆ្នាំ២០០៤' },
  { year: 2008, year_km: '២០០៨', population_millions: 13.4, population_total: 13400000, population_km: '១៣.៤ លាននាក់', growth_since_previous_pct: 4.69, source: 'Census 2008', source_km: 'ជំរឿនប្រជាជនទូទៅនៃកម្ពុជា ឆ្នាំ២០០៨' },
  { year: 2013, year_km: '២០១៣', population_millions: 14.7, population_total: 14700000, population_km: '១៤.៧ លាននាក់', growth_since_previous_pct: 9.70, source: 'Inter-Censal Survey 2013', source_km: 'ការអង្កេតចន្លោះជំរឿនប្រជាជនកម្ពុជា ឆ្នាំ២០១៣' },
  { year: 2019, year_km: '២០១៩', population_millions: 15.6, population_total: 15600000, population_km: '១៥.៦ លាននាក់', growth_since_previous_pct: 6.12, source: 'Census 2019 (NIS & MoP)', source_km: 'ជំរឿនប្រជាជនទូទៅនៃកម្ពុជា ឆ្នាំ២០១៩' },
  { year: 2024, year_km: '២០២៤', population_millions: 17.3, population_total: 17300000, population_km: '១៧.៣ លាននាក់', growth_since_previous_pct: 10.90, source: 'NIS 2024 Official Projection', source_km: 'របាយការណ៍ព្យាករណ៍ប្រជាជនផ្លូវការ ឆ្នាំ២០២៤ (ក្រសួងផែនការ)' },
];

const selectedYear = ref<any>(historicalData[historicalData.length - 1]);

const provinceList = [
  { code: '12', name_en: 'Phnom Penh', name_km: 'រាជធានីភ្នំពេញ', population_estimate: 2280000, population_km: '២.២៨ លាននាក់', pct_of_total: 13.18 },
  { code: '08', name_en: 'Kandal', name_km: 'ខេត្តកណ្តាល', population_estimate: 1280000, population_km: '១.២៨ លាននាក់', pct_of_total: 7.40 },
  { code: '17', name_en: 'Siem Reap', name_km: 'ខេត្តសៀមរាប', population_estimate: 1080000, population_km: '១.០៨ លាននាក់', pct_of_total: 6.24 },
  { code: '03', name_en: 'Kampong Cham', name_km: 'ខេត្តកំពង់ចាម', population_estimate: 1050000, population_km: '១.០៥ លាននាក់', pct_of_total: 6.07 },
  { code: '02', name_en: 'Battambang', name_km: 'ខេត្តបាត់ដំបង', population_estimate: 1040000, population_km: '១.០៤ លាននាក់', pct_of_total: 6.01 },
  { code: '21', name_en: 'Takeo', name_km: 'ខេត្តតាកែវ', population_estimate: 960000, population_km: '៩៦ ម៉ឺននាក់', pct_of_total: 5.55 },
  { code: '14', name_en: 'Prey Veng', name_km: 'ខេត្តព្រៃវែង', population_estimate: 940000, population_km: '៩៤ ម៉ឺននាក់', pct_of_total: 5.43 },
  { code: '01', name_en: 'Banteay Meanchey', name_km: 'ខេត្តបន្ទាយមានជ័យ', population_estimate: 880000, population_km: '៨៨ ម៉ឺននាក់', pct_of_total: 5.09 },
  { code: '05', name_en: 'Kampong Thom', name_km: 'ខេត្តកំពង់ធំ', population_estimate: 730000, population_km: '៧៣ ម៉ឺននាក់', pct_of_total: 4.22 },
  { code: '06', name_en: 'Kampong Speu', name_km: 'ខេត្តកំពង់ស្ពឺ', population_estimate: 910000, population_km: '៩១ ម៉ឺននាក់', pct_of_total: 5.26 },
  { code: '07', name_en: 'Kampot', name_km: 'ខេត្តកំពត', population_estimate: 640000, population_km: '៦៤ ម៉ឺននាក់', pct_of_total: 3.70 },
  { code: '04', name_en: 'Kampong Chhnang', name_km: 'ខេត្តកំពង់ឆ្នាំង', population_estimate: 560000, population_km: '៥៦ ម៉ឺននាក់', pct_of_total: 3.24 },
  { code: '20', name_en: 'Svay Rieng', name_km: 'ខេត្តស្វាយរៀង', population_estimate: 540000, population_km: '៥៤ ម៉ឺននាក់', pct_of_total: 3.12 },
  { code: '15', name_en: 'Pursat', name_km: 'ខេត្តពោធិ៍សាត់', population_estimate: 440000, population_km: '៤៤ ម៉ឺននាក់', pct_of_total: 2.54 },
  { code: '10', name_en: 'Kratie', name_km: 'ខេត្តក្រចេះ', population_estimate: 410000, population_km: '៤១ ម៉ឺននាក់', pct_of_total: 2.37 },
  { code: '18', name_en: 'Preah Sihanouk', name_km: 'ខេត្តព្រះសីហនុ', population_estimate: 330000, population_km: '៣៣ ម៉ឺននាក់', pct_of_total: 1.91 },
  { code: '22', name_en: 'Oddar Meanchey', name_km: 'ខេត្តឧត្តរមានជ័យ', population_estimate: 290000, population_km: '២៩ ម៉ឺននាក់', pct_of_total: 1.68 },
  { code: '13', name_en: 'Preah Vihear', name_km: 'ខេត្តព្រះវិហារ', population_estimate: 280000, population_km: '២៨ ម៉ឺននាក់', pct_of_total: 1.62 },
  { code: '16', name_en: 'Ratanak Kiri', name_km: 'ខេត្តរតនគិរី', population_estimate: 230000, population_km: '២៣ ម៉ឺននាក់', pct_of_total: 1.33 },
  { code: '19', name_en: 'Stung Treng', name_km: 'ខេត្តស្ទឹងត្រែង', population_estimate: 170000, population_km: '១៧ ម៉ឺននាក់', pct_of_total: 0.98 },
  { code: '09', name_en: 'Koh Kong', name_km: 'ខេត្តកោះកុង', population_estimate: 140000, population_km: '១៤ ម៉ឺននាក់', pct_of_total: 0.81 },
  { code: '11', name_en: 'Mondul Kiri', name_km: 'ខេត្តមណ្ឌលគិរី', population_estimate: 96000, population_km: '៩.៦ ម៉ឺននាក់', pct_of_total: 0.55 },
  { code: '25', name_en: 'Tboung Khmum', name_km: 'ខេត្តត្បូងឃ្មុំ', population_estimate: 820000, population_km: '៨២ ម៉ឺននាក់', pct_of_total: 4.74 },
  { code: '24', name_en: 'Pailin', name_km: 'ខេត្តប៉ៃលិន', population_estimate: 77000, population_km: '៧.៧ ម៉ឺននាក់', pct_of_total: 0.45 },
  { code: '23', name_en: 'Kep', name_km: 'ខេត្តកែប', population_estimate: 44000, population_km: '៤.៤ ម៉ឺននាក់', pct_of_total: 0.25 },
];

const filteredProvinces = computed(() => {
  const q = provinceSearch.value.trim().toLowerCase();
  if (!q) return provinceList;
  return provinceList.filter(
    (p) =>
      p.name_en.toLowerCase().includes(q) ||
      p.name_km.includes(q) ||
      p.code.includes(q)
  );
});

async function fetchApiLive() {
  isLoading.value = true;
  const start = performance.now();
  try {
    const res = await axios.get('/api/v1/demographics/population');
    latencyMs.value = Math.max(1, Math.round(performance.now() - start));
    apiResponse.value = res.data;
  } catch (err: any) {
    latencyMs.value = Math.max(1, Math.round(performance.now() - start));
    apiResponse.value = err.response ? err.response.data : { error: err.message };
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchApiLive();
});

const SAMPLE_RESPONSE = {
  success: true,
  data: {
    country: "Kingdom of Cambodia",
    country_km: "ព្រះរាជាណាចក្រកម្ពុជា",
    latest: {
      year: 2024,
      year_km: "២០២៤",
      population_millions: 17.3,
      population_total: 17300000,
      population_km: "១៧.៣ លាននាក់"
    },
    historical_count: 10
  }
};
</script>
