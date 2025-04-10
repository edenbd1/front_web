<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter, RouterView, useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

const isAuthenticated = computed(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        console.log("Authentication state:", !!token); // Debug log
        return !!token;
    }
    return false;
});

const useSidebarLayout = computed(() => {
    return route.path.startsWith('/contacts');
});

function logout() {
  // Clear all authentication data
  if (typeof window !== 'undefined' && window.localStorage) {
    console.log("Logging out...");
    
    // Remove token and any other auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('remember_session');
    
    // Ensure any cached data is cleared
    sessionStorage.clear();
    
    // Force a small delay to ensure state updates
    setTimeout(() => {
      // Force redirect to home page
      router.push('/');
    }, 100);
  }
}

// Listen for toggle-sidebar event from AppHeader
onMounted(() => {
  document.addEventListener('toggle-sidebar', () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  });
  
  // Force re-evaluation of authentication status on route changes
  router.afterEach(() => {
    isSidebarOpen.value = false;
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200">
    <AppHeader 
      :is-authenticated="isAuthenticated" 
      @logout="logout"
    />

    <div class="flex flex-1 relative overflow-hidden">
      <AppSidebar 
        v-if="useSidebarLayout" 
        :is-open="isSidebarOpen" 
        :is-mobile="isSidebarOpen"
        @close="isSidebarOpen = false" 
      />
      
      <main class="flex-1 flex flex-col p-4 sm:p-6 overflow-auto transition-all duration-200">
        <RouterView class="flex-1 flex flex-col" v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
      
      <!-- Theme switcher (fixed position) -->
      <div class="fixed bottom-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
    </div>

    <footer class="py-2 px-4 bg-white dark:bg-gray-800 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <p>ContactManager © {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
html {
  scroll-behavior: smooth;
}

body {
  @apply font-sans antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
</style>