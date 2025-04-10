<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const isDarkMode = ref(false);

// Initialize theme
onMounted(() => {
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});

// Update theme
watchEffect(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
});

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    aria-label="Toggle dark mode"
  >
    <SunIcon v-if="isDarkMode" class="h-5 w-5" />
    <MoonIcon v-else class="h-5 w-5" />
  </button>
</template> 