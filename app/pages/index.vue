<template>
  <div
    :data-form-id="formConfig.formId"
    :data-form-api-url="`${formConfig.baseUrl}/orgs/${formConfig.orgId}/landingpageforms`"
    :data-cached-form-url="`https://assets-usa.mkt.dynamics.com/${formConfig.orgId}/digitalassets/forms/${formConfig.formId}`"
  ></div>
</template>

<script setup>
// Configuration for form submission
const formConfig = {
  formId: "76438228-4767-f011-bec2-00224809e97b",
  orgId: "14e74438-32ad-42c2-91eb-3b40da498c56",
  baseUrl: "https://public-usa.mkt.dynamics.com/api/v1.0",
  maxRetries: 3,
  retryDelay: 1000,
};

// Enhanced fetch function with proper error handling and retry logic
const formFetch = async (payload, retryCount = 0) => {
  const url = `${formConfig.baseUrl}/orgs/${formConfig.orgId}/landingpageforms/forms/${formConfig.formId}`;

  const requestOptions = {
    headers: {
      accept: "application/json",
      "cache-control": "no-cache",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.ok) {
      return { success: true, data: await response.json().catch(() => ({})) };
    }

    // Handle specific HTTP status codes
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: "validation_error",
        status: 400,
        data: errorData,
      };
    }

    if (response.status >= 500 && retryCount < formConfig.maxRetries) {
      console.warn(
        `Server error (${response.status}), retrying... (${retryCount + 1}/${
          formConfig.maxRetries
        })`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, formConfig.retryDelay * (retryCount + 1)),
      );
      return formFetch(payload, retryCount + 1);
    }

    return {
      success: false,
      error: "http_error",
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    if (
      retryCount < formConfig.maxRetries &&
      (error.name === "NetworkError" ||
        error.name === "TypeError" ||
        error.message.includes("fetch"))
    ) {
      console.warn(
        `Network error, retrying... (${retryCount + 1}/${
          formConfig.maxRetries
        })`,
        error.message,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, formConfig.retryDelay * (retryCount + 1)),
      );
      return formFetch(payload, retryCount + 1);
    }

    return {
      success: false,
      error: "network_error",
      message: error.message,
    };
  }
};

// Process payor field and update lookup text
const processPayorField = (payload) => {
  const aces_payor = payload.fields.find((item) => item.key === "aces_payor");

  if (aces_payor) {
    const acesPayorValue = `account,${aces_payor.value}`;
    console.log("acesPayorValue", acesPayorValue);
    const payorListItem = document.querySelector(
      `li.ui-menu-item[data-value='${CSS.escape(acesPayorValue)}']`,
    );
    const payorRelationship = payorListItem?.querySelector(
      ".ui-menu-item-wrapper",
    )?.textContent;

    const payorLookupField = payload.fields.find(
      (item) => item.key === "aces_payorlookuptext",
    );
    if (payorLookupField) {
      payorLookupField.value = payorRelationship;
    }
  }
};

// Process caregiver relationship field and update lookup text
const processCaregiverField = (payload) => {
  const aces_startherecaregiverrelationship = payload.fields.find(
    (item) => item.key === "aces_startherecaregiverrelationship",
  );

  if (aces_startherecaregiverrelationship) {
    const acesCaregiverValue = `msemr_codeableconcept,${aces_startherecaregiverrelationship.value}`;
    console.log("acesCaregiverValue", acesCaregiverValue);
    const caregiverListItem = document.querySelector(
      `li.ui-menu-item[data-value='${CSS.escape(acesCaregiverValue)}']`,
    );
    const caregiverRelationship = caregiverListItem?.querySelector(
      ".ui-menu-item-wrapper",
    )?.textContent;

    const relationshipLookupField = payload.fields.find(
      (item) => item.key === "aces_relationshiplookuptext",
    );
    if (relationshipLookupField) {
      relationshipLookupField.value = caregiverRelationship;
    }
  }
};

// Show progress dialog
const showProgressDialog = () => {
  // Remove any existing dialog
  const existingDialog = document.getElementById('form-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  // Create progress dialog
  const dialog = document.createElement('div');
  dialog.id = 'form-dialog';
  dialog.innerHTML = `
    <div class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-title">
          <div class="spinner"></div>
          Processing Your Submission
        </div>
        <p class="dialog-message">Please wait while we submit your information. This may take a few moments.</p>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
};

// Show success message
const showSuccessMessage = () => {
  // Remove existing dialog
  const existingDialog = document.getElementById('form-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  // Create success dialog
  const dialog = document.createElement('div');
  dialog.id = 'form-dialog';
  dialog.innerHTML = `
    <div class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-title">
          <div class="success-icon"></div>
          Submission Successful!
        </div>
        <p class="dialog-message">Thank you! Your form has been submitted successfully. We'll be in touch soon.</p>
        <div class="dialog-buttons">
          <button onclick="document.getElementById('form-dialog').remove()" class="dialog-button dialog-button-primary">
            OK
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
};

// Show rejection message
const showRejectionMessage = () => {
  // Remove existing dialog
  const existingDialog = document.getElementById('form-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  // Create rejection dialog
  const dialog = document.createElement('div');
  dialog.id = 'form-dialog';
  dialog.innerHTML = `
    <div class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-title">
          <div class="error-icon"></div>
          Submission Cancelled
        </div>
        <p class="dialog-message">Your form submission has been cancelled. You can make changes and try again.</p>
        <div class="dialog-buttons">
          <button onclick="document.getElementById('form-dialog').remove()" class="dialog-button dialog-button-secondary">
            OK
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
};

// Show confirmation dialog
const showConfirmationDialog = () => {
  return new Promise((resolve) => {
    // Remove any existing dialog
    const existingDialog = document.getElementById('form-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // Create confirmation dialog
    const dialog = document.createElement('div');
    dialog.id = 'form-dialog';
    dialog.innerHTML = `
      <div class="dialog-overlay">
        <div class="dialog-content">
          <div class="dialog-title">
            Confirm Submission
          </div>
          <p class="dialog-message">Are you sure you want to submit this form? Please review your information before proceeding.</p>
          <div class="dialog-buttons">
            <button id="confirm-yes" class="dialog-button dialog-button-primary">
              Yes, Submit
            </button>
            <button id="confirm-no" class="dialog-button dialog-button-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    // Add event listeners
    document.getElementById('confirm-yes').addEventListener('click', () => {
      resolve(true);
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
      resolve(false);
    });
  });
};

// Handle form submission with complete processing logic
const submitFormHandler = async (payload) => {
  // Show confirmation dialog
  const confirmed = await showConfirmationDialog();
  
  if (!confirmed) {
    showRejectionMessage();
    return;
  }

  // Show progress dialog
  showProgressDialog();

  // Process form fields using extracted functions
  window.processPayorField(payload);
  window.processCaregiverField(payload);

  const acesIseligiblediagnosis = payload.fields.find(
    (item) => item.key === "aces_iseligiblediagnosis",
  );

  const acesPayorfound = payload.fields.find(
    (item) => item.key === "aces_payorfound",
  );

  // Use the enhanced fetch function
  try {
    const result = await window.formFetch(payload);
    
    // Wait for at least 3 seconds before showing result
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (result.success) {
      console.log("Form submitted successfully", result.data);
      showSuccessMessage();
      
      // Redirect after showing success message for 2 seconds
      setTimeout(() => {
        window.location.href = "/result?status=success";
      }, 2000);
    } else {
      let errorCode = "";
      if (result.status === 400) {
        if (acesPayorfound && acesPayorfound.value === "0") {
          errorCode = "payer_not_found";
        } else if (
          acesIseligiblediagnosis &&
          acesIseligiblediagnosis.value === "0"
        ) {
          errorCode = "eligibility_diagnosis_not_found";
        } else {
          errorCode = "zip_code_not_found";
        }
        console.log("400 Bad Request - Invalid form data submitted");
      } else {
        errorCode = "unknown_error";
        console.log("An unknown error occurred during form submission");
      }

      // Remove progress dialog and redirect to error page
      const dialog = document.getElementById('form-dialog');
      if (dialog) {
        dialog.remove();
      }
      window.location.href = `/result?status=error&code=${errorCode}`;
    }
  } catch (error) {
    console.error("Unexpected error during form submission:", error);
    
    // Wait for at least 3 seconds before showing error
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Remove progress dialog and redirect to error page
    const dialog = document.getElementById('form-dialog');
    if (dialog) {
      dialog.remove();
    }
    window.location.href = `/result?status=error&code=unexpected_error`;
  }
};

// Make functions available globally for the event handlers
if (typeof window !== "undefined") {
  window.formFetch = formFetch;
  window.processPayorField = processPayorField;
  window.processCaregiverField = processCaregiverField;
  window.submitFormHandler = submitFormHandler;
  window.showConfirmationDialog = showConfirmationDialog;
  window.showProgressDialog = showProgressDialog;
  window.showSuccessMessage = showSuccessMessage;
  window.showRejectionMessage = showRejectionMessage;
}

useHead({
  script: [
    {
      src: "https://cxppusa1formui01cdnsa01-endpoint.azureedge.net/usa/FormLoader/FormLoader.bundle.js",
      defer: true,
    },
  ],
});
</script>

<script>
if (typeof document !== "undefined") {
  document.addEventListener("d365mkt-beforeformload", function () {
    console.log("d365mkt-beforeformload");
  });
  document.addEventListener("d365mkt-afterformload", function () {
    console.log("d365mkt-afterformload");
  });
  document.addEventListener("d365mkt-formrender", function () {
    console.log("d365mkt-formrender");
  });
  document.addEventListener("d365mkt-formsubmit", function (event) {
    event.preventDefault();
    window.submitFormHandler(event.detail.payload);
  });
  document.addEventListener("d365mkt-afterformsubmit", function () {});
}
</script>
