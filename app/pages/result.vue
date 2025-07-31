<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <!-- Success State -->
      <div v-if="status === 'success'" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
        <p class="text-gray-600 mb-6">
          Your form has been submitted successfully. We'll be in touch with you soon.
        </p>
        <button 
          @click="goHome"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Submit Another Form
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Submission Failed</h1>
        <p class="text-gray-600 mb-2">
          We encountered an error while processing your form submission.
        </p>
        <p v-if="errorMessage" class="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6">
          {{ errorMessage }}
        </p>
        <div class="space-y-3">
          <button 
            @click="goHome"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Try Again
          </button>
          <button 
            @click="contactSupport"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Contact Support
          </button>
        </div>
      </div>

      <!-- Invalid State -->
      <div v-else class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
        <p class="text-gray-600 mb-6">
          This page was accessed without proper form submission data.
        </p>
        <button 
          @click="goHome"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Go to Form
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

// Get status and message from query parameters
const status = computed(() => route.query.status);
const errorMessage = computed(() => route.query.message);

const goHome = () => {
  navigateTo('/');
};

const contactSupport = () => {
  // You can customize this with your actual support contact method
  window.location.href = 'mailto:support@example.com?subject=Form Submission Issue';
};

// Set page title based on status
useHead(() => ({
  title: status.value === 'success' 
    ? 'Form Submitted Successfully' 
    : status.value === 'error' 
    ? 'Form Submission Error' 
    : 'Form Result'
}));
</script>