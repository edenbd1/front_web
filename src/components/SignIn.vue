<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BasicInput from '../components/BasicInput.vue';
import { postJSON } from '../api-client/api-client';
import { ArrowRightIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const rememberMe = ref(false);

// Validation states
const isEmailValid = computed(() => !email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => !password.value || password.value.length >= 6);
const isFormValid = computed(() => email.value && password.value && isEmailValid.value && isPasswordValid.value);

async function onSubmit() {
  if (!isFormValid.value) return;
  
  error.value = '';
  isLoading.value = true;
  try {
    const response = await postJSON('/api/login', { email: email.value, password: password.value });
    if (response && response.token) {
      // Store token
      localStorage.setItem('token', response.token);
      if (rememberMe.value) {
        localStorage.setItem('remember_session', 'true');
      }
      
      // Force a DOM update before navigation
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Redirect to contacts page
      router.replace('/contacts');
    } else {
      error.value = 'Login failed. Please check your credentials.';
    }
  } catch (err: any) {
    if (err.status === 401 || err.data?.message?.includes('Invalid email or password')) {
      error.value = 'Invalid email or password.';
    } else if (err.status === 400) {
      error.value = 'Invalid request. Please check your input.';
    } else {
      error.value = 'Login failed due to a server error. Please try again later.';
    }
    console.error('Login error:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="w-full max-w-md mx-auto">
      <!-- Login card with floating effect -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <!-- Header with illustration -->
        <div class="bg-primary-lightest dark:bg-primary-dark/20 p-6 pb-10 relative">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-primary-dark dark:text-primary-lighter mb-1 tracking-tight">Welcome Back!</h1>
            <p class="text-gray-600 dark:text-gray-300">Sign in to your account to continue</p>
          </div>
          
          <!-- Decorative elements -->
          <div class="absolute -bottom-6 left-0 w-full flex justify-center">
            <div class="h-12 w-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
              <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                <ArrowRightIcon class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Form section -->
        <div class="p-6 pt-10">
          <div v-if="error" 
              class="error-box mb-6 flex items-center gap-2"
              role="alert">
            <ExclamationCircleIcon class="h-5 w-5 text-danger flex-shrink-0" />
            <span>{{ error }}</span>
          </div>
          
          <form @submit.prevent="onSubmit" class="space-y-5">
            <BasicInput
              id="email"
              type="email"
              label="Email Address"
              v-model="email"
              autocomplete="email"
              placeholder="you@example.com"
              :error="email && !isEmailValid ? 'Please enter a valid email address' : ''"
              required
            />
            
            <BasicInput
              id="password"
              type="password"
              label="Password"
              v-model="password"
              autocomplete="current-password"
              placeholder="Your password"
              :error="password && !isPasswordValid ? 'Password must be at least 6 characters' : ''"
              show-toggle
              required
            />
            
            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2 text-sm cursor-pointer">
                <input type="checkbox" v-model="rememberMe" class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4">
                <span class="text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              
              <a href="#" class="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              class="btn-primary w-full group"
              :class="{'opacity-80 cursor-not-allowed': !isFormValid || isLoading}"
              :disabled="!isFormValid || isLoading"
            >
              <span class="relative inline-flex items-center">
                {{ isLoading ? 'Signing In...' : 'Sign In' }}
                <ArrowRightIcon class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Don't have an account?
              <router-link to="/signup" class="font-semibold text-primary hover:text-primary-dark hover:underline transition-colors">
                Create account
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>