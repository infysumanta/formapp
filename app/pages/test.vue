<template>
  <div>
    <header>
      <div style="max-width: 1200px; margin: 0 auto; text-align: center">
        <h1
          style="
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            color: #ea580c !important;
          "
        >
          Test Environment
        </h1>
      </div>
    </header>
    <div
      :data-form-id="formConfig.formId"
      :data-form-api-url="`${formConfig.baseUrl}/orgs/${formConfig.orgId}/landingpageforms`"
      :data-cached-form-url="`https://assets-usa.mkt.dynamics.com/${formConfig.orgId}/digitalassets/forms/${formConfig.formId}`"
    ></div>
  </div>
</template>

<script setup>
// Configuration for form submission
const formConfig = {
  formId: "d3630a02-b871-f011-b4cc-6045bd019ae9",
  orgId: "22995153-1e26-409d-a380-d58e92c7e210",
  baseUrl: "https://public-usa.mkt.dynamics.com/api/v1.0",
  successRedirectUrl: "https://client-connect-test.powerappsportals.com/",
  contactSupportUrl: "https://www.acesaba.com/contact",
};

// Unified messages object containing all dialog messages
const messages = {
  progress: {
    title: "Processing Your Information",
    message:
      "Please wait while we verify your information. This may take a few moments.",
  },
  success: {
    title: "Success!",
    message:
      "Awesome! We provide services in your area. Login using {userEmail} to continue with application process. Redirecting to login page...",
    buttonText: "Continue to Login",
  },
  confirmation: {
    title: "Confirm Information",
    message:
      "Are you sure you want to submit this information? Please review your information before proceeding.",
    confirmText: "Yes, Submit",
    cancelText: "Cancel",
  },
  rejection: {
    title: "Submission Cancelled",
    message:
      "Your submission has been cancelled. You can make changes and try again.",
    buttonText: "OK",
  },
  errors: {
    payer_not_found: {
      title: "Insurance Provider Not Found",
      description:
        "We couldn't find your insurance provider in our system. Our support team will contact you to assist with your eligibility.",
      details: null,
    },
    eligibility_diagnosis_not_found: {
      title: "Diagnosis Not Eligible",
      description:
        "Your application is under review. Our support team will contact you to discuss your options.",
      details: null,
    },
    zip_code_not_found: {
      title: "Service Area Not Available",
      description:
        "Your application is under review. Our support team will contact you to discuss your options.",
      details: null,
    },
    network_error: {
      title: "Connection Problem",
      description:
        "There was a network error while submitting your information. Please try submitting again.",
      details: null,
    },
    unexpected_error: {
      title: "Unexpected Error",
      description:
        "An unexpected error occurred while processing your submission. Please try submitting again.",
      details: null,
    },
    unknown_error: {
      title: "Submission Error",
      description:
        "Your application is under review. Our support team will contact you to discuss your options.",
      details: null,
    },
  },
  buttons: {
    tryAgain: "Try Again",
    contactSupport: "Contact Support",
  },
};

// Fetch function with proper error handling
const formFetch = async (payload) => {
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

    return {
      success: false,
      error: "http_error",
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
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

// Utility functions for dialog management
const removeExistingDialog = () => {
  const existingDialog = document.getElementById("form-dialog");
  if (existingDialog) {
    existingDialog.remove();
  }
};

const createDialogElement = (content) => {
  const dialog = document.createElement("div");
  dialog.id = "form-dialog";
  dialog.innerHTML = `<div class="dialog-overlay"><div class="dialog-content">${content}</div></div>`;
  return dialog;
};

const createIcon = (type) => {
  const icons = {
    success:
      '<svg class="dialog-icon success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    error:
      '<svg class="dialog-icon error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>',
    spinner: '<div class="spinner"></div>',
    errorIcon: '<div class="error-icon"></div>',
  };
  return icons[type] || "";
};

const createButtons = (buttons) => {
  if (!buttons || buttons.length === 0) return "";

  const buttonElements = buttons
    .map(
      (btn) =>
        `<button ${btn.id ? `id="${btn.id}"` : ""} ${
          btn.onclick ? `onclick="${btn.onclick}"` : ""
        } class="dialog-button ${btn.className || "dialog-button-primary"}">${
          btn.text
        }</button>`,
    )
    .join("");

  return `<div class="dialog-buttons">${buttonElements}</div>`;
};

const showDialog = (config) => {
  removeExistingDialog();

  const iconHtml = config.icon
    ? `<div class="dialog-icon-container ${
        config.iconContainer || ""
      }">${createIcon(config.icon)}</div>`
    : "";
  const titleHtml = config.title
    ? `<${config.titleTag || "div"} class="${
        config.titleClass || "dialog-title"
      }">${iconHtml}${config.title}</${config.titleTag || "div"}>`
    : "";
  const messageHtml = config.message
    ? `<p class="${config.messageClass || "dialog-message"}">${
        config.message
      }</p>`
    : "";
  const detailsHtml = config.details || "";
  const buttonsHtml = createButtons(config.buttons);

  const content = `${
    config.dialogClass ? `<div class="${config.dialogClass}">` : ""
  }${titleHtml}${messageHtml}${detailsHtml}${buttonsHtml}${
    config.dialogClass ? "</div>" : ""
  }`;

  const dialog = createDialogElement(content);
  document.body.appendChild(dialog);

  return dialog;
};

// Optimized dialog functions using shared utilities
const showProgressDialog = () => {
  showDialog({
    title: messages.progress.title,
    message: messages.progress.message,
    icon: "spinner",
  });
};

const showSuccessMessage = (payload) => {
  const emailField = payload?.fields?.find(
    (field) => field.key === "emailaddress1",
  );
  const userEmail = emailField?.value || "abc@xyz.com";

  const url = new URL(formConfig.successRedirectUrl);
  url.searchParams.set("preQualEmail", userEmail);
  const redirectUrl = url.toString();

  const successMessage = messages.success.message.replace(
    "{userEmail}",
    userEmail,
  );

  showDialog({
    dialogClass: "success-dialog",
    title: messages.success.title,
    titleTag: "h1",
    titleClass: "dialog-title-large",
    message: successMessage,
    messageClass: "dialog-message-large",
    icon: "success",
    iconContainer: "success-icon-container",
    buttons: [
      {
        text: messages.success.buttonText,
        onclick: `window.location.href='${redirectUrl}'`,
        className: "dialog-button-success",
      },
    ],
  });
};

const showErrorMessage = (errorCode = "unknown_error") => {
  const errorInfo = messages.errors[errorCode] || messages.errors.unknown_error;
  const detailsHtml = errorInfo.details
    ? `<div class="error-details"><h3 class="error-details-title">What you can do:</h3><div>${errorInfo.details}</div></div>`
    : "";

  showDialog({
    dialogClass: "error-dialog",
    title: errorInfo.title,
    titleTag: "h1",
    titleClass: "dialog-title-large",
    message: errorInfo.description,
    messageClass: "dialog-message-large",
    icon: "error",
    iconContainer: "error-icon-container",
    details: detailsHtml,
    buttons: [
      {
        text: messages.buttons.tryAgain,
        onclick: "document.getElementById('form-dialog').remove()",
        className: "dialog-button-primary",
      },
      {
        text: messages.buttons.contactSupport,
        onclick: `window.location.href='${formConfig.contactSupportUrl}'`,
        className: "dialog-button-secondary",
      },
    ],
  });
};

const showRejectionMessage = () => {
  showDialog({
    title: messages.rejection.title,
    message: messages.rejection.message,
    icon: "errorIcon",
    buttons: [
      {
        text: messages.rejection.buttonText,
        onclick: "document.getElementById('form-dialog').remove()",
        className: "dialog-button-secondary",
      },
    ],
  });
};

const showConfirmationDialog = () => {
  return new Promise((resolve) => {
    showDialog({
      title: messages.confirmation.title,
      message: messages.confirmation.message,
      buttons: [
        {
          id: "confirm-yes",
          text: messages.confirmation.confirmText,
          className: "dialog-button-primary",
        },
        {
          id: "confirm-no",
          text: messages.confirmation.cancelText,
          className: "dialog-button-secondary",
        },
      ],
    });

    document
      .getElementById("confirm-yes")
      .addEventListener("click", () => resolve(true));
    document
      .getElementById("confirm-no")
      .addEventListener("click", () => resolve(false));
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
    if (result.success) {
      showSuccessMessage(payload);
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
      } else {
        errorCode = "unknown_error";
      }

      // Show error dialog instead of redirecting
      showErrorMessage(errorCode);
    }
  } catch (error) {
    console.error("Unexpected error during form submission:", error);

    // Wait for at least 3 seconds before showing error
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Show error dialog instead of redirecting
    showErrorMessage("unexpected_error");
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
  window.showErrorMessage = showErrorMessage;
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
  document.addEventListener("d365mkt-beforeformload", function () {});
  document.addEventListener("d365mkt-afterformload", function () {
    // Add custom validation to email field
    const emailField = document.querySelector('input[type="email"]');
    if (emailField) {
      emailField.setAttribute(
        "oninvalid",
        "setCustomValidity('Please enter valid email address.')",
      );
      emailField.setAttribute("oninput", "setCustomValidity('')");
    }

    // Add phone validation and pattern to tel fields
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach((phoneField) => {
      // Set a more flexible pattern that allows common US phone number formats
      phoneField.setAttribute(
        "pattern",
        "^(\\+?1[-. ]?)?\\(?[2-9][0-9]{2}\\)?[-. ]?[2-9][0-9]{2}[-. ]?[0-9]{4}$|^[2-9][0-9]{9}$"
      );
      phoneField.setAttribute(
        "title",
        "Please enter a valid US phone number (e.g., 5551234567, (555) 123-4567, 555-123-4567, or 555.123.4567)"
      );
      
      // Clear custom validity on input to allow revalidation
      phoneField.addEventListener('input', function(e) {
        // Allow only digits, spaces, hyphens, dots, parentheses, and plus sign
        const value = e.target.value.replace(/[^0-9\s\-\.\(\)\+]/g, '');
        if (e.target.value !== value) {
          e.target.value = value;
        }
        
        // Reset custom validity to allow HTML5 validation to work
        e.target.setCustomValidity('');
      });
      
      // Set custom validity message on invalid event
      phoneField.addEventListener('invalid', function(e) {
        e.target.setCustomValidity('Please enter a valid US phone number (e.g., 5551234567, (555) 123-4567, or 555-123-4567)');
      });
      
      // Validate on blur for immediate feedback
      phoneField.addEventListener('blur', function(e) {
        if (e.target.value) {
          const pattern = /^((\+?1[-. ]?)?\(?[2-9][0-9]{2}\)?[-. ]?[2-9][0-9]{2}[-. ]?[0-9]{4})|([2-9][0-9]{9})$/;
          if (!pattern.test(e.target.value)) {
            e.target.setCustomValidity('Please enter a valid US phone number (e.g., 5551234567, (555) 123-4567, or 555-123-4567)');
            e.target.reportValidity();
          } else {
            e.target.setCustomValidity('');
          }
        }
      });
      
      // Prevent non-numeric keys from being pressed (except formatting characters)
      phoneField.addEventListener('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        // Allow numbers, space, dash, dot, parentheses, plus, backspace, delete, arrow keys
        if (!/[0-9\s\-\.\(\)\+]/.test(char) && !e.ctrlKey && !e.metaKey && e.keyCode !== 8 && e.keyCode !== 46) {
          e.preventDefault();
        }
      });
    });
  });
  document.addEventListener("d365mkt-formrender", function () {});
  document.addEventListener("d365mkt-formsubmit", function (event) {
    event.preventDefault();
    window.submitFormHandler(event.detail.payload);
  });
  document.addEventListener("d365mkt-afterformsubmit", function () {});
}
</script>
