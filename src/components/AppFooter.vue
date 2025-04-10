<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm mt-12">
    <p>© {{ currentYear }} Contact Manager. All rights reserved.</p>
    <p class="mt-1">
      Built by Eden
    </p>
  </footer>
</template>