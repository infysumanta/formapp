<template>
  <div
    data-form-id="76438228-4767-f011-bec2-00224809e97b"
    data-form-api-url="https://public-usa.mkt.dynamics.com/api/v1.0/orgs/14e74438-32ad-42c2-91eb-3b40da498c56/landingpageforms"
    data-cached-form-url="https://assets-usa.mkt.dynamics.com/14e74438-32ad-42c2-91eb-3b40da498c56/digitalassets/forms/76438228-4767-f011-bec2-00224809e97b"
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
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 90%;">
        <div style="font-size: 18px; margin-bottom: 20px; color: #333;">
          <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #f3f3f3; border-top: 2px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
          In Progress...
        </div>
        <p style="color: #666; margin: 0;">Please wait while we process your submission.</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
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
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 90%;">
        <div style="font-size: 18px; margin-bottom: 20px; color: #22c55e;">
          ✓ Your submission was accepted.
        </div>
        <button onclick="document.getElementById('form-dialog').remove()" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">
          OK
        </button>
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
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
      <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 90%;">
        <div style="font-size: 18px; margin-bottom: 20px; color: #ef4444;">
          Your submission was rejected.
        </div>
        <button onclick="document.getElementById('form-dialog').remove()" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">
          OK
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
};

// Show confirmation dialog
const showConfirmationDialog = (payload) => {
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
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;">
        <div style="background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 90%;">
          <div style="font-size: 18px; margin-bottom: 20px; color: #333;">
            Are you sure you want to submit this form?
          </div>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="confirm-yes" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">
              Yes
            </button>
            <button id="confirm-no" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px;">
              No
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
  const confirmed = await showConfirmationDialog(payload);
  
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
