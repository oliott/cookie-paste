const containerList = document.getElementById("container-list");

async function extractSetConfig() {
  const contextualIdentities = await getContextualIdentities();

  for (const [cookieStoreId, cookieStoreRepresentation] of Object.entries(
    contextualIdentities,
  )) {
    const tableRow = document.getElementById(
      `${TABLE_ROW_CONFIG_ID_PREFIX}${cookieStoreId}`,
    );
    tableRow.getInformation(cookieStoreRepresentation);
  }
  return contextualIdentities;
}

// Function to save configurations
async function saveConfigurations() {
  try {
    const currentContainerConfig = await extractSetConfig();

    const config = {
      defaultDomain: document.getElementById("defaultDomain").value,
      defaultCookie: document.getElementById("defaultCookie").value,
      defaultSourceCookieStoreId: document.getElementById(
        "defaultSourceCookieStoreId",
      ).value,
      containerConfig: currentContainerConfig,
    };
    const saveButton = document.getElementById("saveConfig");
    const saveButtonDiv = document.getElementById("saveConfigDiv");
    browser.storage.local.set(config).then(() => {
      const label = document.createElement("label");
      label.htmlFor = saveButton.id;
      label.appendChild(document.createTextNode("Success ✅"));
      saveButtonDiv.append(label);
      setTimeout(() => {
        label.remove();
      }, 1500);
    });
  } catch (error) {
    console.error("Could not save configuration: ", error);
    const label = document.createElement("label");
    label.htmlFor = saveButton.id;
    label.appendChild(
      document.createTextNode(`❌Failed to set config see console❌`),
    );
    saveButtonDiv.append(label);
    setTimeout(() => {
      label.remove();
    }, 10000);
  }
}

// Function to load configurations
async function loadConfigurations() {
  const savedConfig = await browser.storage.local.get();
  const contextualIdentities = await getContextualIdentities();

  let storeDropdown = document.getElementById("defaultSourceCookieStoreId");
  for (const [cookieStoreId, cookieStoreRepresentation] of Object.entries(
    contextualIdentities,
  )) {
    let option = document.createElement("option");
    option.value = cookieStoreRepresentation.cookieStoreId;
    option.textContent = cookieStoreRepresentation.cookieStoreName;
    option.innerText = cookieStoreRepresentation.cookieStoreName;
    option.id = `option-${cookieStoreRepresentation.cookieStoreId}`;

    if (savedConfig.hasOwnProperty("defaultSourceCookieStoreId")) {
      if (savedConfig.defaultSourceCookieStoreId == cookieStoreId) {
        option.selected = true;
      }
    }
    storeDropdown.appendChild(option);
  }

  if (savedConfig.hasOwnProperty("defaultDomain")) {
    document.getElementById("defaultDomain").value = savedConfig.defaultDomain;
  } else {
    document.getElementById("defaultDomain").value = "setme.awsapps.com";
  }
  if (savedConfig.hasOwnProperty("defaultCookie")) {
    document.getElementById("defaultCookie").value = savedConfig.defaultCookie;
  } else {
    document.getElementById("defaultCookie").value = "x-amz-sso_authn";
  }

  for (const [cookieStoreId, cookieStoreRepresentation] of Object.entries(
    contextualIdentities,
  )) {
    if (savedConfig.hasOwnProperty("containerConfig")) {
      // We have config to Check
      if (cookieStoreId in savedConfig.containerConfig) {
        // We have config for thie cookieStoreId
        containerList.appendChild(
          TableRowConfiguration.factory(
            savedConfig.containerConfig[cookieStoreId],
          ),
        );
      } else {
        // We have config but not for this cookieStoreId
        containerList.appendChild(
          TableRowConfiguration.factory(cookieStoreRepresentation),
        );
      }
    } else {
      // We do not have config
      containerList.appendChild(
        TableRowConfiguration.factory(cookieStoreRepresentation),
      );
    }
  }
}
// Event listener for saving configurations
document
  .getElementById("saveConfig")
  .addEventListener("click", saveConfigurations);

// Initialize the options page
loadConfigurations();
