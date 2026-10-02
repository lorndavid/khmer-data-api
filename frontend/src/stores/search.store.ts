import { defineStore } from 'pinia';
import { ref } from 'vue';
import { searchApi } from '../api/search.api';
import type { SearchResultItem } from '../types/location.types';

export interface DocSearchItem {
  id: string;
  title: string;
  category: 'Documentation' | 'API Endpoint' | 'Location' | 'Developer';
  path: string;
  description: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}

const STATIC_DOC_ITEMS: DocSearchItem[] = [
  { id: 'doc-intro', title: 'Introduction & Overview', category: 'Documentation', path: '/docs/getting-started', description: 'Overview of KhmerAPI and architecture' },
  { id: 'doc-auth', title: 'Authentication & API Keys', category: 'Documentation', path: '/docs/authentication', description: 'Bearer tokens, X-API-Key headers, and security' },
  { id: 'doc-rate', title: 'Rate Limits & Quotas', category: 'Documentation', path: '/docs/rate-limits', description: 'Anonymous and Developer rate limits' },
  { id: 'doc-provinces', title: 'Provinces API', category: 'API Endpoint', path: '/docs/provinces', description: 'List and retrieve 25 Cambodia provinces', method: 'GET' },
  { id: 'doc-districts', title: 'Districts API', category: 'API Endpoint', path: '/docs/districts', description: 'List districts (Khan / Srok / Krong)', method: 'GET' },
  { id: 'doc-communes', title: 'Communes API', category: 'API Endpoint', path: '/docs/communes', description: 'List communes (Sangkat / Khum)', method: 'GET' },
  { id: 'doc-villages', title: 'Villages API', category: 'API Endpoint', path: '/docs/villages', description: 'List villages (Phum)', method: 'GET' },
  { id: 'doc-postal', title: 'Postal Codes API', category: 'API Endpoint', path: '/docs/postal-codes', description: '5-digit postal code lookup for Cambodia', method: 'GET' },
  { id: 'doc-locations', title: 'Complete Address Hierarchy', category: 'API Endpoint', path: '/docs/locations', description: 'Full 4-tier tree lookup for any administrative code', method: 'GET' },
  { id: 'doc-search', title: 'Multi-Language Search API', category: 'API Endpoint', path: '/docs/search', description: 'Search across Khmer/English names and codes', method: 'GET' },
  { id: 'doc-geo', title: 'GeoJSON Spatial APIs', category: 'API Endpoint', path: '/docs/geo', description: 'GeoJSON FeatureCollections with coordinates', method: 'GET' },
  { id: 'doc-stats', title: 'Statistics API', category: 'API Endpoint', path: '/docs/statistics', description: 'Live database counts for all entities', method: 'GET' },
  { id: 'nav-apis', title: 'API Catalog', category: 'Developer', path: '/apis', description: 'Browse all available public Cambodia APIs' },
  { id: 'nav-explorer', title: 'Interactive API Explorer', category: 'Developer', path: '/explorer', description: 'Test endpoints in real-time with custom parameters' },
  { id: 'nav-status', title: 'System Status & Uptime', category: 'Developer', path: '/status', description: 'Real-time API, Database, and System health' },
  { id: 'nav-keys', title: 'Developer API Keys', category: 'Developer', path: '/dashboard/keys', description: 'Manage developer API keys and usage' },
];

function getInitialRecent(): string[] {
  try {
    const saved = localStorage.getItem('khmerapi_recent_searches');
    return saved ? JSON.parse(saved) : ['Phnom Penh', 'Provinces', 'Postal Codes', '12000'];
  } catch {
    return ['Phnom Penh', 'Provinces', 'Postal Codes', '12000'];
  }
}

export const useSearchStore = defineStore('search', () => {
  const isOpen = ref(false);
  const query = ref('');
  const isLoading = ref(false);
  const docResults = ref<DocSearchItem[]>(STATIC_DOC_ITEMS.slice(0, 6));
  const locationResults = ref<SearchResultItem[]>([]);
  const recentSearches = ref<string[]>(getInitialRecent());

  function open() {
    isOpen.value = true;
    query.value = '';
    filterStaticDocs('');
  }

  function close() {
    isOpen.value = false;
    query.value = '';
    locationResults.value = [];
  }

  function toggle() {
    if (isOpen.value) close();
    else open();
  }

  function addRecent(searchTerm: string) {
    if (!searchTerm.trim()) return;
    const filtered = recentSearches.value.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase());
    recentSearches.value = [searchTerm.trim(), ...filtered].slice(0, 5);
    localStorage.setItem('khmerapi_recent_searches', JSON.stringify(recentSearches.value));
  }

  function filterStaticDocs(q: string) {
    if (!q.trim()) {
      docResults.value = STATIC_DOC_ITEMS.slice(0, 6);
      return;
    }
    const lower = q.toLowerCase();
    docResults.value = STATIC_DOC_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.path.toLowerCase().includes(lower)
    );
  }

  let searchTimeout: any = null;
  async function performSearch(q: string) {
    query.value = q;
    filterStaticDocs(q);

    if (!q.trim()) {
      locationResults.value = [];
      isLoading.value = false;
      return;
    }

    if (searchTimeout) clearTimeout(searchTimeout);
    isLoading.value = true;

    searchTimeout = setTimeout(async () => {
      try {
        const res = await searchApi.search(q, 8);
        if (res.success && Array.isArray(res.data)) {
          locationResults.value = res.data;
        }
      } catch (_err) {
        locationResults.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 200);
  }

  return {
    isOpen,
    query,
    isLoading,
    docResults,
    locationResults,
    recentSearches,
    open,
    close,
    toggle,
    addRecent,
    performSearch,
  };
});
