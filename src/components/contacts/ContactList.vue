<script setup lang="ts">
import { ref, onMounted, defineExpose, computed } from 'vue';
import { getContacts, deleteContact, Contact } from '../../services/ContactService';
import { 
  PencilIcon, TrashIcon, 
  PhoneIcon, EnvelopeIcon, 
  BuildingOfficeIcon, AcademicCapIcon,
  MagnifyingGlassIcon, UsersIcon,
  PlusIcon, ViewColumnsIcon, ListBulletIcon, ArrowPathIcon, XMarkIcon
} from '@heroicons/vue/24/outline';
import CreateContact from './CreateContact.vue';
import EditContactModal from './EditContactModal.vue';

const showCreateContact = ref(false);
const showEditModal = ref(false);
const selectedContact = ref(null);
const contacts = ref<Contact[]>([]);
const filteredContacts = ref<Contact[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const viewMode = ref<'grid' | 'list'>('grid');

// Get auth token from localStorage
const token = localStorage.getItem('token');

onMounted(async () => {
  if (!token) {
    error.value = 'Authentication required';
    isLoading.value = false;
    return;
  }
  
  try {
    contacts.value = await getContacts(token);
    filteredContacts.value = [...contacts.value];
    isLoading.value = false;
  } catch (err) {
    console.error(err);
    error.value = err instanceof Error ? err.message : 'Failed to load contacts';
    isLoading.value = false;
  }
});

// Filter contacts based on search query
function filterContacts() {
  if (!searchQuery.value.trim()) {
    filteredContacts.value = [...contacts.value];
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredContacts.value = contacts.value.filter(contact => {
    return (
      (contact.name?.toLowerCase().includes(query) || '') ||
      (contact.surname?.toLowerCase().includes(query) || '') ||
      (contact.nickname?.toLowerCase().includes(query) || '') ||
      (contact.email?.toLowerCase().includes(query) || '') ||
      (contact.company?.toLowerCase().includes(query) || '') ||
      (contact.phone && contact.phone.includes(query))
    );
  });
}

// Watch for changes in search query
function handleSearch() {
  filterContacts();
}

async function handleDelete(id: string) {
  if (!token) return;
  if (!confirm('Are you sure you want to delete this contact?')) return;
  
  try {
    await deleteContact(id, token);
    contacts.value = contacts.value.filter(c => c._id !== id);
    filterContacts(); // Update filtered list
    // Emit delete event to parent component
    emit('delete', id);
  } catch (err) {
    console.error(err);
    alert('Failed to delete contact');
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
}

// Toggle between grid and list view
function toggleViewMode() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
}

// Computed property for contact count message
const contactCountMessage = computed(() => {
  const count = filteredContacts.value.length;
  
  if (searchQuery.value) {
    return `Found ${count} contact${count !== 1 ? 's' : ''} matching "${searchQuery.value}"`;
  }
  
  return `${count} contact${count !== 1 ? 's' : ''} total`;
});

const emit = defineEmits(['edit', 'delete']);

function editContact(contact) {
  selectedContact.value = contact;
  showEditModal.value = true;
}

function handleContactCreated(newContact) {
  // Add the new contact to both arrays
  contacts.value.push(newContact);
  filterContacts(); // Mettre à jour la liste filtrée
  showCreateContact.value = false;
  
  // Notification ou feedback (optionnel)
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-success text-white px-4 py-2 rounded-xl shadow-lg z-50';
  notification.textContent = 'Contact créé avec succès!';
  document.body.appendChild(notification);
  
  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function handleContactUpdated(updatedContact) {
  const index = contacts.value.findIndex(c => c._id === updatedContact._id);
  if (index !== -1) {
    contacts.value[index] = updatedContact;
  }
  showEditModal.value = false;
}

function clearSearch() {
  searchQuery.value = '';
}

defineExpose({
  contacts
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header with title and action buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Contacts</h1>
      
      <button 
        @click="showCreateContact = true"
        class="btn-primary flex items-center justify-center gap-2 self-start"
      >
        <PlusIcon class="h-5 w-5" />
        <span>Add Contact</span>
      </button>
    </div>
    
    <!-- Search and view controls -->
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search input -->
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search contacts..."
          class="pl-10 pr-10 py-3 input rounded-xl shadow-sm"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
      
      <!-- View toggle -->
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm flex self-start">
        <button 
          @click="viewMode = 'grid'"
          class="p-2 flex items-center gap-1 rounded-lg transition-colors"
          :class="viewMode === 'grid' 
            ? 'bg-primary-lightest dark:bg-primary-dark/20 text-primary dark:text-primary-lighter' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <ViewColumnsIcon class="h-5 w-5" />
          <span class="hidden sm:inline text-sm font-medium">Grid</span>
        </button>
        <button 
          @click="viewMode = 'list'"
          class="p-2 flex items-center gap-1 rounded-lg transition-colors"
          :class="viewMode === 'list' 
            ? 'bg-primary-lightest dark:bg-primary-dark/20 text-primary dark:text-primary-lighter' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <ListBulletIcon class="h-5 w-5" />
          <span class="hidden sm:inline text-sm font-medium">List</span>
        </button>
      </div>
    </div>
    
    <!-- Status messages -->
    <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
      <ArrowPathIcon class="h-10 w-10 animate-spin mb-4" />
      <p>Loading contacts...</p>
    </div>
    
    <div v-else-if="error" class="error-box">
      <p>{{ error }}</p>
      <button @click="loadContacts" class="btn-primary mt-4">
        Try Again
      </button>
    </div>
    
    <div v-else>
      <!-- Contact count -->
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {{ contactCountMessage }}
      </p>
  
      <!-- Grid view -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="contact in filteredContacts" :key="contact._id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
          <!-- Contact card -->
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <!-- Header with avatar -->
            <div class="p-5">
              <div class="flex items-start justify-between mb-4">
                <!-- Avatar -->
                <div class="flex-shrink-0 h-14 w-14 rounded-xl bg-primary-lightest dark:bg-primary-dark/30 flex items-center justify-center text-primary-dark dark:text-primary-lighter text-xl font-bold">
                  {{ (contact.name?.[0] || '') + (contact.surname?.[0] || '') }}
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editContact(contact)"
                    class="btn-icon-primary"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(contact._id)"
                    class="btn-icon-danger"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Name and nickname -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ contact.name }} {{ contact.surname }}
                </h3>
                <p v-if="contact.nickname" class="text-sm text-gray-500 dark:text-gray-400">
                  "{{ contact.nickname }}"
                </p>
              </div>
            </div>
            
            <!-- Contact details -->
            <div class="p-5 space-y-3">
              <div v-if="contact.company" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">{{ contact.company }}</span>
              </div>
              
              <div v-if="contact.phone" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">{{ contact.phone }}</span>
              </div>
              
              <div v-if="contact.email" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300 break-all">{{ contact.email }}</span>
              </div>
              
              <div v-if="contact.education" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">{{ contact.education }}</span>
              </div>
              
              <div v-if="contact.dateOfBirth" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">
                  {{ new Date(contact.dateOfBirth).toLocaleDateString() }}
                </span>
              </div>
              
              <div v-if="contact.address" class="flex items-start">
                <div class="w-6 flex-shrink-0 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">{{ contact.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List view -->
      <div v-else class="space-y-3">
        <div v-for="contact in filteredContacts" :key="contact._id" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 group">
          <div class="flex items-start">
            <!-- Avatar -->
            <div class="flex-shrink-0 h-12 w-12 rounded-xl bg-primary-lightest dark:bg-primary-dark/30 flex items-center justify-center text-primary-dark dark:text-primary-lighter text-xl font-bold">
              {{ (contact.name?.[0] || '') + (contact.surname?.[0] || '') }}
            </div>
            
            <!-- Contact details -->
            <div class="ml-4 flex-grow min-w-0">
              <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                  {{ contact.name }} {{ contact.surname }}
                  <span v-if="contact.nickname" class="text-sm text-gray-500 dark:text-gray-400 ml-1">
                    "{{ contact.nickname }}"
                  </span>
                </h3>
              </div>
              
              <!-- Primary details -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div v-if="contact.phone" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {{ contact.phone }}
                </div>
                
                <div v-if="contact.email" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  {{ contact.email }}
                </div>
                
                <div v-if="contact.company" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                  {{ contact.company }}
                </div>
                
                <div v-if="contact.education" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  {{ contact.education }}
                </div>
                
                <div v-if="contact.dateOfBirth" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {{ new Date(contact.dateOfBirth).toLocaleDateString() }}
                </div>
                
                <div v-if="contact.address" class="flex items-center text-sm text-gray-500 dark:text-gray-400 sm:col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {{ contact.address }}
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="editContact(contact)"
                class="btn-icon-primary"
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button
                @click="handleDelete(contact._id)"
                class="btn-icon-danger"
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Create Contact Modal -->
  <CreateContact 
    v-if="showCreateContact" 
    @created="handleContactCreated" 
    @close="showCreateContact = false" 
  />
  
  <!-- Edit Contact Modal -->
  <EditContactModal 
    v-if="showEditModal && selectedContact" 
    :contact="selectedContact" 
    @updated="handleContactUpdated" 
    @close="showEditModal = false" 
  />
</template> 