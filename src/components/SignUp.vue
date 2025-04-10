<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BasicInput from '../components/BasicInput.vue';
import { postJSON } from '../api-client/api-client';
import { ArrowRightIcon, ExclamationCircleIcon, UserPlusIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const isLoading = ref(false);
const termsAccepted = ref(false);

// Validation states
const isUsernameValid = computed(() => !username.value || username.value.length >= 3);
const isEmailValid = computed(() => !email.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isPasswordValid = computed(() => !password.value || password.value.length >= 6);
const doPasswordsMatch = computed(() => !confirmPassword.value || password.value === confirmPassword.value);
const isFormValid = computed(() => {
  return username.value && 
         email.value && 
         password.value && 
         confirmPassword.value &&
         isUsernameValid.value && 
         isEmailValid.value && 
         isPasswordValid.value && 
         doPasswordsMatch.value &&
         termsAccepted.value;
});

async function onSubmit() {
  if (!isFormValid.value) return;
  
   error.value = '';
   isLoading.value = true;

  try {
    await postJSON('/api/users', {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
    });
    router.replace('/signin');
  } catch (err: any) {
     if (err.status === 409 || err.message?.includes('duplicate')) {
         error.value = 'Username or email already exists.';
     } else {
        error.value = 'Sign up failed. Please try again.';
     }
    console.error('Signup error:', err);
  } finally {
      isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="w-full max-w-md mx-auto">
      <!-- Signup card with floating effect -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <!-- Header with illustration -->
        <div class="bg-primary-lightest dark:bg-primary-dark/20 p-6 pb-10 relative">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-primary-dark dark:text-primary-lighter mb-1 tracking-tight">Create Account</h1>
            <p class="text-gray-600 dark:text-gray-300">Join our community today</p>
          </div>
          
          <!-- Decorative elements -->
          <div class="absolute -bottom-6 left-0 w-full flex justify-center">
            <div class="h-12 w-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md">
              <div class="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
                <UserPlusIcon class="h-4 w-4" />
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
          id="username"
          type="text"
          label="Username"
          v-model="username"
          autocomplete="username"
          placeholder="Choose a username"
              :error="username && !isUsernameValid ? 'Username must be at least 3 characters' : ''"
          required
        />
            
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
          autocomplete="new-password"
          placeholder="Create a password"
              :error="password && !isPasswordValid ? 'Password must be at least 6 characters' : ''"
              show-toggle
              required
            />
            
            <BasicInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              v-model="confirmPassword"
              autocomplete="new-password"
              placeholder="Confirm your password"
              :error="confirmPassword && !doPasswordsMatch ? 'Passwords do not match' : ''"
          show-toggle
          required
        />
            
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  v-model="termsAccepted"
                  class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  required
                />
              </div>
              <label for="terms" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
            
        <button
          type="submit"
              class="btn-primary w-full group"
              :class="{'opacity-80 cursor-not-allowed': !isFormValid || isLoading}"
              :disabled="!isFormValid || isLoading"
        >
              <span class="relative inline-flex items-center">
           {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
                <ArrowRightIcon class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
        </button>
      </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
        Already have an account?
              <router-link to="/signin" class="font-semibold text-primary hover:text-primary-dark hover:underline transition-colors">
            Sign in
        </router-link>
      </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>