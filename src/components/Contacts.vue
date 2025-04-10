<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ContactList from '../components/contacts/ContactList.vue';
import CreateContact from '../components/contacts/CreateContact.vue';
import EditContactModal from '../components/contacts/EditContactModal.vue';
import { Contact } from '../services/ContactService';
import { UserGroupIcon } from '@heroicons/vue/24/outline';

const contactListRef = ref<{ contacts: Contact[] } | null>(null);
const selectedContact = ref<Contact | null>(null);
const isModalOpen = ref(false);

function addContact(newContact: Contact) {
  if (contactListRef.value) contactListRef.value.contacts.unshift(newContact);
}

function removeContact(contactId: string) {
  if (contactListRef.value) {
    contactListRef.value.contacts = contactListRef.value.contacts.filter((c: Contact) => c._id !== contactId);
  }
}

function updateContact(updatedContact: Contact) {
  if (contactListRef.value) {
    const index = contactListRef.value.contacts.findIndex((c: Contact) => c._id === updatedContact._id);
    if (index !== -1) {
      contactListRef.value.contacts[index] = { ...contactListRef.value.contacts[index], ...updatedContact };
    }
  }
}

function openEditModal(contact: Contact) {
  selectedContact.value = { ...contact };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedContact.value = null;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header section -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
        <UserGroupIcon class="w-6 h-6 mr-2 text-primary" />
        My Contacts
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Manage your personal and professional contacts
      </p>
    </div>
    
    <!-- Contact list with card style design -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h2 class="font-medium text-gray-800 dark:text-gray-200">All Contacts</h2>
      </div>
      
      <div class="p-4">
        <ContactList 
          ref="contactListRef" 
          @edit="openEditModal" 
          @delete="removeContact" 
          @add="addContact"
        />
      </div>
    </div>
  </div>

  <!-- Edit modal -->
  <EditContactModal
    v-if="isModalOpen && selectedContact"
    :contact="selectedContact"
    @updated="updateContact"
    @close="closeModal"
  />
</template> 