<script setup lang="ts">
import { ref } from 'vue';
import { createContact, Contact } from '../../services/ContactService';
import BasicInput from '../BasicInput.vue';
import { UserPlusIcon } from '@heroicons/vue/24/outline';

const name = ref('');
const surname = ref('');
const nickname = ref('');
const phone = ref('');
const email = ref('');
const company = ref('');
const education = ref('');
const dateOfBirth = ref('');
const address = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const formStep = ref<'basic' | 'details'>('basic');

const emit = defineEmits(['created', 'close']);

async function handleSubmit() {
  if (!name.value || !surname.value) {
    error.value = 'Name and surname are required';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    error.value = 'Authentication required';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const formattedDate = dateOfBirth.value ? new Date(dateOfBirth.value).toISOString() : null;
    const newContact = await createContact(
      name.value,
      surname.value,
      nickname.value,
      phone.value,
      email.value,
      company.value,
      education.value,
      formattedDate,
      address.value,
      token
    );
    
    // Reset form
    name.value = '';
    surname.value = '';
    nickname.value = '';
    phone.value = '';
    email.value = '';
    company.value = '';
    education.value = '';
    dateOfBirth.value = '';
    address.value = '';
    formStep.value = 'basic';
    
    // Emit event with the new contact
    emit('created', newContact);
  } catch (err) {
    console.error(err);
    error.value = err instanceof Error ? err.message : 'Failed to create contact';
  } finally {
    isLoading.value = false;
  }
}

function nextStep() {
  if (!name.value || !surname.value) {
    error.value = 'Name and surname are required';
    return;
  }
  
  error.value = null;
  formStep.value = 'details';
}

function prevStep() {
  formStep.value = 'basic';
}

function closeModal() {
  emit('close');
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
        <div class="flex items-center">
          <div class="h-8 w-8 bg-primary-lightest dark:bg-primary-dark/20 rounded-lg flex items-center justify-center mr-3">
            <UserPlusIcon class="h-5 w-5 text-primary" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add New Contact</h3>
        </div>
        <button 
          @click="closeModal"
          class="btn-icon-secondary"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Form content -->
      <form @submit.prevent="formStep === 'basic' ? nextStep() : handleSubmit()" class="p-6">
        <!-- Step navigation -->
        <div class="flex mb-6">
          <div class="flex-1">
            <div class="relative">
              <div 
                class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" 
                :class="{'bg-primary dark:bg-primary': formStep === 'basic' || formStep === 'details'}"
              ></div>
              <div class="absolute -top-1 left-0 flex justify-center items-center w-6 h-6 bg-primary rounded-full shadow-sm">
                <span class="text-white text-xs font-medium">1</span>
              </div>
            </div>
            <p class="mt-2 text-xs font-medium text-center text-gray-600 dark:text-gray-400">Basic Info</p>
          </div>
          
          <div class="w-8"></div>
          
          <div class="flex-1">
            <div class="relative">
              <div 
                class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" 
                :class="{'bg-primary dark:bg-primary': formStep === 'details'}"
              ></div>
              <div 
                class="absolute -top-1 left-0 flex justify-center items-center w-6 h-6 rounded-full shadow-sm"
                :class="formStep === 'details' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'"
              >
                <span class="text-white text-xs font-medium">2</span>
              </div>
            </div>
            <p class="mt-2 text-xs font-medium text-center text-gray-600 dark:text-gray-400">Additional Details</p>
          </div>
        </div>
        
        <!-- Step 1: Basic info -->
        <div v-if="formStep === 'basic'" class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <BasicInput
              v-model="name"
              label="Name"
              placeholder="Enter name"
              required
              :error="!name && error ? 'Name is required' : ''"
            />
            
            <BasicInput
              v-model="surname"
              label="Surname"
              placeholder="Enter surname"
              required
              :error="!surname && error ? 'Surname is required' : ''"
            />
            
            <BasicInput
              v-model="nickname"
              label="Nickname (Optional)"
              placeholder="Enter nickname"
            />
            
            <BasicInput
              v-model="phone"
              label="Phone Number (Optional)"
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
        </div>
        
        <!-- Step 2: Additional details -->
        <div v-else class="space-y-5">
          <div class="grid gap-5 sm:grid-cols-2">
            <BasicInput
              v-model="email"
              label="Email (Optional)"
              placeholder="Enter email address"
              type="email"
            />
            
            <BasicInput
              v-model="company"
              label="Company (Optional)"
              placeholder="Enter company name"
            />
            
            <BasicInput
              v-model="education"
              label="Education/School (Optional)"
              placeholder="Enter education or school"
            />
            
            <BasicInput
              v-model="dateOfBirth"
              label="Date of Birth (Optional)"
              type="date"
            />
            
            <div class="sm:col-span-2">
              <BasicInput
                v-model="address"
                label="Address (Optional)"
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="error && error !== 'Name is required' && error !== 'Surname is required'" class="mt-4 error-box">
          {{ error }}
        </div>
        
        <!-- Navigation buttons -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            v-if="formStep === 'details'"
            type="button"
            @click="prevStep"
            class="btn-outline-secondary"
          >
            Back
          </button>
          
          <button
            type="submit"
            class="btn-primary"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>
              {{ formStep === 'basic' ? 'Continue' : 'Create Contact' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 