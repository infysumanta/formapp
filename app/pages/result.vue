<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <!-- Success State -->
      <div v-if="status === 'success'" class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
        <p class="text-gray-600 mb-6">
          Your form has been submitted successfully. We'll be in touch with you
          soon.
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Submission Failed</h1>
        <p class="text-gray-600 mb-2">
          There was an error processing your submission.
        </p>
        <p
          v-if="errorMessage"
          class="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

// Get status and message from query parameters
const status = computed(() => route.query.status);
const errorMessage = computed(() => route.query.message);
</script>
