<template>
  <div class="mx-auto w-[90%] lg:w-[70%] max-w-[1440px] px-2 sm:px-4">
    <div class="flex">
      <!-- Left Navigation Sidebar -->
      <DocsSidebar :activeId="activeSectionId" />

      <!-- Center Main Documentation Content -->
      <main class="min-w-0 flex-1 py-8 px-0 md:px-8 lg:px-12 space-y-16">
        <!-- 1. GETTING STARTED -->
        <section id="getting-started" class="doc-section space-y-6 scroll-mt-24">
          <div class="space-y-2 font-battambang">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>{{ langStore.currentLang === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview' }}</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">{{ langStore.currentLang === 'km' ? 'ការណែនាំដំបូង' : 'Getting Started' }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
              {{ langStore.t.docs.title }}
            </h1>
            <p class="text-sm text-zinc-600 leading-relaxed max-w-3xl">
              {{ langStore.t.docs.subtitle }}
            </p>
          </div>

          <!-- Base URL Card -->
          <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-3 font-battambang">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-900">{{ langStore.t.docs.baseUrlTitle }}</h3>
              <span class="rounded bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold px-2 py-0.5">{{ langStore.t.docs.httpsRequired }}</span>
            </div>
            <p class="text-xs text-zinc-600">{{ langStore.t.docs.baseUrlDesc }} <code class="font-mono text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded">/v1</code> :</p>
            <div class="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 font-mono text-xs text-zinc-900">
              <span class="font-bold select-all">https://khmerapi.lorndavid.online/v1</span>
              <button
                @click="copyBaseUrl"
                class="inline-flex items-center gap-1 rounded bg-white border border-zinc-200 px-2 py-1 text-[11px] font-sans font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer"
              >
                <CheckIcon v-if="copiedBaseUrl" class="w-3 h-3 text-emerald-600" />
                <CopyIcon v-else class="w-3 h-3 text-zinc-500" />
                <span>{{ copiedBaseUrl ? (langStore.currentLang === 'km' ? 'បានចម្លង' : 'Copied') : (langStore.currentLang === 'km' ? 'ចម្លង' : 'Copy') }}</span>
              </button>
            </div>
          </div>

          <!-- Zero Authentication Banner -->
          <div class="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4.5 text-xs text-emerald-900 space-y-1.5 font-battambang">
            <div class="flex items-center gap-2 font-bold text-sm text-emerald-950">
              <SparklesIcon class="w-4 h-4 text-emerald-600" />
              <span>{{ langStore.t.docs.zeroAuthTitle }}</span>
            </div>
            <p class="text-emerald-800 leading-relaxed">
              {{ langStore.t.docs.zeroAuthDesc }}
            </p>
          </div>
        </section>

        <!-- 2. RESPONSE FORMAT & ERRORS -->
        <section id="response-format" class="doc-section space-y-6 scroll-mt-24 border-t border-zinc-200/80 pt-12">
          <div class="space-y-2 font-battambang">
            <div class="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
              <span>{{ langStore.currentLang === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview' }}</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">{{ langStore.currentLang === 'km' ? 'ទម្រង់ឆ្លើយតប' : 'Response Format' }}</span>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-zinc-900">{{ langStore.t.docs.responseFormatTitle }}</h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              {{ langStore.t.docs.responseFormatDesc }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div class="space-y-2">
              <div class="text-xs font-bold text-zinc-700 uppercase tracking-wider font-battambang">{{ langStore.currentLang === 'km' ? 'ទម្រង់ជោគជ័យ Success (200 OK)' : 'Success Envelope (200 OK)' }}</div>
              <JsonViewer :data="SAMPLE_SUCCESS_ENVELOPE" :showHeader="false" />
            </div>
            <div class="space-y-2">
              <div class="text-xs font-bold text-zinc-700 uppercase tracking-wider font-battambang">{{ langStore.currentLang === 'km' ? 'ទម្រង់កំហុស Error (4xx / 5xx)' : 'Error Envelope (4xx / 5xx)' }}</div>
              <JsonViewer :data="SAMPLE_ERROR_ENVELOPE" :showHeader="false" />
            </div>
          </div>
        </section>

        <!-- 3. RATE LIMITS -->
        <section id="rate-limits" class="doc-section space-y-6 scroll-mt-24 border-t border-zinc-200/80 pt-12">
          <div class="space-y-2 font-battambang">
            <div class="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
              <span>{{ langStore.currentLang === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview' }}</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">{{ langStore.currentLang === 'km' ? 'កម្រិតសំណើ' : 'Rate Limits' }}</span>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-zinc-900">{{ langStore.t.docs.rateLimitsTitle }}</h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              {{ langStore.t.docs.rateLimitsDesc }}
            </p>
          </div>

          <div class="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs font-battambang">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-zinc-100 bg-zinc-50/75 text-zinc-600 font-semibold">
                <tr>
                  <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'Header ឆ្លើយតប' : 'Response Header' }}</th>
                  <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ការពន្យល់' : 'Description' }}</th>
                  <th class="px-4 py-2.5">{{ langStore.currentLang === 'km' ? 'ឧទាហរណ៍' : 'Example' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 text-zinc-700 font-mono text-[11px]">
                <tr>
                  <td class="px-4 py-2.5 font-bold text-zinc-900">X-RateLimit-Limit</td>
                  <td class="px-4 py-2.5 font-sans text-xs text-zinc-600">{{ langStore.currentLang === 'km' ? 'ចំនួនសំណើអតិបរមាអនុញ្ញាតក្នុង ១ នាទី (៦០ សំណើ/នាទី)' : 'The maximum number of requests allowed in the 1-minute window' }}</td>
                  <td class="px-4 py-2.5 text-zinc-500">60</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-bold text-zinc-900">X-RateLimit-Remaining</td>
                  <td class="px-4 py-2.5 font-sans text-xs text-zinc-600">{{ langStore.currentLang === 'km' ? 'ចំនួនសំណើដែលនៅសល់ក្នុងនាទីបច្ចុប្បន្ន' : 'The number of requests remaining in the current window' }}</td>
                  <td class="px-4 py-2.5 text-zinc-500">58</td>
                </tr>
                <tr>
                  <td class="px-4 py-2.5 font-bold text-zinc-900">X-RateLimit-Reset</td>
                  <td class="px-4 py-2.5 font-sans text-xs text-zinc-600">{{ langStore.currentLang === 'km' ? 'ពេលវេលា Unix timestamp ដែលនឹងកំណត់កម្រិតឡើងវិញ' : 'Unix timestamp in seconds when the current window resets' }}</td>
                  <td class="px-4 py-2.5 text-zinc-500">1759060860</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 4. PROVINCES ENDPOINTS -->
        <section id="provinces" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Administrative Hierarchy</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Provinces (ខេត្ត / រាជធានី)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Provinces API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Provides all 25 first-tier administrative divisions of Cambodia, including the capital Phnom Penh and 24 provinces.
            </p>
          </div>

          <EndpointDoc
            id="get-provinces"
            title="1. List All Provinces"
            endpoint="/api/v1/provinces"
            method="GET"
            description="Retrieve paginated list of all 25 Cambodian provinces with bilingual Khmer/English names, ISO codes, and coordinates."
            :parameters="[
              { name: 'page', type: 'integer', description: 'Page number for pagination', default: '1' },
              { name: 'limit', type: 'integer', description: 'Number of results per page (1-100)', default: '20' },
              { name: 'search', type: 'string', description: 'Search term in Khmer (ភ្នំពេញ) or English (Phnom Penh)' },
              { name: 'sort', type: 'string', description: 'Field to sort by: code, name_en, name_km', default: 'code' },
              { name: 'order', type: 'string', description: 'Sort direction: asc or desc', default: 'asc' }
            ]"
            :exampleParams="{ limit: 2 }"
            :exampleResponse="SAMPLE_PROVINCES_RESPONSE"
          />

          <EndpointDoc
            id="get-province-by-code"
            title="2. Get Province by Code or Slug"
            endpoint="/api/v1/provinces/:code"
            method="GET"
            description="Retrieve details of a single province using its 2-digit official code (e.g. '12') or URL slug (e.g. 'phnom-penh')."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2-digit province code (e.g. 12) or slug (e.g. phnom-penh)' }
            ]"
            :exampleResponse="SAMPLE_SINGLE_PROVINCE"
          />

          <EndpointDoc
            id="get-province-districts"
            title="3. Get Districts Belonging to a Province"
            endpoint="/api/v1/provinces/:code/districts"
            method="GET"
            description="Retrieve all districts (Khan / Srok / Krong) within a specific province."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2-digit province code (e.g. 12)' }
            ]"
            :exampleResponse="SAMPLE_PROVINCE_DISTRICTS"
          />
        </section>

        <!-- 5. DISTRICTS ENDPOINTS -->
        <section id="districts" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Administrative Hierarchy</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Districts (ស្រុក / ខណ្ឌ / ក្រុង)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Districts API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Provides second-tier administrative divisions (Khan in Phnom Penh, Srok in provinces, and Krong for municipalities).
            </p>
          </div>

          <EndpointDoc
            id="get-districts"
            title="1. List Districts"
            endpoint="/api/v1/districts"
            method="GET"
            description="Query districts across Cambodia with optional province filtering, search, and pagination."
            :parameters="[
              { name: 'province_code', type: 'string', description: 'Filter by 2-digit parent province code (e.g. 12)' },
              { name: 'search', type: 'string', description: 'Search term in Khmer or English' },
              { name: 'page', type: 'integer', description: 'Page number', default: '1' },
              { name: 'limit', type: 'integer', description: 'Items per page (1-100)', default: '20' }
            ]"
            :exampleParams="{ province_code: '12', limit: 2 }"
            :exampleResponse="SAMPLE_DISTRICTS_RESPONSE"
          />

          <EndpointDoc
            id="get-district-by-code"
            title="2. Get District by Code"
            endpoint="/api/v1/districts/:code"
            method="GET"
            description="Retrieve single district by 4-digit code (e.g. '1201') or slug (e.g. 'chamkar-mon')."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '4-digit district code or slug' }
            ]"
            :exampleResponse="SAMPLE_SINGLE_DISTRICT"
          />

          <EndpointDoc
            id="get-district-communes"
            title="3. Get Communes in District"
            endpoint="/api/v1/districts/:code/communes"
            method="GET"
            description="Retrieve all communes (Sangkat / Khum) belonging to a specific district."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '4-digit district code (e.g. 1201)' }
            ]"
            :exampleResponse="SAMPLE_DISTRICT_COMMUNES"
          />
        </section>

        <!-- 6. COMMUNES ENDPOINTS -->
        <section id="communes" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Administrative Hierarchy</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Communes (ឃុំ / សង្កាត់)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Communes API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Provides third-tier administrative subdivisions (Sangkat in urban areas, Khum in rural districts).
            </p>
          </div>

          <EndpointDoc
            id="get-communes"
            title="1. List Communes"
            endpoint="/api/v1/communes"
            method="GET"
            description="Query communes across Cambodia with district filter, search query, and pagination."
            :parameters="[
              { name: 'district_code', type: 'string', description: 'Filter by 4-digit district code (e.g. 1201)' },
              { name: 'search', type: 'string', description: 'Search commune name' },
              { name: 'limit', type: 'integer', description: 'Items per page (1-100)', default: '20' }
            ]"
            :exampleParams="{ district_code: '1201', limit: 2 }"
            :exampleResponse="SAMPLE_COMMUNES_RESPONSE"
          />

          <EndpointDoc
            id="get-commune-by-code"
            title="2. Get Commune by Code"
            endpoint="/api/v1/communes/:code"
            method="GET"
            description="Retrieve single commune by 6-digit code (e.g. '120101') with parent district and province info."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '6-digit commune code' }
            ]"
            :exampleResponse="SAMPLE_SINGLE_COMMUNE"
          />

          <EndpointDoc
            id="get-commune-villages"
            title="3. Get Villages in Commune"
            endpoint="/api/v1/communes/:code/villages"
            method="GET"
            description="Retrieve all villages (Phum) situated within a commune."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '6-digit commune code (e.g. 120101)' }
            ]"
            :exampleResponse="SAMPLE_COMMUNE_VILLAGES"
          />
        </section>

        <!-- 7. VILLAGES ENDPOINTS -->
        <section id="villages" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Administrative Hierarchy</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Villages (ភូមិ)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Villages API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Provides the complete fourth-tier village database comprising 14,528 official Cambodian villages.
            </p>
          </div>

          <EndpointDoc
            id="get-villages"
            title="1. List Villages"
            endpoint="/api/v1/villages"
            method="GET"
            description="Query villages with commune filter, search, and pagination."
            :parameters="[
              { name: 'commune_code', type: 'string', description: 'Filter by 6-digit commune code (e.g. 120101)' },
              { name: 'search', type: 'string', description: 'Search village name' },
              { name: 'limit', type: 'integer', description: 'Items per page', default: '20' }
            ]"
            :exampleParams="{ commune_code: '120101', limit: 2 }"
            :exampleResponse="SAMPLE_VILLAGES_RESPONSE"
          />

          <EndpointDoc
            id="get-village-by-code"
            title="2. Get Village by Code"
            endpoint="/api/v1/villages/:code"
            method="GET"
            description="Retrieve village details by 8-digit code (e.g. '12010101')."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '8-digit village code' }
            ]"
            :exampleResponse="SAMPLE_SINGLE_VILLAGE"
          />
        </section>

        <!-- 8. POSTAL CODES ENDPOINTS -->
        <section id="postal-codes" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Postal & Delivery</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Postal Codes (លេខកូដប្រៃសណីយ៍)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Postal Codes API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Query official 5-digit Cambodian postal codes used by Cambodia Post for shipping, e-commerce, and courier delivery.
            </p>
          </div>

          <EndpointDoc
            id="get-postal-codes-list"
            title="1. List Postal Codes"
            endpoint="/api/v1/postal-codes"
            method="GET"
            description="Retrieve paginated list of postal codes with province and district mapping."
            :parameters="[
              { name: 'province_code', type: 'string', description: 'Filter by 2-digit province code (e.g. 12)' },
              { name: 'limit', type: 'integer', description: 'Items per page', default: '20' }
            ]"
            :exampleParams="{ province_code: '12', limit: 2 }"
            :exampleResponse="SAMPLE_POSTAL_LIST_RESPONSE"
          />

          <EndpointDoc
            id="get-postal-code-lookup"
            title="2. Lookup Postal Code by Number"
            endpoint="/api/v1/postal-codes/:postalCode"
            method="GET"
            description="Resolve a 5-digit postal code (e.g. '12000') into its province, district, and commune."
            :parameters="[
              { name: 'postalCode', in: 'path', type: 'string', required: true, description: '5-digit postal code (e.g. 12000)' }
            ]"
            :exampleResponse="SAMPLE_POSTAL_RESPONSE"
          />
        </section>

        <!-- 9. COMPLETE ADDRESS TREE -->
        <section id="locations" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Hierarchical Data</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Address Tree (ឋានានុក្រម)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Complete Location Tree API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Provides all administrative ancestors and children for any given code (2, 4, 6, or 8-digit) in a single unified API call.
            </p>
          </div>

          <EndpointDoc
            id="get-location-tree"
            title="Unified Address Tree Lookup"
            endpoint="/api/v1/locations/:code"
            method="GET"
            description="Given any administrative code, returns the resolved Province, District, Commune, Village, and associated Postal Codes."
            :parameters="[
              { name: 'code', in: 'path', type: 'string', required: true, description: '2, 4, 6, or 8-digit code (e.g. 12010101)' }
            ]"
            :exampleResponse="SAMPLE_LOCATION_TREE_RESPONSE"
          />
        </section>

        <!-- 10. UNIVERSAL SEARCH -->
        <section id="search" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Search Engine</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Universal Search (ស្វែងរក)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Multi-Language Search API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Fast trigram search across all levels simultaneously supporting Khmer script, English transliterations, postal codes, and partial words.
            </p>
          </div>

          <EndpointDoc
            id="get-search"
            title="Search Across All Levels"
            endpoint="/api/v1/search"
            method="GET"
            description="Execute high-speed search across provinces, districts, communes, villages, and postal codes with relevance ranking."
            :parameters="[
              { name: 'q', type: 'string', required: true, description: 'Search term (e.g. Phnom Penh, សៀមរាប, 12000)' },
              { name: 'limit', type: 'integer', description: 'Max items to return (1-50)', default: '20' }
            ]"
            :exampleParams="{ q: 'Phnom Penh' }"
            :exampleResponse="SAMPLE_SEARCH_RESPONSE"
          />
        </section>

        <!-- 11. GEOJSON API -->
        <section id="geo" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>GIS & Mapping</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">GeoJSON Spatial (ផែនទី)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              GeoJSON Spatial Layers API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Standard RFC 7946 FeatureCollections ready to render directly into Leaflet, Mapbox, MapLibre, Google Maps, or OpenLayers.
            </p>
          </div>

          <EndpointDoc
            id="get-geo-provinces"
            title="1. Provinces Point FeatureCollection"
            endpoint="/api/v1/geo/provinces"
            method="GET"
            description="Returns GeoJSON Point FeatureCollection with latitude, longitude, Khmer names, and administrative properties."
            :exampleResponse="SAMPLE_GEO_RESPONSE"
          />

          <EndpointDoc
            id="get-geo-layer"
            title="2. Download Boundary Layer"
            endpoint="/api/v1/geo/layers/:layer"
            method="GET"
            description="Download vector boundary polygon layers. Available layers: provinces, districts, communes, villages, lakes, national-parks."
            :parameters="[
              { name: 'layer', in: 'path', type: 'string', required: true, description: 'Layer key: provinces, districts, communes, villages, lakes, national-parks' }
            ]"
            :exampleResponse="SAMPLE_GEO_LAYER_RESPONSE"
          />
        </section>

        <!-- 12. DEMOGRAPHICS & POPULATION API -->
        <section id="demographics" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Demographics</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold font-battambang">ស្ថិតិប្រជាសាស្ត្រ និងប្រជាជន</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 font-battambang">
              Cambodia Population & Demographics API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed font-battambang">
              Official historical census and projection statistics for Cambodia from 1962 to 2024, including province-level distribution estimates from the National Institute of Statistics (NIS).
            </p>
          </div>

          <EndpointDoc
            id="get-demographics-population"
            title="1. Historical Population & Demographics"
            endpoint="/api/v1/demographics/population"
            method="GET"
            description="Retrieve historical census milestones (1962-2024), current growth rate, national totals, and 25-province population estimates with bilingual Khmer & English labels."
            :parameters="[
              { name: 'from', type: 'integer', description: 'Filter records starting from year (e.g. 1980)' },
              { name: 'to', type: 'integer', description: 'Filter records up to year (e.g. 2024)' }
            ]"
            :exampleResponse="SAMPLE_DEMOGRAPHICS_RESPONSE"
          />
        </section>

        <!-- 13. STATISTICS API -->
        <section id="statistics" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Platform Insights</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Live Statistics (ស្ថិតិ)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              System Statistics API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Real-time entity counts computed directly from the PostgreSQL relational database.
            </p>
          </div>

          <EndpointDoc
            id="get-statistics"
            title="Public Statistics Summary"
            endpoint="/api/v1/statistics"
            method="GET"
            description="Returns current entity tallies across Cambodia for provinces, districts, communes, villages, and postal codes."
            :exampleResponse="SAMPLE_STATS_RESPONSE"
          />
        </section>

        <!-- 13. HEALTH & STATUS API -->
        <section id="health" class="doc-section border-t border-zinc-200/80 pt-12 space-y-12">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span>Infrastructure</span>
              <span>/</span>
              <span class="text-zinc-900 font-semibold">Health & Status (ស្ថានភាព)</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Health Check API
            </h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              Liveness probe endpoint reporting database connectivity, memory allocation, and gateway uptime.
            </p>
          </div>

          <EndpointDoc
            id="get-health"
            title="Gateway Health Check"
            endpoint="/health"
            method="GET"
            description="Returns status of PostgreSQL database, system uptime, and memory consumption."
            :exampleResponse="SAMPLE_HEALTH_RESPONSE"
          />
        </section>
      </main>

      <!-- Right Table of Contents -->
      <DocsToc :items="TOC_ITEMS" :activeId="activeSectionId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import gsap from 'gsap';
import {
  Sparkles as SparklesIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
} from 'lucide-vue-next';
import DocsSidebar from '../components/docs/DocsSidebar.vue';
import DocsToc from '../components/docs/DocsToc.vue';
import EndpointDoc from '../components/docs/EndpointDoc.vue';
import JsonViewer from '../components/common/JsonViewer.vue';
import { smoothScrollTo } from '../utils/smoothScroll';
import { useLangStore } from '../stores/lang.store';

const route = useRoute();
const langStore = useLangStore();
const activeSectionId = ref('getting-started');
const copiedBaseUrl = ref(false);

function copyBaseUrl() {
  navigator.clipboard.writeText('https://khmerapi.lorndavid.online/v1');
  copiedBaseUrl.value = true;
  setTimeout(() => {
    copiedBaseUrl.value = false;
  }, 2000);
}

const TOC_ITEMS = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'response-format', label: 'Response Format' },
  { id: 'rate-limits', label: 'Rate Limits' },
  { id: 'provinces', label: 'Provinces API' },
  { id: 'districts', label: 'Districts API' },
  { id: 'communes', label: 'Communes API' },
  { id: 'villages', label: 'Villages API' },
  { id: 'postal-codes', label: 'Postal Codes' },
  { id: 'locations', label: 'Address Tree' },
  { id: 'search', label: 'Universal Search' },
  { id: 'geo', label: 'GeoJSON Spatial' },
  { id: 'demographics', label: 'Population & Demographics' },
  { id: 'statistics', label: 'Live Statistics' },
  { id: 'health', label: 'Health & Status' },
];

let observer: IntersectionObserver | null = null;

onMounted(() => {
  // GSAP Entrance Animation
  gsap.from('.doc-section', {
    opacity: 0,
    y: 18,
    duration: 0.5,
    stagger: 0.05,
    ease: 'power2.out',
    clearProps: 'all',
  });

  // Handle hash navigation with GSAP smooth scroll
  if (window.location.hash) {
    const target = window.location.hash.slice(1);
    setTimeout(() => {
      smoothScrollTo(target, 84, 0.6);
    }, 150);
  }

  // Setup ScrollSpy with IntersectionObserver
  const sections = document.querySelectorAll('.doc-section');
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionId.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => {
    observer?.observe(section);
  });
});

onUnmounted(() => {
  observer?.disconnect();
});

// Sample Data Payloads
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
  meta: { page: 1, limit: 2, total: 210, request_id: "req-dist" }
};

const SAMPLE_SINGLE_DISTRICT = {
  success: true,
  data: {
    code: "1201",
    province_code: "12",
    name_km: "ខណ្ឌចំការមន",
    name_en: "Chamkar Mon",
    slug: "chamkar-mon",
    type: "Khan",
    latitude: 11.5434,
    longitude: 104.9281
  },
  meta: { request_id: "req-dist-single" }
};

const SAMPLE_DISTRICT_COMMUNES = {
  success: true,
  data: [
    {
      code: "120101",
      district_code: "1201",
      name_km: "សង្កាត់ទន្លេបាសាក់",
      name_en: "Tonle Bassac",
      slug: "tonle-bassac",
      type: "Sangkat"
    }
  ],
  meta: { total: 5, request_id: "req-dist-comm" }
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
  meta: { page: 1, limit: 2, total: 1661, request_id: "req-comm" }
};

const SAMPLE_SINGLE_COMMUNE = {
  success: true,
  data: {
    code: "120101",
    district_code: "1201",
    name_km: "សង្កាត់ទន្លេបាសាក់",
    name_en: "Tonle Bassac",
    slug: "tonle-bassac",
    type: "Sangkat"
  },
  meta: { request_id: "req-comm-single" }
};

const SAMPLE_COMMUNE_VILLAGES = {
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
  meta: { total: 16, request_id: "req-comm-vill" }
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
  meta: { page: 1, limit: 2, total: 14528, request_id: "req-vill" }
};

const SAMPLE_SINGLE_VILLAGE = {
  success: true,
  data: {
    code: "12010101",
    commune_code: "120101",
    name_km: "ភូមិ១",
    name_en: "Phum 1",
    slug: "phum-1"
  },
  meta: { request_id: "req-single-vill" }
};

const SAMPLE_POSTAL_LIST_RESPONSE = {
  success: true,
  data: [
    {
      postal_code: "12000",
      province_code: "12",
      district_code: "1201",
      is_active: true
    }
  ],
  meta: { total: 1850, request_id: "req-postal-list" }
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

const SAMPLE_GEO_LAYER_RESPONSE = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[104.85, 11.50], [104.98, 11.50], [104.98, 11.60], [104.85, 11.60], [104.85, 11.50]]]
      },
      properties: {
        PROV_CODE: "12",
        HRName: "Phnom Penh",
        HRName_KH: "ភ្នំពេញ"
      }
    }
  ]
};

const SAMPLE_DEMOGRAPHICS_RESPONSE = {
  success: true,
  data: {
    country: "Kingdom of Cambodia",
    country_km: "ព្រះរាជាណាចក្រកម្ពុជា",
    latest: {
      year: 2024,
      year_km: "២០២៤",
      population_millions: 17.3,
      population_total: 17300000,
      population_km: "១៧.៣ លាននាក់",
      annual_growth_rate_pct: 2.09
    },
    summary: {
      baseline_year: 1962,
      baseline_population_millions: 5.7,
      total_growth_percentage: 203.51,
      total_milestones: 10
    },
    historical: [
      { year: 1962, year_km: "១៩៦២", population_millions: 5.7, population_km: "៥.៧ លាននាក់" },
      { year: 1980, year_km: "១៩៨០", population_millions: 6.6, population_km: "៦.៦ លាននាក់" },
      { year: 1994, year_km: "១៩៩៤", population_millions: 9.9, population_km: "៩.៩ លាននាក់" },
      { year: 1996, year_km: "១៩៩៦", population_millions: 10.7, population_km: "១០.៧ លាននាក់" },
      { year: 1998, year_km: "១៩៩៨", population_millions: 11.4, population_km: "១១.៤ លាននាក់" },
      { year: 2004, year_km: "២០០៤", population_millions: 12.8, population_km: "១២.៨ លាននាក់" },
      { year: 2008, year_km: "២០០៨", population_millions: 13.4, population_km: "១៣.៤ លាននាក់" },
      { year: 2013, year_km: "២០១៣", population_millions: 14.7, population_km: "១៤.៧ លាននាក់" },
      { year: 2019, year_km: "២០១៩", population_millions: 15.6, population_km: "១៥.៦ លាននាក់" },
      { year: 2024, year_km: "២០២៤", population_millions: 17.3, population_km: "១៧.៣ លាននាក់" }
    ]
  },
  meta: { request_id: "req-demo-sample" }
};

const SAMPLE_STATS_RESPONSE = {
  success: true,
  data: {
    province_count: 25,
    district_count: 210,
    commune_count: 1661,
    village_count: 14528,
    postal_code_count: 1850,
    last_data_update: "2026-09-28T12:00:00.000Z"
  },
  meta: { request_id: "req-stats" }
};

const SAMPLE_HEALTH_RESPONSE = {
  status: "ok",
  database: "connected",
  uptime_seconds: 4820,
  memory_mb: {
    rss: 48.2,
    heapTotal: 32.1,
    heapUsed: 22.4
  }
};
</script>
