<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { XMarkIcon, UserGroupIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  isOpen: boolean;
  isMobile: boolean;
}>();

const emit = defineEmits(['close']);

const route = useRoute();

const menuItems = [
  {
    name: 'Contacts',
    path: '/contacts',
    icon: UserGroupIcon,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Cog6ToothIcon,
    disabled: true,
  }
];

const sidebarClasses = computed(() => {
  return {
    'translate-x-0': props.isOpen,
    '-translate-x-full': !props.isOpen && props.isMobile,
  };
});

function closeSidebar() {
  emit('close');
}
</script>

<template>
  <!-- Mobile backdrop -->
  <div
    v-if="isMobile && isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    class="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md h-full flex-shrink-0 transition-transform duration-300 ease-in-out z-30 fixed lg:static lg:translate-x-0"
    :class="sidebarClasses"
  >
    <div class="h-full flex flex-col">
      <!-- En-tête avec logo et bouton de fermeture -->
      <div class="px-5 pt-5 pb-3 flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shadow-sm">
            <span class="font-semibold">CM</span>
          </div>
          <span class="ml-3 font-medium text-gray-800 dark:text-gray-200">
            Contact Manager
          </span>
        </div>
        <button
          @click="closeSidebar"
          class="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
          aria-label="Close sidebar"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Séparateur -->
      <div class="mx-5 border-t border-gray-200 dark:border-gray-700 mb-3"></div>

      <!-- Section de navigation -->
      <div class="px-5 mb-2">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Menu principal
        </h3>
      </div>

      <!-- Navigation avec plus d'espacement et meilleur design -->
      <nav class="flex-1 py-2 px-4 space-y-2 overflow-y-auto">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.disabled ? '#' : item.path"
          class="flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out"
          :class="[
            item.disabled 
              ? 'opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400'
              : route.path.startsWith(item.path)
                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-[1.02]'
          ]"
          @click="item.disabled ? $event.preventDefault() : null"
        >
          <component :is="item.icon" class="w-6 h-6 mr-3 flex-shrink-0" />
          <span class="font-medium">{{ item.name }}</span>
        </router-link>
      </nav>

      <!-- Footer amélioré -->
      <div class="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 rounded-tl-xl">
        <div class="flex items-center space-x-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              Contact Manager
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              v1.0.0 2025 Eden
            </p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template> 