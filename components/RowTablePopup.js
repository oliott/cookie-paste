const TABLE_ROW_POPUP_ELEMENT_NAME = "popup-table-row";
const TABLE_ROW_POPUP_ID_PREFIX = "7699";
const TABLE_ROW_POPUP_CLASS_NAME = "very-unique-class-69";
const SUCCESS_TABLE_ROW_POPUP_CLASS_NAME = "success-class-name";
const FAILED_TABLE_ROW_POPUP_CLASS_NAME = "failed-class-name";
const IGNORED_TABLE_ROW_POPUP_CLASS_NAME = "ignored-class-name";

class TableRowPopup extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const containerCheckBoxInputClassName = "container-checkbox-input";

    const style = document.createElement("style");
    style.textContent = `
.${containerRowDivClassName} {
  display: flex;
  border: 2px solid #ccc;
  &:hover {
    background-color: rgba(20,50,80,0.2);
  }

}
.${SUCCESS_TABLE_ROW_POPUP_CLASS_NAME} {
  background-color: rgba(20,150,50,0.4);
}

.${FAILED_TABLE_ROW_POPUP_CLASS_NAME} {
  background-color: rgba(150,20,50,0.4);
}
.${IGNORED_TABLE_ROW_POPUP_CLASS_NAME} {
  background-color: rgba(255,255,0,0.4);
}

.${containerColumnDivClassName} {
  flex: 1; /* Distribute space equally */
  padding: 2px;
  box-sizing: border-box;
  border-right: 2px solid #ccc;
}

.${evenClassName} {
  background-color: rgba(225,225,225,0.7);
}`;

    //Row div
    this.containerRowDiv = document.createElement("div");
    this.containerRowDiv.className = containerRowDivClassName;

    // Container Name
    this.containerName = document.createElement("span");

    // Container Refresh
    this.containerRefresh = document.createElement("input");
    this.containerRefresh.type = "checkbox";

    // Container Target URL
    this.containerTargetURL = document.createElement("a");
    this.containerTargetURL.href = "#";

    const columns = [
      this.containerRefresh,
      this.containerName,
      this.containerTargetURL,
    ];

    columns.forEach((element) => {
      const columnDiv = document.createElement("div");
      columnDiv.className = containerColumnDivClassName;
      columnDiv.appendChild(element);
      this.containerRowDiv.appendChild(columnDiv);
    });

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.containerRowDiv);
  }

  fillInformation(containerInformation, target_domain) {
    var oddOrEvenClassName = containerInformation.isEven
      ? evenClassName
      : "odd";
    this.containerRowDiv.classList.add(oddOrEvenClassName);
    this.id = `${TABLE_ROW_POPUP_ID_PREFIX}${containerInformation.cookieStoreId}`;
    this.cookieStoreId = containerInformation.cookieStoreId;

    this.containerName.appendChild(
      document.createTextNode(containerInformation.cookieStoreName),
    );
    //https://bob.awsapps.com/start/#/console?account_id=000000000000&role_name=ReadOnly
    target_domain;
    if (containerInformation.hasOwnProperty("refresh")) {
      this.containerRefresh.checked = containerInformation.refresh;
    }
    if (
      containerInformation.hasOwnProperty("targetAccountId") &&
      containerInformation.hasOwnProperty("targetRoleName")
    ) {
      this.containerTargetURL.href = `https://${target_domain}/start/#/console?account_id=${containerInformation.targetAccountId}&role_name=${containerInformation.targetRoleName}`;
      this.containerTargetURL.appendChild(
        document.createTextNode(`${containerInformation.targetRoleName}`),
      );
      this.containerTargetURL.title = `${containerInformation.targetAccountId} -> ${containerInformation.targetRoleName}`;
      this.urlTargetRoleName = containerInformation.targetRoleName;
      this.urlTargetAccountId = containerInformation.targetAccountId;
    }
  }

  addTemporaryColor(className) {
    const color_time = 7000;
    this.containerRowDiv.classList.add(className);
    if (this.containerRowDiv.classList.contains(evenClassName)) {
      this.containerRowDiv.classList.remove(evenClassName);
      window.setTimeout(() => {
        this.containerRowDiv.classList.remove(className);
        this.containerRowDiv.classList.add(evenClassName);
      }, color_time);
    } else {
      window.setTimeout(() => {
        this.containerRowDiv.classList.remove(className);
      }, color_time);
    }
  }

  static factory(containerInformation, target_domain) {
    const containerTableRow = document.createElement(
      TABLE_ROW_POPUP_ELEMENT_NAME,
    );
    containerTableRow.fillInformation(containerInformation, target_domain);
    containerTableRow.classList.add(TABLE_ROW_POPUP_CLASS_NAME);
    return containerTableRow;
  }
}
customElements.define(TABLE_ROW_POPUP_ELEMENT_NAME, TableRowPopup);
