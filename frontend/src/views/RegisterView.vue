<template>
  <div class="flex min-h-[calc(100vh-14rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm space-y-6">
      <div class="space-y-2 text-center">
        <span class="text-3xl">🇰🇭</span>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Create Developer Account</h1>
        <p class="text-xs text-zinc-500">
          Get your free API key and 300 requests/minute limit in seconds.
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

        <form @submit.prevent="handleRegister" class="space-y-3.5">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-zinc-700">First Name</label>
              <input
                v-model="firstName"
                type="text"
                required
                placeholder="Sok"
                class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-zinc-700">Last Name</label>
              <input
                v-model="lastName"
                type="text"
                required
                placeholder="Dara"
                class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-semibold text-zinc-700">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="dara@company.com"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-semibold text-zinc-700">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              placeholder="Minimum 8 characters"
              class="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div class="pt-1">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Loader2Icon v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ isLoading ? 'Creating Account...' : 'Get API Key (Free)' }}</span>
            </button>
          </div>
        </form>

        <div class="border-t border-zinc-100 pt-3 text-center text-xs text-zinc-500">
          <span>Already have an account?</span>
          <router-link to="/login" class="ml-1 font-semibold text-zinc-900 hover:underline">
            Sign In
          </router-link>
        </div>
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

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

async function handleRegister() {
  isLoading.value = true;
  errorMessage.value = null;

  const result = await authStore.register({
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    password: password.value,
  });

  isLoading.value = false;

  if (result.success) {
    router.push('/dashboard');
  } else {
    errorMessage.value = result.error || 'Registration failed. Please check your inputs.';
  }
}
</script>
