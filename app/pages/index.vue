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
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
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
        data: errorData 
      };
    }
    
    if (response.status >= 500 && retryCount < formConfig.maxRetries) {
      console.warn(`Server error (${response.status}), retrying... (${retryCount + 1}/${formConfig.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, formConfig.retryDelay * (retryCount + 1)));
      return formFetch(payload, retryCount + 1);
    }
    
    return { 
      success: false, 
      error: "http_error", 
      status: response.status, 
      statusText: response.statusText 
    };
    
  } catch (error) {
    if (retryCount < formConfig.maxRetries && (
      error.name === "NetworkError" || 
      error.name === "TypeError" || 
      error.message.includes("fetch")
    )) {
      console.warn(`Network error, retrying... (${retryCount + 1}/${formConfig.maxRetries})`, error.message);
      await new Promise(resolve => setTimeout(resolve, formConfig.retryDelay * (retryCount + 1)));
      return formFetch(payload, retryCount + 1);
    }
    
    return { 
      success: false, 
      error: "network_error", 
      message: error.message 
    };
  }
};

// Make formFetch available globally for the event handlers
if (typeof window !== "undefined") {
  window.formFetch = formFetch;
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

    const payload = event.detail.payload;

    // Extract form fields
    const aces_startherecaregiverrelationship =
      event.detail.payload.fields.find(
        (item) => item.key === "aces_startherecaregiverrelationship",
      );

    const aces_payor = event.detail.payload.fields.find(
      (item) => item.key === "aces_payor",
    );

    // Process payor field
    if (aces_payor) {
      const acesPayorValue = `account,${aces_payor.value}`;
      console.log("acesPayorValue", acesPayorValue);
      const payorListItem = document.querySelector(
        `li.ui-menu-item[data-value='${CSS.escape(acesPayorValue)}']`,
      );
      const payorRelationship = payorListItem?.querySelector(
        ".ui-menu-item-wrapper",
      )?.textContent;

      payload.fields.find((item) => item.key === "aces_payorlookuptext").value =
        payorRelationship;
    }

    // Process caregiver relationship field
    if (aces_startherecaregiverrelationship) {
      const acesCaregiverValue = `msemr_codeableconcept,${aces_startherecaregiverrelationship.value}`;
      console.log("acesCaregiverValue", acesCaregiverValue);
      const caregiverListItem = document.querySelector(
        `li.ui-menu-item[data-value='${CSS.escape(acesCaregiverValue)}']`,
      );
      const caregiverRelationship = caregiverListItem?.querySelector(
        ".ui-menu-item-wrapper",
      )?.textContent;

      payload.fields.find(
        (item) => item.key === "aces_relationshiplookuptext",
      ).value = caregiverRelationship;
    }

    const acesIseligiblediagnosis = payload.fields.find(
      (item) => item.key === "aces_iseligiblediagnosis",
    );

    const acesPayorfound = payload.fields.find(
      (item) => item.key === "aces_payorfound",
    );

    // Use the enhanced fetch function
    window.formFetch(payload)
      .then((result) => {
        if (result.success) {
          console.log("Form submitted successfully", result.data);
          window.location.href = "/result?status=success";
        } else {
          console.error("Form submission failed:", result);
          
          let errorCode = "";
          
          // Handle validation errors (400 status)
          if (result.error === "validation_error" || result.status === 400) {
            if (acesPayorfound && acesPayorfound.value === "0") {
              errorCode = "payer_not_found";
            } else if (acesIseligiblediagnosis && acesIseligiblediagnosis.value === "0") {
              errorCode = "eligibility_diagnosis_not_found";
            } else {
              errorCode = "zip_code_not_found";
            }
            console.log("400 Bad Request - Invalid form data submitted");
          } else if (result.error === "network_error") {
            errorCode = "network_error";
            console.log("Network error occurred during form submission");
          } else if (result.error === "http_error") {
            errorCode = "server_error";
            console.log(`HTTP error ${result.status}: ${result.statusText}`);
          } else {
            errorCode = "unknown_error";
            console.log("An unknown error occurred during form submission");
          }
          
          window.location.href = `/result?status=error&code=${errorCode}`;
        }
      })
      .catch((error) => {
        console.error("Unexpected error during form submission:", error);
        window.location.href = `/result?status=error&code=unexpected_error`;
      });

    // document.forms[0].submit({});
  });
  document.addEventListener("d365mkt-afterformsubmit", function (event) {
    event.preventDefault();
    console.log({ event });
    console.log("d365mkt-afterformsubmit", JSON.stringify(event.detail));

    console.log("success - " + event.detail.successful);
    console.log("payload - " + JSON.stringify(event.detail.payload));
  });
}
</script>
