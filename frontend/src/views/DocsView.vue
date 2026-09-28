<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex">
      <!-- Left Navigation Sidebar -->
      <DocsSidebar />

      <!-- Center Main Documentation Content -->
      <main class="min-w-0 flex-1 py-8 px-0 md:px-8 lg:px-12 space-y-16">
        <!-- 1. GETTING STARTED -->
        <section id="getting-started" class="space-y-6 scroll-mt-24">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
              <span>Overview</span>
              <span>/</span>
              <span class="text-zinc-900 font-medium">Getting Started</span>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight text-zinc-900">
              Getting Started with KhmerAPI
            </h1>
            <p class="text-sm text-zinc-600 leading-relaxed">
              KhmerAPI is a free, high-performance public REST API gateway providing normalized Cambodian administrative, postal, and geographic data for developers, businesses, and researchers.
            </p>
          </div>

          <!-- Base URL Card -->
          <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Base API URL</h3>
            <p class="text-xs text-zinc-600">All API requests must use the current stable version path prefix:</p>
            <div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 font-mono text-xs text-zinc-900">
              <span>https://api.khmerapi.dev/api/v1</span>
              <span class="rounded bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold px-2 py-0.5">HTTPS Required</span>
            </div>
          </div>

          <!-- Response Envelope -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-zinc-900">Standardized Response Format</h3>
            <p class="text-xs text-zinc-600 leading-relaxed">
              Every API response follows a consistent JSON format with <code class="font-mono text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">success</code>, <code class="font-mono text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">data</code>, and <code class="font-mono text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">meta</code> properties:
            </p>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <div class="text-[11px] font-semibold text-zinc-700 uppercase mb-1">Success Envelope</div>
                <JsonViewer :data="SAMPLE_SUCCESS_ENVELOPE" :showHeader="false" />
              </div>
              <div>
                <div class="text-[11px] font-semibold text-zinc-700 uppercase mb-1">Error Envelope</div>
                <JsonViewer :data="SAMPLE_ERROR_ENVELOPE" :showHeader="false" />
              </div>
            </div>
          </div>
        </section>

        <!-- 2. AUTHENTICATION -->
        <section id="authentication" class="space-y-6 scroll-mt-24 border-t border-zinc-200/80 pt-12">
          <div class="space-y-2">
            <h2 class="text-2xl font-bold tracking-tight text-zinc-900">Authentication & API Keys</h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              All public geographic data endpoints support <strong>anonymous access</strong> with a default rate limit of 60 requests/minute. For higher limits (300 req/min) or developer portals, pass your API key in the request header.
            </p>
          </div>

          <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-900">Using Your Developer Key</h3>
            <p class="text-xs text-zinc-600">Include the key in the <code class="font-mono bg-zinc-100 px-1 py-0.5 rounded">X-API-Key</code> header:</p>
            <CodeBlock
              endpoint="/provinces"
              method="GET"
              :customSnippets="AUTH_CODE_SNIPPETS"
            />
          </div>
        </section>

        <!-- 3. RATE LIMITS -->
        <section id="rate-limits" class="space-y-6 scroll-mt-24 border-t border-zinc-200/80 pt-12">
          <div class="space-y-2">
            <h2 class="text-2xl font-bold tracking-tight text-zinc-900">Rate Limits</h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Rate limits are enforced using Redis sliding-window counters per IP address or API Key.
            </p>
          </div>

          <div class="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-zinc-100 bg-zinc-50/75 text-zinc-600 font-medium">
                <tr>
                  <th class="px-4 py-2.5">Tier</th>
                  <th class="px-4 py-2.5">Limit</th>
                  <th class="px-4 py-2.5">Identifier</th>
                  <th class="px-4 py-2.5">Cost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 text-zinc-700">
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-zinc-900">Anonymous</td>
                  <td class="px-4 py-2.5 font-mono">60 req / min</td>
                  <td class="px-4 py-2.5 text-zinc-500">Client IP Address</td>
                  <td class="px-4 py-2.5 text-emerald-600 font-medium">Free</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-zinc-900">Developer Account</td>
                  <td class="px-4 py-2.5 font-mono">300 req / min</td>
                  <td class="px-4 py-2.5 text-zinc-500">API Key Hash</td>
                  <td class="px-4 py-2.5 text-emerald-600 font-medium">Free</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-semibold text-zinc-900">Admin</td>
                  <td class="px-4 py-2.5 font-mono">1,200 req / min</td>
                  <td class="px-4 py-2.5 text-zinc-500">JWT Token (RBAC)</td>
                  <td class="px-4 py-2.5 text-zinc-500">Internal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 4. PROVINCES ENDPOINT -->
        <section id="provinces" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-provinces"
            title="List All Provinces"
            endpoint="/api/v1/provinces"
            method="GET"
            description="Retrieve paginated list of all 25 official Cambodian provinces and the capital Phnom Penh."
            :parameters="[
              { name: 'page', type: 'integer', description: 'Page number for pagination', default: '1' },
              { name: 'limit', type: 'integer', description: 'Number of results per page (1-100)', default: '20' },
              { name: 'search', type: 'string', description: 'Search term in Khmer, English, or slug' },
              { name: 'sort', type: 'string', description: 'Field to sort by (code, name_en, name_km)', default: 'code' },
              { name: 'order', type: 'string', description: 'Sort direction (asc, desc)', default: 'asc' }
            ]"
            :exampleParams="{ limit: 2 }"
            :exampleResponse="SAMPLE_PROVINCES_RESPONSE"
          />

          <EndpointDoc
            id="get-province-by-code"
            title="Get Province by Code or Slug"
            endpoint="/api/v1/provinces/:code"
            method="GET"
            description="Retrieve a single province by its 2-digit official code (e.g. '12') or URL-safe slug (e.g. 'phnom-penh')."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2-digit province code or slug (e.g. 12 or siem-reap)' }
            ]"
            :exampleResponse="SAMPLE_SINGLE_PROVINCE"
          />

          <EndpointDoc
            id="get-province-districts"
            title="Get Districts of a Province"
            endpoint="/api/v1/provinces/:code/districts"
            method="GET"
            description="Retrieve all districts (Khan / Srok / Krong) belonging to a specific province."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2-digit province code (e.g. 12)' }
            ]"
            :exampleResponse="SAMPLE_PROVINCE_DISTRICTS"
          />
        </section>

        <!-- 5. DISTRICTS ENDPOINT -->
        <section id="districts" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-districts"
            title="List Districts"
            endpoint="/api/v1/districts"
            method="GET"
            description="Query second-tier administrative divisions (Khan / Srok / Krong) across Cambodia."
            :parameters="[
              { name: 'province_code', type: 'string', description: 'Filter by 2-digit parent province code (e.g. 12)' },
              { name: 'search', type: 'string', description: 'Filter by district name in Khmer or English' },
              { name: 'limit', type: 'integer', description: 'Page limit (1-100)', default: '20' }
            ]"
            :exampleParams="{ province_code: '12', limit: 2 }"
            :exampleResponse="SAMPLE_DISTRICTS_RESPONSE"
          />
        </section>

        <!-- 6. COMMUNES ENDPOINT -->
        <section id="communes" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-communes"
            title="List Communes (Sangkat / Khum)"
            endpoint="/api/v1/communes"
            method="GET"
            description="Query third-tier administrative subdivisions with native Khmer names and coordinates."
            :parameters="[
              { name: 'district_code', type: 'string', description: 'Filter by 4-digit parent district code (e.g. 1201)' },
              { name: 'search', type: 'string', description: 'Search commune name' }
            ]"
            :exampleParams="{ district_code: '1201', limit: 2 }"
            :exampleResponse="SAMPLE_COMMUNES_RESPONSE"
          />
        </section>

        <!-- 7. VILLAGES ENDPOINT -->
        <section id="villages" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-villages"
            title="List Villages (Phum)"
            endpoint="/api/v1/villages"
            method="GET"
            description="Query fourth-tier villages with 8-digit official codes and commune associations."
            :parameters="[
              { name: 'commune_code', type: 'string', description: 'Filter by 6-digit commune code (e.g. 120101)' },
              { name: 'search', type: 'string', description: 'Search village name in Khmer or English' }
            ]"
            :exampleParams="{ commune_code: '120101', limit: 2 }"
            :exampleResponse="SAMPLE_VILLAGES_RESPONSE"
          />
        </section>

        <!-- 8. POSTAL CODES ENDPOINT -->
        <section id="postal-codes" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-postal-codes"
            title="Lookup Postal Codes"
            endpoint="/api/v1/postal-codes/:postalCode"
            method="GET"
            description="Query official 5-digit Cambodian postal codes and resolve their associated administrative region."
            :parameters="[
              { name: 'postalCode', in: 'path', type: 'string', required: true, description: '5-digit postal code (e.g. 12000)' }
            ]"
            :exampleResponse="SAMPLE_POSTAL_RESPONSE"
          />
        </section>

        <!-- 9. COMPLETE ADDRESS TREE -->
        <section id="locations" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-location-tree"
            title="Complete Address Tree Lookup"
            endpoint="/api/v1/locations/:code"
            method="GET"
            description="Given any administrative code (province, district, commune, or village), returns the complete 4-tier tree and mapped postal codes in a single request."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2, 4, 6, or 8-digit code (e.g. 12010101)' }
            ]"
            :exampleResponse="SAMPLE_LOCATION_TREE_RESPONSE"
          />
        </section>

        <!-- 10. MULTI-LANGUAGE SEARCH -->
        <section id="search" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-search"
            title="Universal Multi-Language Search"
            endpoint="/api/v1/search"
            method="GET"
            description="Search across provinces, districts, communes, villages, and postal codes simultaneously in both Khmer and English."
            :parameters="[
              { name: 'q', type: 'string', required: true, description: 'Search term (e.g. Phnom Penh, សៀមរាប, 12000)' },
              { name: 'limit', type: 'integer', description: 'Max items to return (1-50)', default: '20' }
            ]"
            :exampleParams="{ q: 'Phnom Penh' }"
            :exampleResponse="SAMPLE_SEARCH_RESPONSE"
          />
        </section>

        <!-- 11. GEOJSON API -->
        <section id="geo" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-geo-provinces"
            title="GeoJSON FeatureCollection"
            endpoint="/api/v1/geo/provinces"
            method="GET"
            description="Returns standard RFC 7946 GeoJSON Point FeatureCollection with latitude, longitude, and properties."
            :exampleResponse="SAMPLE_GEO_RESPONSE"
          />
        </section>

        <!-- 12. STATISTICS API -->
        <section id="statistics" class="border-t border-zinc-200/80 pt-12 space-y-12">
          <EndpointDoc
            id="get-statistics"
            title="Public Statistics"
            endpoint="/api/v1/statistics"
            method="GET"
            description="Live counts of all entities across Cambodia directly computed from the PostgreSQL database."
            :exampleResponse="SAMPLE_STATS_RESPONSE"
          />
        </section>
      </main>

      <!-- Right Table of Contents -->
      <DocsToc :items="TOC_ITEMS" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsSidebar from '../components/docs/DocsSidebar.vue';
import DocsToc from '../components/docs/DocsToc.vue';
import EndpointDoc from '../components/docs/EndpointDoc.vue';
import JsonViewer from '../components/common/JsonViewer.vue';
import CodeBlock from '../components/common/CodeBlock.vue';

const TOC_ITEMS = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'authentication', label: 'Authentication & Keys' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'provinces', label: 'Provinces API' },
  { id: 'districts', label: 'Districts API' },
  { id: 'communes', label: 'Communes API' },
  { id: 'villages', label: 'Villages API' },
  { id: 'postal-codes', label: 'Postal Codes' },
  { id: 'locations', label: 'Address Tree' },
  { id: 'search', label: 'Search API' },
  { id: 'geo', label: 'GeoJSON Spatial' },
  { id: 'statistics', label: 'Statistics' },
];

const SAMPLE_SUCCESS_ENVELOPE = {
  success: true,
  data: {
    code: "12",
    name_km: "រាជធានីភ្នំពេញ",
    name_en: "Phnom Penh"
  },
  meta: {
    request_id: "8c98ad21-12c8-47bc-ba91-03098df49012",
    timestamp: "2026-09-28T12:00:00.000Z"
  }
};

const SAMPLE_ERROR_ENVELOPE = {
  success: false,
  error: {
    code: "RESOURCE_NOT_FOUND",
    message: "Province not found with code '99'",
    details: null
  },
  meta: {
    request_id: "8c98ad21-12c8-47bc-ba91-03098df49012",
    timestamp: "2026-09-28T12:00:00.000Z"
  }
};

const SAMPLE_PROVINCES_RESPONSE = {
  success: true,
  data: [
    {
      code: "12",
      name_km: "រាជធានីភ្នំពេញ",
      name_en: "Phnom Penh",
      slug: "phnom-penh",
      type: "Capital",
      latitude: 11.5564,
      longitude: 104.9282,
      is_active: true
    },
    {
      code: "17",
      name_km: "ខេត្តសៀមរាប",
      name_en: "Siem Reap",
      slug: "siem-reap",
      type: "Province",
      latitude: 13.3671,
      longitude: 103.8448,
      is_active: true
    }
  ],
  meta: {
    page: 1,
    limit: 2,
    total: 25,
    total_pages: 13,
    request_id: "a12-b34-c56"
  }
};

const SAMPLE_SINGLE_PROVINCE = {
  success: true,
  data: {
    code: "12",
    name_km: "រាជធានីភ្នំពេញ",
    name_en: "Phnom Penh",
    slug: "phnom-penh",
    type: "Capital",
    latitude: 11.5564,
    longitude: 104.9282,
    is_active: true
  },
  meta: { request_id: "req-single-prov" }
};

const SAMPLE_PROVINCE_DISTRICTS = {
  success: true,
  data: [
    {
      code: "1201",
      province_code: "12",
      name_km: "ខណ្ឌចំការមន",
      name_en: "Chamkar Mon",
      slug: "chamkar-mon",
      type: "Khan",
      latitude: 11.5434,
      longitude: 104.9281
    },
    {
      code: "1202",
      province_code: "12",
      name_km: "ខណ្ឌដូនពេញ",
      name_en: "Doun Penh",
      slug: "doun-penh",
      type: "Khan",
      latitude: 11.5723,
      longitude: 104.9238
    }
  ],
  meta: { total: 14, request_id: "req-prov-dist" }
};

const SAMPLE_DISTRICTS_RESPONSE = {
  success: true,
  data: [
    {
      code: "1201",
      province_code: "12",
      province_name_en: "Phnom Penh",
      name_km: "ខណ្ឌចំការមន",
      name_en: "Chamkar Mon",
      slug: "chamkar-mon",
      type: "Khan"
    }
  ],
  meta: { page: 1, limit: 2, total: 204, request_id: "req-dist" }
};

const SAMPLE_COMMUNES_RESPONSE = {
  success: true,
  data: [
    {
      code: "120101",
      district_code: "1201",
      district_name_en: "Chamkar Mon",
      name_km: "សង្កាត់ទន្លេបាសាក់",
      name_en: "Tonle Bassac",
      slug: "tonle-bassac",
      type: "Sangkat"
    }
  ],
  meta: { page: 1, limit: 2, total: 1652, request_id: "req-comm" }
};

const SAMPLE_VILLAGES_RESPONSE = {
  success: true,
  data: [
    {
      code: "12010101",
      commune_code: "120101",
      name_km: "ភូមិ១",
      name_en: "Phum 1",
      slug: "phum-1"
    }
  ],
  meta: { page: 1, limit: 2, total: 14500, request_id: "req-vill" }
};

const SAMPLE_POSTAL_RESPONSE = {
  success: true,
  data: {
    postal_code: "12000",
    province: { code: "12", name_en: "Phnom Penh", name_km: "រាជធានីភ្នំពេញ" },
    district: { code: "1201", name_en: "Chamkar Mon", name_km: "ខណ្ឌចំការមន" },
    is_active: true
  },
  meta: { request_id: "req-postal" }
};

const SAMPLE_LOCATION_TREE_RESPONSE = {
  success: true,
  data: {
    province: { code: "12", name_km: "រាជធានីភ្នំពេញ", name_en: "Phnom Penh" },
    district: { code: "1201", name_km: "ខណ្ឌចំការមន", name_en: "Chamkar Mon" },
    commune: { code: "120101", name_km: "សង្កាត់ទន្លេបាសាក់", name_en: "Tonle Bassac" },
    village: { code: "12010101", name_km: "ភូមិ១", name_en: "Phum 1" },
    postal_codes: [{ postal_code: "120101" }]
  },
  meta: { request_id: "req-tree" }
};

const SAMPLE_SEARCH_RESPONSE = {
  success: true,
  data: [
    {
      type: "province",
      code: "12",
      name_km: "រាជធានីភ្នំពេញ",
      name_en: "Phnom Penh",
      slug: "phnom-penh",
      score: 100
    },
    {
      type: "district",
      code: "1202",
      name_km: "ខណ្ឌដូនពេញ",
      name_en: "Doun Penh",
      slug: "doun-penh",
      parent: "Phnom Penh",
      score: 75
    }
  ],
  meta: { total: 2, request_id: "req-search" }
};

const SAMPLE_GEO_RESPONSE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [104.9282, 11.5564]
      },
      properties: {
        code: "12",
        name_en: "Phnom Penh",
        name_km: "រាជធានីភ្នំពេញ",
        type: "Capital"
      }
    }
  ]
};

const SAMPLE_STATS_RESPONSE = {
  success: true,
  data: {
    province_count: 25,
    district_count: 204,
    commune_count: 1652,
    village_count: 14570,
    postal_code_count: 1850,
    last_data_update: "2026-09-28T12:00:00.000Z"
  },
  meta: { request_id: "req-stats" }
};

const AUTH_CODE_SNIPPETS = {
  curl: 'curl -X GET "https://api.khmerapi.dev/api/v1/provinces" \\\n  -H "X-API-Key: kh_live_a1b2c3d4e5f6..."',
  js: 'const res = await fetch("https://api.khmerapi.dev/api/v1/provinces", {\n  headers: { "X-API-Key": "kh_live_a1b2c3d4e5f6..." }\n});',
  python: 'import requests\n\nheaders = {"X-API-Key": "kh_live_a1b2c3d4e5f6..."}\nres = requests.get("https://api.khmerapi.dev/api/v1/provinces", headers=headers)',
  php: '<?php\n$headers = ["X-API-Key: kh_live_a1b2c3d4e5f6..."];\n// cURL request...'
};
</script>
