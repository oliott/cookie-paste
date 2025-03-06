const TABLE_ROW_CONFIG_ELEMENT_NAME = "config-table-row";
const TABLE_ROW_CONFIG_ID_PREFIX = "7969";

class TableRowConfiguration extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    const containerTextInputClassName = "container-text-input";
    const containerCheckBoxInputClassName = "container-checkbox-input";

    this.refreshCheckBoxId = "input-refresh-or-not";
    this.textInputAccountIDId = "input-account-id";
    this.textInputRoleNameId = "input-role-name";
    this.targetURLId = "target-url-id";

    const style = document.createElement("style");
    style.textContent = `
.${containerRowDivClassName} {
  display: flex;
  border: 2px solid #ccc;
  &:hover {
    background-color: rgba(20,50,80,0.2);
  }

}

.${containerColumnDivClassName} {
  flex: 1; /* Distribute space equally */
  padding: 2px;
  box-sizing: border-box;
  border-right: 2px solid #ccc;
}

.${containerTextInputClassName} {
  width: 95%;
  &:invalid {
    border: 2px solid rgb(255,0,0);
  }
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
    this.containerRefresh.id = this.refreshCheckBoxId;

    // Container Target Account ID
    this.containerTargetAccountID = document.createElement("input");
    this.containerTargetAccountID.type = "text";
    this.containerTargetAccountID.pattern = "^\\d{12}$|^$";
    this.containerTargetAccountID.title =
      "Please enter a valid AWS Account ID, exactly 12 digits or leave it empty.";
    this.containerTargetAccountID.placeholder = "123456789123";
    this.containerTargetAccountID.maxLength = 12;
    this.containerTargetAccountID.id = this.textInputAccountIDId;
    this.containerTargetAccountID.className = containerTextInputClassName;

    // Container Target Role Name
    this.containerTargetRoleName = document.createElement("input");
    this.containerTargetRoleName.type = "text";
    this.containerTargetRoleName.id = this.textInputRoleNameId;
    this.containerTargetRoleName.title =
      "The name of the role that we should assume in target account example DevOpsAdmin";
    this.containerTargetRoleName.placeholder = "ReadOnly";
    this.containerTargetRoleName.className = containerTextInputClassName;

    const columns = [
      this.containerName,
      this.containerRefresh,
      this.containerTargetAccountID,
      this.containerTargetRoleName,
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

  fillInformation(containerInformation) {
    var oddOrEvenClassName = containerInformation.isEven
      ? evenClassName
      : "odd";
    this.containerRowDiv.classList.add(oddOrEvenClassName);
    this.id = `${TABLE_ROW_CONFIG_ID_PREFIX}${containerInformation.cookieStoreId}`;

    this.containerName.appendChild(
      document.createTextNode(containerInformation.cookieStoreName),
    );

    if (containerInformation.hasOwnProperty("refresh")) {
      this.containerRefresh.checked = containerInformation.refresh;
    }
    if (containerInformation.hasOwnProperty("targetAccountId")) {
      this.containerTargetAccountID.value =
        containerInformation.targetAccountId;
    }
    if (containerInformation.hasOwnProperty("targetRoleName")) {
      this.containerTargetRoleName.value = containerInformation.targetRoleName;
    }
  }

  getInformation(containerInformation) {
    containerInformation["refresh"] = this.containerRefresh.checked;
    containerInformation["targetAccoundId"] =
      this.containerTargetAccountID.value;
    containerInformation["targetRoleName"] = this.containerTargetRoleName.value;
    return containerInformation;
  }

  static factory(containerInformation) {
    const containerTableRow = document.createElement(
      TABLE_ROW_CONFIG_ELEMENT_NAME,
    );
    containerTableRow.fillInformation(containerInformation);
    return containerTableRow;
  }
}
customElements.define(TABLE_ROW_CONFIG_ELEMENT_NAME, TableRowConfiguration);
