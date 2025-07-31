<template>
  <div
    data-form-id="76438228-4767-f011-bec2-00224809e97b"
    data-form-api-url="https://public-usa.mkt.dynamics.com/api/v1.0/orgs/14e74438-32ad-42c2-91eb-3b40da498c56/landingpageforms"
    data-cached-form-url="https://assets-usa.mkt.dynamics.com/14e74438-32ad-42c2-91eb-3b40da498c56/digitalassets/forms/76438228-4767-f011-bec2-00224809e97b"
  ></div>
</template>

<script setup>
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
    // event.preventDefault();

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
