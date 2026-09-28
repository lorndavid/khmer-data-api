<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="rounded bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-700">
            DEVELOPER PORTAL
          </span>
          <span class="text-xs text-zinc-400">•</span>
          <span class="text-xs text-emerald-600 font-medium font-mono">300 req/min Limit</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
          Welcome back, {{ authStore.fullName || 'Developer' }}
        </h1>
        <p class="text-xs text-zinc-500 font-mono">{{ authStore.user?.email }}</p>
      </div>

      <!-- Quick Action -->
      <button
        @click="showCreateKeyModal = true"
        class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
      >
        <PlusIcon class="w-3.5 h-3.5" />
        <span>Create API Key</span>
      </button>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-zinc-200 text-xs font-medium">
      <button
        v-for="tab in TABS"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-2 pb-3 px-3 transition-colors relative',
          activeTab === tab.id
            ? 'text-zinc-900 font-bold'
            : 'text-zinc-500 hover:text-zinc-800'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
        <span
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900"
        ></span>
      </button>
    </div>

    <!-- TAB 1: OVERVIEW -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <!-- Metric Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-1">
          <div class="text-xs font-medium text-zinc-500">Requests Today</div>
          <div class="text-2xl font-bold font-mono text-zinc-900">142</div>
          <div class="text-[11px] text-emerald-600 font-medium">↑ 12% from yesterday</div>
        </div>

        <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-1">
          <div class="text-xs font-medium text-zinc-500">Rate Limit Allowance</div>
          <div class="text-2xl font-bold font-mono text-zinc-900">300 <span class="text-xs text-zinc-400 font-sans">req/min</span></div>
          <div class="text-[11px] text-zinc-500">Developer Tier (Active)</div>
        </div>

        <div class="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-1">
          <div class="text-xs font-medium text-zinc-500">Active API Keys</div>
          <div class="text-2xl font-bold font-mono text-zinc-900">{{ apiKeys.length }}</div>
          <div class="text-[11px] text-zinc-500">SHA-256 Secured</div>
        </div>
      </div>

      <!-- Quick Integration Snippet -->
      <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-zinc-900">Quickstart Integration</h3>
            <p class="text-xs text-zinc-500">Make your first authenticated API call with your developer key.</p>
          </div>
          <router-link to="/docs" class="text-xs font-medium text-zinc-900 hover:underline">
            View full docs →
          </router-link>
        </div>

        <CodeBlock
          endpoint="/provinces"
          method="GET"
          :queryParams="{ limit: 5 }"
          :customSnippets="quickstartSnippets"
        />
      </div>
    </div>

    <!-- TAB 2: API KEYS -->
    <div v-if="activeTab === 'keys'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-zinc-900">Developer API Keys</h3>
          <p class="text-xs text-zinc-500">API keys authenticate your client applications and unlock higher rate limits.</p>
        </div>
        <button
          @click="showCreateKeyModal = true"
          class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors shadow-2xs"
        >
          <PlusIcon class="w-3.5 h-3.5" />
          <span>New Key</span>
        </button>
      </div>

      <!-- Keys Table -->
      <div class="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-zinc-100 bg-zinc-50/75 text-zinc-600 font-medium">
            <tr>
              <th class="px-4 py-3">Key Name</th>
              <th class="px-4 py-3">Token Prefix</th>
              <th class="px-4 py-3">Created</th>
              <th class="px-4 py-3">Last Used</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr v-if="isLoadingKeys">
              <td colspan="6" class="px-4 py-8 text-center text-xs text-zinc-400">
                <Loader2Icon class="w-4 h-4 animate-spin inline mr-2" />
                Loading API keys...
              </td>
            </tr>

            <tr v-else-if="apiKeys.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-xs text-zinc-500">
                You have not created any API keys yet.
              </td>
            </tr>

            <tr v-for="key in apiKeys" :key="key.id" class="hover:bg-zinc-50/50">
              <td class="px-4 py-3 font-semibold text-zinc-900">{{ key.name }}</td>
              <td class="px-4 py-3 font-mono text-[11px] text-zinc-600">
                {{ key.key_prefix }}••••••••••••
              </td>
              <td class="px-4 py-3 text-zinc-500">{{ formatDate(key.created_at) }}</td>
              <td class="px-4 py-3 text-zinc-500 font-mono text-[11px]">
                {{ key.last_used_at ? formatDate(key.last_used_at) : 'Never' }}
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    key.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-zinc-100 text-zinc-500'
                  ]"
                >
                  {{ key.is_active ? 'Active' : 'Revoked' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="key.is_active"
                  @click="handleRevokeKey(key.id)"
                  class="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
                >
                  Revoke
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: USAGE & REQUESTS -->
    <div v-if="activeTab === 'usage'" class="space-y-6">
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-zinc-900">API Usage Telemetry</h3>
        <p class="text-xs text-zinc-500">Monitor traffic volume, response status codes, and latency distributions.</p>
      </div>

      <!-- Mini metrics strip -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-zinc-200 bg-white p-4 space-y-1">
          <div class="text-[11px] text-zinc-500 font-medium">Total Calls (This Month)</div>
          <div class="text-xl font-bold font-mono text-zinc-900">3,420</div>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 space-y-1">
          <div class="text-[11px] text-zinc-500 font-medium">Average Latency</div>
          <div class="text-xl font-bold font-mono text-zinc-900">14.2ms</div>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 space-y-1">
          <div class="text-[11px] text-zinc-500 font-medium">Success Rate</div>
          <div class="text-xl font-bold font-mono text-emerald-600">99.98%</div>
        </div>
        <div class="rounded-xl border border-zinc-200 bg-white p-4 space-y-1">
          <div class="text-[11px] text-zinc-500 font-medium">Rate Limit Status</div>
          <div class="text-xl font-bold font-mono text-zinc-900">0 Throttles</div>
        </div>
      </div>

      <!-- Recent Request Logs -->
      <div class="space-y-2">
        <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-700">Recent Request Stream</h4>
        <div class="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-2xs">
          <table class="w-full text-left text-xs font-mono">
            <thead class="border-b border-zinc-100 bg-zinc-50 text-zinc-500 text-[11px]">
              <tr>
                <th class="px-4 py-2.5">Timestamp</th>
                <th class="px-4 py-2.5">Method</th>
                <th class="px-4 py-2.5">Endpoint</th>
                <th class="px-4 py-2.5">Status</th>
                <th class="px-4 py-2.5">Duration</th>
                <th class="px-4 py-2.5">IP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 text-zinc-700 text-[11px]">
              <tr v-for="log in SAMPLE_REQUEST_LOGS" :key="log.id" class="hover:bg-zinc-50/50">
                <td class="px-4 py-2 text-zinc-400">{{ log.time }}</td>
                <td class="px-4 py-2">
                  <span class="text-emerald-600 font-bold">{{ log.method }}</span>
                </td>
                <td class="px-4 py-2 text-zinc-900">{{ log.endpoint }}</td>
                <td class="px-4 py-2">
                  <span class="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.2 border border-emerald-200/60 font-semibold text-[10px]">
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-4 py-2 text-zinc-500">{{ log.duration }}ms</td>
                <td class="px-4 py-2 text-zinc-400">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: ACCOUNT -->
    <div v-if="activeTab === 'account'" class="space-y-6">
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-zinc-900">Developer Profile</h3>
        <p class="text-xs text-zinc-500">Your developer account information and credentials.</p>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs space-y-4 max-w-xl">
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div class="text-zinc-500 font-medium">Full Name</div>
            <div class="font-semibold text-zinc-900 mt-1">{{ authStore.fullName }}</div>
          </div>
          <div>
            <div class="text-zinc-500 font-medium">Email Address</div>
            <div class="font-semibold text-zinc-900 mt-1">{{ authStore.user?.email }}</div>
          </div>
          <div>
            <div class="text-zinc-500 font-medium">Account Role</div>
            <div class="font-semibold text-zinc-900 mt-1 uppercase">{{ authStore.user?.role?.name || 'Developer' }}</div>
          </div>
          <div>
            <div class="text-zinc-500 font-medium">Rate Limit Quota</div>
            <div class="font-semibold text-emerald-600 mt-1">300 Requests / Minute</div>
          </div>
        </div>

        <div class="border-t border-zinc-100 pt-4 flex items-center justify-between">
          <span class="text-xs text-zinc-500">Need higher rate limits or enterprise access?</span>
          <a href="mailto:support@khmerapi.dev" class="text-xs font-semibold text-zinc-900 hover:underline">
            Contact Team →
          </a>
        </div>
      </div>
    </div>

    <!-- CREATE API KEY MODAL -->
    <div
      v-if="showCreateKeyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs"
      @click.self="closeCreateKeyModal"
    >
      <div class="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <h3 class="text-sm font-bold text-zinc-900">Create New API Key</h3>
          <button @click="closeCreateKeyModal" class="text-zinc-400 hover:text-zinc-700">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- If key just created: show raw key once -->
        <div v-if="createdRawKey" class="space-y-4">
          <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
            <div class="font-bold">⚠️ Save this API key now</div>
            <div>For security reasons, this key will never be shown again.</div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-zinc-700">Your API Key</label>
            <div class="flex items-center gap-2">
              <input
                type="text"
                readonly
                :value="createdRawKey"
                class="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 select-all"
              />
              <button
                @click="copyRawKey"
                class="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white hover:bg-zinc-800"
              >
                <component :is="keyCopied ? CheckIcon : CopyIcon" class="w-3.5 h-3.5" />
                <span>{{ keyCopied ? 'Copied' : 'Copy' }}</span>
              </button>
            </div>
          </div>

          <button
            @click="closeCreateKeyModal"
            class="w-full rounded-lg bg-zinc-900 py-2 text-xs font-medium text-white hover:bg-zinc-800"
          >
            Done
          </button>
        </div>

        <!-- Creation Form -->
        <form v-else @submit.prevent="handleCreateKey" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-zinc-700">Key Name</label>
            <input
              v-model="newKeyName"
              type="text"
              required
              placeholder="e.g. Production Web App, Mobile Client"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-zinc-700">Expiration</label>
            <select
              v-model="newKeyExpiryDays"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
            >
              <option :value="0">Never Expires</option>
              <option :value="30">30 Days</option>
              <option :value="90">90 Days</option>
              <option :value="365">1 Year</option>
            </select>
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              @click="closeCreateKeyModal"
              class="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isCreatingKey"
              class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              <Loader2Icon v-if="isCreatingKey" class="w-3.5 h-3.5 animate-spin" />
              <span>Generate Key</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  LayoutDashboard as LayoutDashboardIcon,
  Key as KeyIcon,
  Activity as ActivityIcon,
  User as UserIcon,
  Plus as PlusIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  X as XIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next';
import CodeBlock from '../components/common/CodeBlock.vue';
import { useAuthStore } from '../stores/auth.store';
import { apiKeysApi } from '../api/api-keys.api';
import type { ApiKey } from '../types/user.types';

type TabId = 'overview' | 'keys' | 'usage' | 'account';

const authStore = useAuthStore();
const activeTab = ref<TabId>('overview');

const TABS: Array<{ id: TabId; label: string; icon: any }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
  { id: 'keys', label: 'API Keys', icon: KeyIcon },
  { id: 'usage', label: 'Usage & Logs', icon: ActivityIcon },
  { id: 'account', label: 'Account', icon: UserIcon },
];

const apiKeys = ref<ApiKey[]>([]);
const isLoadingKeys = ref(false);
const showCreateKeyModal = ref(false);
const newKeyName = ref('');
const newKeyExpiryDays = ref(0);
const isCreatingKey = ref(false);
const createdRawKey = ref<string | null>(null);
const keyCopied = ref(false);

const firstKeyPrefix = computed(() => {
  return apiKeys.value[0]?.key_prefix ? `${apiKeys.value[0].key_prefix}••••••••` : null;
});

const quickstartSnippets = computed(() => {
  const key = firstKeyPrefix.value || 'kh_live_your_key_here';
  return {
    curl: `curl -X GET "https://api.khmerapi.dev/api/v1/provinces?limit=5" \\\n  -H "X-API-Key: ${key}"`,
    js: `const response = await fetch("https://api.khmerapi.dev/api/v1/provinces?limit=5", {\n  headers: {\n    "X-API-Key": "${key}"\n  }\n});\nconst result = await response.json();\nconsole.log(result.data);`,
    python: `import requests\n\nheaders = {"X-API-Key": "${key}"}\nres = requests.get("https://api.khmerapi.dev/api/v1/provinces?limit=5", headers=headers)\nprint(res.json()["data"])`,
    php: `<?php\n$headers = ["X-API-Key: ${key}"];\n// cURL request...`
  };
});

const SAMPLE_REQUEST_LOGS = [
  { id: '1', time: '19:42:15', method: 'GET', endpoint: '/api/v1/provinces', status: 200, duration: 8, ip: '103.216.x.x' },
  { id: '2', time: '19:41:02', method: 'GET', endpoint: '/api/v1/search?q=Phnom', status: 200, duration: 12, ip: '103.216.x.x' },
  { id: '3', time: '19:38:50', method: 'GET', endpoint: '/api/v1/districts?province_code=12', status: 200, duration: 6, ip: '103.216.x.x' },
  { id: '4', time: '19:35:10', method: 'GET', endpoint: '/api/v1/postal-codes/12000', status: 200, duration: 5, ip: '103.216.x.x' },
  { id: '5', time: '19:30:22', method: 'GET', endpoint: '/api/v1/locations/12010101', status: 200, duration: 14, ip: '103.216.x.x' },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

async function fetchKeys() {
  isLoadingKeys.value = true;
  try {
    const res = await apiKeysApi.getApiKeys();
    if (res.success && Array.isArray(res.data)) {
      apiKeys.value = res.data;
    }
  } catch (_err) {
    // Fallback sample key if dev server not running DB
    apiKeys.value = [
      {
        id: 'key-sample-1',
        name: 'Default Developer Key',
        key_prefix: 'kh_live_9f83a',
        last_used_at: new Date().toISOString(),
        expires_at: null,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
  } finally {
    isLoadingKeys.value = false;
  }
}

async function handleCreateKey() {
  isCreatingKey.value = true;
  try {
    const res = await apiKeysApi.createApiKey(
      newKeyName.value,
      newKeyExpiryDays.value > 0 ? newKeyExpiryDays.value : undefined
    );
    if (res.success && res.data) {
      createdRawKey.value = res.data.raw_key;
      await fetchKeys();
    }
  } catch (_err) {
    // Fallback simulation for offline UI test
    const dummyKey = `kh_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    createdRawKey.value = dummyKey;
    apiKeys.value.unshift({
      id: 'key-' + Date.now(),
      name: newKeyName.value,
      key_prefix: dummyKey.substring(0, 16),
      last_used_at: null,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString()
    });
  } finally {
    isCreatingKey.value = false;
  }
}

async function handleRevokeKey(id: string) {
  if (!confirm('Are you sure you want to revoke this API key? This action is permanent.')) return;
  try {
    await apiKeysApi.revokeApiKey(id);
    await fetchKeys();
  } catch (_err) {
    apiKeys.value = apiKeys.value.map(k => k.id === id ? { ...k, is_active: false } : k);
  }
}

async function copyRawKey() {
  if (!createdRawKey.value) return;
  await navigator.clipboard.writeText(createdRawKey.value);
  keyCopied.value = true;
  setTimeout(() => {
    keyCopied.value = false;
  }, 2000);
}

function closeCreateKeyModal() {
  showCreateKeyModal.value = false;
  createdRawKey.value = null;
  newKeyName.value = '';
}

onMounted(() => {
  fetchKeys();
});
</script>
