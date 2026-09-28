<template>
  <div class="mx-auto w-[90%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4 py-12 space-y-10 font-battambang">
    <!-- Header -->
    <div class="space-y-3 max-w-3xl">
      <div class="inline-flex items-center gap-2">
        <span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-mono text-zinc-600 border border-zinc-200">REST API v1.0</span>
        <span class="text-xs font-mono text-emerald-600 font-bold">100% Free & Open</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
        {{ langStore.t.apis.title }}
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 leading-relaxed">
        {{ langStore.t.apis.subtitle }}
      </p>
    </div>

    <!-- API Cards Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="api in getApiServices(langStore.currentLang)"
        :key="api.id"
        class="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs hover:border-zinc-300 hover:shadow-card transition-all"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
              {{ api.category }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              <span>{{ api.status }}</span>
            </span>
          </div>

          <h3 class="text-base font-bold text-zinc-900">{{ api.title }}</h3>
          <p class="text-xs text-zinc-600 leading-relaxed">{{ api.description }}</p>

          <!-- Endpoints list sample -->
          <div class="pt-2 space-y-1 font-mono text-[11px] text-zinc-500">
            <div v-for="ep in api.sampleEndpoints" :key="ep" class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-bold text-[10px]">GET</span>
              <span class="text-zinc-700">{{ ep }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs font-medium">
          <span class="text-zinc-400 font-mono text-[11px]">{{ api.endpointCount }} Endpoints</span>
          <div class="flex items-center gap-3">
            <router-link
              :to="{ path: '/explorer', query: { endpoint: api.sampleEndpoints[0] } }"
              class="text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Test
            </router-link>
            <router-link
              :to="api.docPath"
              class="rounded-md bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800 transition-colors shadow-2xs"
            >
              {{ langStore.t.apis.viewInDocs }} →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Future Modules Notice -->
    <div class="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-6 sm:p-8 space-y-3">
      <div class="flex items-center gap-2">
        <SparklesIcon class="w-4 h-4 text-amber-500" />
        <h3 class="text-sm font-bold text-zinc-900">
          {{ langStore.currentLang === 'km' ? 'គម្រោងអភិវឌ្ឍន៍ API បន្ទាប់ (Roadmap)' : 'Upcoming API Modules (Roadmap)' }}
        </h3>
      </div>
      <p class="text-xs text-zinc-600 max-w-2xl leading-relaxed">
        {{ langStore.currentLang === 'km' ? 'ប្រព័ន្ធ KhmerAPI ត្រូវបានរៀបចំឡើងជាលក្ខណៈ Modular។ ជំនាន់បន្ទាប់នឹងរួមបញ្ចូលនូវ អត្រាប្តូរប្រាក់ប្រចាំថ្ងៃពីធនាគារជាតិនៃកម្ពុជា (NBC), កម្មវិធីបម្លែងលេខខ្មែរ-កាលបរិច្ឆេទ, ថ្ងៃឈប់សម្រាកបុណ្យជាតិ និងការព្យាករណ៍អាកាសធាតុតាមខេត្ត។' : 'The KhmerAPI gateway is modularly designed. Future releases will include NBC Daily Exchange Rates, Khmer Number & Date Transliteration, National Public Holidays, and Provincial Weather Data.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles as SparklesIcon } from 'lucide-vue-next';
import { useLangStore } from '../stores/lang.store';

const langStore = useLangStore();

interface ApiServiceCard {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  endpointCount: number;
  docPath: string;
  sampleEndpoints: string[];
}

function getApiServices(lang: 'km' | 'en'): ApiServiceCard[] {
  if (lang === 'km') {
    return [
      {
        id: 'provinces',
        category: 'ឋានានុក្រម',
        title: 'រាជធានី និងខេត្ត (Provinces)',
        description: 'ទាញយកទិន្នន័យផ្លូវការនៃ ២៥ រាជធានី-ខេត្ត រួមមានកូដ ប្រភេទ និងកូអរដោនេភូមិសាស្ត្រ។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 3,
        docPath: '/docs#provinces',
        sampleEndpoints: ['/provinces', '/provinces/12', '/provinces/12/districts'],
      },
      {
        id: 'districts',
        category: 'ឋានានុក្រម',
        title: 'ក្រុង / ស្រុក / ខណ្ឌ (Districts)',
        description: 'ទាញយកទិន្នន័យ ២១០ ក្រុង-ស្រុក-ខណ្ឌ ទូទាំងប្រទេសកម្ពុជា ជាមួយប្រព័ន្ធ Pagination និង Search។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 3,
        docPath: '/docs#districts',
        sampleEndpoints: ['/districts', '/districts/1201', '/districts/1201/communes'],
      },
      {
        id: 'communes',
        category: 'ឋានានុក្រម',
        title: 'ឃុំ / សង្កាត់ (Communes)',
        description: 'ទិន្នន័យ ១,៦៦១ ឃុំ-សង្កាត់ ជាមួយឈ្មោះអក្សរខ្មែរ អក្សរឡាតាំង និងកូអរដោនេ។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 3,
        docPath: '/docs#communes',
        sampleEndpoints: ['/communes', '/communes/120101', '/communes/120101/villages'],
      },
      {
        id: 'villages',
        category: 'ឋានានុក្រម',
        title: 'ភូមិ (Villages)',
        description: 'ទិន្នន័យភូមិពេញលេញ ១៤,៥២៨ ភូមិទូទាំងប្រទេសកម្ពុជា ភ្ជាប់ជាមួយឃុំ-សង្កាត់។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 2,
        docPath: '/docs#villages',
        sampleEndpoints: ['/villages', '/villages/12010101'],
      },
      {
        id: 'demographics',
        category: 'ប្រជាសាស្ត្រ',
        title: 'ស្ថិតិប្រជាសាស្ត្រ & ប្រជាជន',
        description: 'ទិន្នន័យជំរឿនប្រជាជនពីឆ្នាំ១៩៦២ ដល់ ២០២៤ និងការបែងចែកតាមខេត្តពីវិទ្យាស្ថានជាតិស្ថិតិ។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 1,
        docPath: '/demographics',
        sampleEndpoints: ['/demographics/population'],
      },
      {
        id: 'postal-codes',
        category: 'ប្រៃសណីយ៍',
        title: 'លេខកូដប្រៃសណីយ៍កម្ពុជា (Postal Codes)',
        description: 'ស្វែងរកលេខកូដប្រៃសណីយ៍ ៥ ខ្ទង់ផ្លូវការភ្ជាប់ជាមួយរាជធានី-ខេត្ត ស្រុក-ខណ្ឌ និងឃុំ-សង្កាត់។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 2,
        docPath: '/docs#postal-codes',
        sampleEndpoints: ['/postal-codes/12000'],
      },
      {
        id: 'locations',
        category: 'ឋានានុក្រមពេញលេញ',
        title: 'ស្វែងរកដើមឈើអាសយដ្ឋាន (Location Tree)',
        description: 'ស្វែងរកឋានានុក្រម ៤ ថ្នាក់តែម្តង (ខេត្ត, ស្រុក, ឃុំ, ភូមិ និងលេខប្រៃសណីយ៍) ដោយប្រើលេខកូដតែមួយ។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 1,
        docPath: '/docs#locations',
        sampleEndpoints: ['/locations/12010101'],
      },
      {
        id: 'search',
        category: 'ស្វែងរក',
        title: 'ស្វែងរកពហុភាសា (Universal Search)',
        description: 'ស្វែងរកបានទាំងអក្សរខ្មែរ អក្សរឡាតាំង លេខកូដ និងឈ្មោះ ដោយប្រើ Trigram Fuzzy Search។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 1,
        docPath: '/docs#search',
        sampleEndpoints: ['/search?q=Phnom%20Penh'],
      },
      {
        id: 'geo',
        category: 'ផែនទី GIS',
        title: 'កូអរដោនេ & ព្រំប្រទល់ GeoJSON',
        description: 'ទាញយកចំណុច និងស្រទាប់ Polygon ព្រំប្រទល់ GeoJSON (RFC 7946) សម្រាប់ Leaflet, Mapbox និង Google Maps។',
        status: 'ដំណើរការប្រក្រតី',
        endpointCount: 2,
        docPath: '/docs#geo',
        sampleEndpoints: ['/geo/provinces', '/geo/layers/provinces'],
      },
    ];
  }

  return [
    {
      id: 'provinces',
      category: 'Hierarchy',
      title: 'Provinces & Capital',
      description: 'Retrieve all 25 official Cambodian provinces and the capital Phnom Penh with codes, types, and coordinates.',
      status: 'Operational',
      endpointCount: 3,
      docPath: '/docs#provinces',
      sampleEndpoints: ['/provinces', '/provinces/12', '/provinces/12/districts'],
    },
    {
      id: 'districts',
      category: 'Hierarchy',
      title: 'Districts (Khan / Srok / Krong)',
      description: 'Query all 210 second-tier administrative divisions across all 25 provinces with pagination and search.',
      status: 'Operational',
      endpointCount: 3,
      docPath: '/docs#districts',
      sampleEndpoints: ['/districts', '/districts/1201', '/districts/1201/communes'],
    },
    {
      id: 'communes',
      category: 'Hierarchy',
      title: 'Communes (Sangkat / Khum)',
      description: 'Access all 1,661 third-tier administrative subdivisions with native Khmer names and coordinates.',
      status: 'Operational',
      endpointCount: 3,
      docPath: '/docs#communes',
      sampleEndpoints: ['/communes', '/communes/120101', '/communes/120101/villages'],
    },
    {
      id: 'villages',
      category: 'Hierarchy',
      title: 'Villages (Phum)',
      description: 'Explore all 14,528 fourth-tier villages across Cambodia with commune relationships.',
      status: 'Operational',
      endpointCount: 2,
      docPath: '/docs#villages',
      sampleEndpoints: ['/villages', '/villages/12010101'],
    },
    {
      id: 'demographics',
      category: 'Demographics',
      title: 'Population & Demographics',
      description: 'Census dataset from 1962 to 2024 and 25-province population estimates from NIS Ministry of Planning.',
      status: 'Operational',
      endpointCount: 1,
      docPath: '/demographics',
      sampleEndpoints: ['/demographics/population'],
    },
    {
      id: 'postal-codes',
      category: 'Postal',
      title: 'Cambodia Postal Codes',
      description: 'Official 5-digit postal code lookups mapped to provinces, districts, and communes.',
      status: 'Operational',
      endpointCount: 2,
      docPath: '/docs#postal-codes',
      sampleEndpoints: ['/postal-codes/12000'],
    },
    {
      id: 'locations',
      category: 'Tree',
      title: 'Complete Address Tree Lookup',
      description: 'Resolve any administrative code into its full 4-tier tree (Province, District, Commune, Village, Postal Codes).',
      status: 'Operational',
      endpointCount: 1,
      docPath: '/docs#locations',
      sampleEndpoints: ['/locations/12010101'],
    },
    {
      id: 'search',
      category: 'Search',
      title: 'Unified Multi-Language Search',
      description: 'Fast full-text search across Khmer, English, postal codes, and slugs with relevance ranking.',
      status: 'Operational',
      endpointCount: 1,
      docPath: '/docs#search',
      sampleEndpoints: ['/search?q=Phnom%20Penh'],
    },
    {
      id: 'geo',
      category: 'Spatial',
      title: 'GeoJSON Coordinates & Geometry',
      description: 'Export geographic coordinates and province boundary polygons as standard GeoJSON FeatureCollections.',
      status: 'Operational',
      endpointCount: 2,
      docPath: '/docs#geo',
      sampleEndpoints: ['/geo/provinces', '/geo/layers/provinces'],
    },
  ];
}
</script>
