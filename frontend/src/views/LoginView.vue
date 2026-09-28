<template>
  <div class="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-2 text-center">
        <span class="text-3xl">🇰🇭</span>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Developer Sign In</h1>
        <p class="text-xs text-zinc-500">
          Sign in to manage your API keys, rate limits, and analytics.
        </p>
      </div>

      <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-card space-y-4">
        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-semibold text-zinc-700">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="developer@example.com"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-zinc-700">Password</label>
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Loader2Icon v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
            <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="border-t border-zinc-100 pt-3 text-center text-xs text-zinc-500">
          <span>Don't have an account?</span>
          <router-link to="/register" class="ml-1 font-semibold text-zinc-900 hover:underline">
            Get API Key
          </router-link>
        </div>
      </div>

      <!-- Quick Demo Access note -->
      <div class="rounded-lg border border-zinc-200/80 bg-zinc-50 p-3 text-[11px] text-zinc-500 space-y-1">
        <div class="font-semibold text-zinc-700">Default Super Admin Credentials:</div>
        <div class="font-mono text-[10px] text-zinc-600">Email: admin@khmerapi.dev</div>
        <div class="font-mono text-[10px] text-zinc-600">Password: KhmerAPI@2026</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 as Loader2Icon } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleLogin() {
  isLoading.value = true;
  errorMessage.value = null;

  const result = await authStore.login({
    email: email.value,
    password: password.value,
  });

  isLoading.value = false;

  if (result.success) {
    router.push('/dashboard');
  } else {
    errorMessage.value = result.error || 'Authentication failed. Please check your credentials.';
  }
}
</script>
