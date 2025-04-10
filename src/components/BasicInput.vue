<script setup lang="ts">
import { ref, computed } from 'vue';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
    type: String,
    default: undefined
  },
  showToggle: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  }
});

const emit = defineEmits(['update:modelValue']);

const isPasswordVisible = ref(false);
const isFocused = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit('update:modelValue', target.value);
  }
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const inputType = computed(() => {
  if (props.type === 'password' && isPasswordVisible.value) {
    return 'text';
  }
  return props.type;
});

const inputClasses = computed(() => {
  return [
    'block w-full px-3 py-2.5 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg',
    'border border-gray-300 dark:border-gray-600',
    'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200',
    'dark:placeholder-gray-500 placeholder-gray-400',
    {
      'pr-10': (props.showToggle && props.type === 'password') || props.error,
      'border-danger focus:border-danger focus:ring-danger/50': props.error,
      'bg-gray-50 dark:bg-gray-900/50': props.type === 'date',
    }
  ];
});
</script>

<template>
  <div class="mb-1">
    <label :for="id" class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
      <span v-if="required" class="ml-1 text-danger">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :class="inputClasses"
        :placeholder="placeholder || `Enter ${label.toLowerCase()}`"
        :autocomplete="autocomplete"
        :required="required"
      />
      
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <!-- Password toggle button -->
      <button
        v-if="showToggle && type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
        :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
      >
          <EyeIcon v-if="isPasswordVisible" class="h-5 w-5" aria-hidden="true" />
          <EyeSlashIcon v-else class="h-5 w-5" aria-hidden="true" />
      </button>
        
        <!-- Error icon -->
        <ExclamationCircleIcon 
          v-if="error && !(showToggle && type === 'password')" 
          class="h-5 w-5 text-danger-500" 
          aria-hidden="true" 
        />
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-danger-500">{{ error }}</p>
  </div>
</template>