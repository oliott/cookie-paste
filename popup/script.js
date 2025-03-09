// Event listener to open the options page
document.getElementById("openOptions").addEventListener("click", () => {
  browser.runtime
    .openOptionsPage()
    .then()
    .catch((error) => {
      console.error(`Error opening options page: ${error}`);
    });
});

const targetAllCheckBox = document.getElementById("targetAllCheckBox");
targetAllCheckBox.addEventListener("click", () => {
  if (targetAllCheckBox.checked) {
    const tableRows = document.getElementsByClassName(
      TABLE_ROW_POPUP_CLASS_NAME,
    );
    for (const tableRow of tableRows) {
      tableRow.containerRefresh.checked = true;
    }
  } else {
    const tableRows = document.getElementsByClassName(
      TABLE_ROW_POPUP_CLASS_NAME,
    );
    for (const tableRow of tableRows) {
      tableRow.containerRefresh.checked = false;
    }
  }
});

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
  const target_domain = savedConfig.hasOwnProperty("defaultDomain")
    ? savedConfig.defaultDomain
    : "setme.awsapps.com";

  const containerList = document.getElementById("container-list");
  for (const [cookieStoreId, cookieStoreRepresentation] of Object.entries(
    contextualIdentities,
  )) {
    if (savedConfig.hasOwnProperty("containerConfig")) {
      // We have config to Check
      if (cookieStoreId in savedConfig.containerConfig) {
        // We have config for thie cookieStoreId
        containerList.appendChild(
          TableRowPopup.factory(
            savedConfig.containerConfig[cookieStoreId],
            target_domain,
          ),
        );
      } else {
        // We have config but not for this cookieStoreId
        containerList.appendChild(
          TableRowPopup.factory(cookieStoreRepresentation, target_domain),
        );
      }
    } else {
      // We do not have config
      containerList.appendChild(
        TableRowPopup.factory(cookieStoreRepresentation, target_domain),
      );
    }
  }
}

/**
 * [set_cookie Takes a cookie and a cookie name and sets it to all the selected checkboxes.]
 * @param {*} cookies [The cookie we are setting.]
 * @param {*} cookie_name [The name of the cookie we are setting]
 */
async function set_cookie(cookies, cookie_name) {
  // TODO: This should actually just copy one cookie so no need to loop over it like this
  for (let cookie_to_share of cookies) {
    if (cookie_to_share.name == cookie_name) {
      const tableRows = document.getElementsByClassName(
        TABLE_ROW_POPUP_CLASS_NAME,
      );

      for (const tableRow of tableRows) {
        const checkBox = tableRow.containerRefresh;
        if (checkBox.checked) {
          try {
            var cookie_result = await browser.cookies.set({
              url: `https://${cookie_to_share.domain}`,
              name: cookie_to_share.name,
              value: cookie_to_share.value,
              //domain: cookie_to_share.domain,
              path: cookie_to_share.path,
              secure: cookie_to_share.secure,
              httpOnly: cookie_to_share.httpOnly,
              sameSite: cookie_to_share.sameSite,
              storeId: tableRow.cookieStoreId,
            });
            tableRow.addTemporaryColor(SUCCESS_TABLE_ROW_POPUP_CLASS_NAME);

            if (
              tableRow.hasOwnProperty("urlTargetRoleName") &&
              tableRow.hasOwnProperty("urlTargetAccountId")
            ) {
              const url = `https://${cookie_to_share.domain}/start/#/console?account_id=${tableRow.urlTargetAccountId}&role_name=${tableRow.urlTargetRoleName}`;
              browser.tabs.create({
                url: url,
                cookieStoreId: tableRow.cookieStoreId,
              });
            }
          } catch (error) {
            console.error(
              `An error ocurred when trying to copy cookie ${error}`,
            );
            tableRow.addTemporaryColor(FAILED_TABLE_ROW_POPUP_CLASS_NAME);
          }
        } else {
          tableRow.addTemporaryColor(IGNORED_TABLE_ROW_POPUP_CLASS_NAME);
        }
      }
    }
  }
}

async function filter_cookies(storeId, domain, name) {
  var cookies = browser.cookies.getAll({
    storeId: storeId,
    domain: domain,
    name: name,
  });

  return cookies;
}

// Add a click event listener to the submit button
const submitButton = document.getElementById("copyCookie");
submitButton.addEventListener("click", async () => {
  var source_store_id = document.getElementById(
    "defaultSourceCookieStoreId",
  ).value;
  var domain = document.getElementById("defaultDomain").value;
  var cookie_name = document.getElementById("defaultCookie").value;

  try {
    var filtered_cookies = await filter_cookies(
      source_store_id,
      domain,
      cookie_name,
    );
  } catch (error) {
    console.error(`An error ocurred when trying to filter cookies ${error}`);
  }
  await set_cookie(filtered_cookies, cookie_name);
});

loadConfigurations();
