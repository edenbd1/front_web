<script setup lang="ts">
import { ref, watch } from 'vue';
import { updateContact, Contact } from '../../services/ContactService';
import BasicInput from '../BasicInput.vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  contact: Contact;
}>();

const emit = defineEmits(['updated', 'close']);

const name = ref(props.contact.name);
const surname = ref(props.contact.surname);
const nickname = ref(props.contact.nickname);
const phone = ref(props.contact.phone || '');
const email = ref(props.contact.email || '');
const company = ref(props.contact.company || '');
const education = ref(props.contact.education || '');
const dateOfBirth = ref(props.contact.dateOfBirth ? new Date(props.contact.dateOfBirth).toISOString().split('T')[0] : '');
const address = ref(props.contact.address);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Update form when contact prop changes
watch(() => props.contact, (newContact) => {
  name.value = newContact.name;
  surname.value = newContact.surname;
  nickname.value = newContact.nickname;
  phone.value = newContact.phone || '';
  email.value = newContact.email || '';
  company.value = newContact.company || '';
  education.value = newContact.education || '';
  dateOfBirth.value = newContact.dateOfBirth ? new Date(newContact.dateOfBirth).toISOString().split('T')[0] : '';
  address.value = newContact.address;
}, { deep: true });

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
    const updatedData = {
      name: name.value,
      surname: surname.value,
      nickname: nickname.value,
      phone: phone.value,
      email: email.value,
      company: company.value,
      education: education.value,
      dateOfBirth: dateOfBirth.value ? new Date(dateOfBirth.value).toISOString() : null,
      address: address.value
    };

    const updatedContact = await updateContact(props.contact._id, updatedData, token);
    emit('updated', updatedContact);
    emit('close');
  } catch (err) {
    console.error(err);
    error.value = err instanceof Error ? err.message : 'Failed to update contact';
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  emit('close');
}
</script>

<template>
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Modal content -->
    <div 
      class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Edit Contact</h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full p-1"
          aria-label="Close"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Form content -->
      <div class="p-4 flex-1 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              label="Nickname"
              placeholder="Enter nickname"
            />
            
            <BasicInput
              v-model="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              type="tel"
            />
            
            <BasicInput
              v-model="email"
              label="Email"
              placeholder="Enter email address"
              type="email"
            />
            
            <BasicInput
              v-model="company"
              label="Company"
              placeholder="Enter company name"
            />
            
            <BasicInput
              v-model="education"
              label="Education/School"
              placeholder="Enter education or school"
            />
            
            <BasicInput
              v-model="dateOfBirth"
              label="Date of Birth"
              type="date"
            />
            
            <div class="sm:col-span-2">
              <BasicInput
                v-model="address"
                label="Address"
                placeholder="Enter address"
              />
            </div>
          </div>
          
          <!-- Error message -->
          <div v-if="error && error !== 'Name is required' && error !== 'Surname is required'" class="text-sm text-danger-500 dark:text-danger-400">
            {{ error }}
          </div>
        </form>
      </div>
      
      <!-- Footer actions -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          type="button"
          @click="closeModal"
          class="btn-outline-secondary"
        >
          Cancel
        </button>
        
        <button
          type="button"
          @click="handleSubmit"
          class="btn-primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template> 