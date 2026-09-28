<template>
  <div class="min-h-screen flex flex-col bg-[#FAFAFA] text-[#18181B] font-sans antialiased selection:bg-zinc-900 selection:text-white">
    <!-- Global Header / Navbar -->
    <Navbar />

    <!-- Main Dynamic Route View -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer -->
    <Footer />

    <!-- Universal Command Palette Search Modal (⌘K / /) -->
    <SearchModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
import SearchModal from './components/layout/SearchModal.vue';
import { useAuthStore } from './stores/auth.store';
import { useStatusStore } from './stores/status.store';

const authStore = useAuthStore();
const statusStore = useStatusStore();

onMounted(async () => {
  // Check auth session
  if (authStore.accessToken) {
    await authStore.fetchMe();
  }
  // Initialize health ping & stats
  statusStore.checkHealth();
  statusStore.fetchStatistics();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
