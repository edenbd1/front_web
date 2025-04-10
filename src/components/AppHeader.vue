<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { 
  Bars3Icon, 
  ArrowRightOnRectangleIcon, 
  ArrowLeftOnRectangleIcon, 
  UserPlusIcon,
  UsersIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const showLogoutConfirm = ref(false);
const isTokenPresent = ref(false);

// Force checking token on component creation
onMounted(() => {
  checkAuthStatus();
  // Recheck every 500ms to ensure consistency
  setInterval(checkAuthStatus, 500);
});

function checkAuthStatus() {
  isTokenPresent.value = !!localStorage.getItem('token');
}

function confirmLogout() {
  showLogoutConfirm.value = true;
}

function handleLogout() {
  showLogoutConfirm.value = false;
  // Clear all authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('remember_session');
  sessionStorage.clear();
  isTokenPresent.value = false;
  
  // Force a small delay to ensure state updates
  setTimeout(() => {
    // Redirect to home page with absolute URL
    window.location.href = 'http://localhost:5173/';
  }, 100);
}

function cancelLogout() {
  showLogoutConfirm.value = false;
}

function toggleSidebar() {
  // Emit replaced with direct event
  document.dispatchEvent(new CustomEvent('toggle-sidebar'));
}
</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40 sticky top-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left side - Logo & Hamburger -->
        <div class="flex items-center">
          <!-- Mobile hamburger -->
          <button
            v-if="isTokenPresent"
            class="p-2 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 mr-3 lg:hidden transition-colors"
            @click="toggleSidebar"
            aria-label="Toggle menu"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>
          
          <!-- Logo -->
          <div class="flex items-center">
            <img src="/contactmanager.png" alt="Contact Manager Logo" class="h-9 w-9 rounded-xl" />
            <component 
              :is="isTokenPresent ? RouterLink : 'div'" 
              :to="isTokenPresent ? '/contacts' : undefined"
              class="ml-3 text-xl font-bold text-primary-dark dark:text-primary-lighter hover:text-primary hover:dark:text-primary-light transition-colors tracking-tight"
            >
              Contact Manager
            </component>
          </div>
        </div>
        
        <!-- Right side - Navigation/Auth buttons -->
        <div class="flex items-center space-x-3">
          <template v-if="isTokenPresent">
            <button
              @click="confirmLogout"
              class="group flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-primary border-2 border-primary hover:bg-primary-lightest rounded-xl transition-all shadow-sm"
              aria-label="Logout"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 transition-colors" />
              <span class="hidden sm:inline">Logout</span>
            </button>
            
            <!-- Logout confirmation modal -->
            <div v-if="showLogoutConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-sm w-full shadow-xl animate-fade-in">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Confirm Logout</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to log out of your account?</p>
                <div class="flex justify-end space-x-3">
                  <button 
                    @click="cancelLogout" 
                    class="btn-outline-secondary text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="handleLogout" 
                    class="btn-danger text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <RouterLink
              v-if="route.path !== '/signin'"
              to="/signin"
              class="flex items-center px-4 py-2 text-sm font-medium text-primary border-2 border-primary hover:bg-primary-lightest rounded-xl transition-colors"
            >
              <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-1.5" />
              <span>Sign In</span>
            </RouterLink>
            
            <RouterLink
              v-if="route.path !== '/signup'"
              to="/signup"
              class="flex items-center px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors shadow-sm hover:shadow-md"
            >
              <UserPlusIcon class="h-5 w-5 mr-1.5" />
              <span>Sign Up</span>
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>