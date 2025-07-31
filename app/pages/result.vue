<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
      <!-- Success State -->
      <div v-if="status === 'success'" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Success!</h1>
        <p class="text-gray-600 mb-6">
          Your form has been submitted successfully. We'll be in touch with you soon.
        </p>
        <button 
          @click="$router.push('/')" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Another Form
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ errorTitle }}</h1>
        <p class="text-gray-600 mb-4">
          {{ errorDescription }}
        </p>
        <div 
          v-if="errorDetails"
          class="text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-md mb-6 text-left"
        >
          <h3 class="font-medium mb-2">What you can do:</h3>
          <div v-html="errorDetails"></div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            @click="$router.push('/')" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
          <button 
            @click="contactSupport" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </button>
        </div>
      </div>

      <!-- Default/Unknown State -->
      <div v-else class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Unknown Status</h1>
        <p class="text-gray-600 mb-6">
          We're not sure what happened with your submission. Please try again or contact support.
        </p>
        <button 
          @click="$router.push('/')" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back to Form
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

// Get status and error code from query parameters
const status = computed(() => route.query.status);
const errorCode = computed(() => route.query.code || 'unknown_error');

// Define error messages based on error codes
const errorMessages = {
  payer_not_found: {
    title: 'Insurance Provider Not Found',
    description: 'We couldn\'t find your insurance provider in our system. Our support team will contact you to assist with your eligibility.',
    details: null
  },
  eligibility_diagnosis_not_found: {
    title: 'Diagnosis Not Eligible',
    description: 'The diagnosis provided may not be eligible for our services. Our support team will contact you to discuss your options.',
    details: null
  },
  zip_code_not_found: {
    title: 'Service Area Not Available',
    description: 'We may not currently serve your area. Our support team will contact you to check availability in your location.',
    details: null
  },
  network_error: {
    title: 'Connection Problem',
    description: 'There was a network error while submitting your form. Please try submitting again.',
    details: null
  },
  unexpected_error: {
    title: 'Unexpected Error',
    description: 'An unexpected error occurred while processing your submission. Please try submitting again.',
    details: null
  },
  unknown_error: {
    title: 'Submission Error',
    description: 'There was an error processing your submission. Please try submitting again.',
    details: null
  }
};

// Computed properties for error display
const errorTitle = computed(() => {
  return errorMessages[errorCode.value]?.title || errorMessages.unknown_error.title;
});

const errorDescription = computed(() => {
  return errorMessages[errorCode.value]?.description || errorMessages.unknown_error.description;
});

const errorDetails = computed(() => {
  return errorMessages[errorCode.value]?.details || errorMessages.unknown_error.details;
});

// Contact support function
const contactSupport = () => {
  // You can customize this based on your support contact method
  window.location.href = 'mailto:support@example.com?subject=Form Submission Error&body=Error Code: ' + errorCode.value;
};
</script>
