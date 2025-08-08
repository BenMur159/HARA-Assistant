import { tableData  } from "./data/tableData.js";
import { requestAiFieldSuggestion, exportHaraToCsv } from "./backend.js";


//NOTE: need to save this later so load from localstore
//doesnt fuck it up
let hazardIds = 0;
haraTableInit();

function haraTableInit() {
  loadData();
  if(hazardIds === 0) {
    addHaraRow();
  }
}

function loadData() {
  const itemDefinitionTextarea = document.querySelector('.js-item-definition-textarea');
  itemDefinitionTextarea.value = tableData.itemDefinition;
  const tbody = document.querySelector(".js-hara-input-table");
  tableData.tableRows.forEach((tableRow) => {
    addHaraRow();
    populateHaraRow(tableRow);

  });
}

function populateHaraRow(tableRow) {

  const hazardId = tableRow.hazardId;
  document.querySelector(`.js-function-${tableRow.hazardId}`).value = tableRow.hazardFunction;
  document.querySelector(`.js-assumed-hazard-${tableRow.hazardId}`).value = tableRow.assumedHazard;
  document.querySelector(`.js-general-driving-situation-${tableRow.hazardId}`).value = tableRow.generalDrivingSituation;
  document.querySelector(`.js-general-enviromental-conditions-${tableRow.hazardId}`).value = tableRow.generalEnviromentalConditions;
  document.querySelector(`.js-hazardouse-event-${tableRow.hazardId}`).value = tableRow.hazardousEvent;
  document.querySelector(`.js-severity-${tableRow.hazardId}`).value = tableRow.severity;
  document.querySelector(`.js-justification-s-${tableRow.hazardId}`).value = tableRow.justificationS;
  document.querySelector(`.js-exposure-${tableRow.hazardId}`).value = tableRow.exposure;
  document.querySelector(`.js-justification-e-${tableRow.hazardId}`).value = tableRow.justificationE;
  document.querySelector(`.js-controllability-${tableRow.hazardId}`).value = tableRow.controllability;
  document.querySelector(`.js-justification-c-${tableRow.hazardId}`).value = tableRow.justificationC;
  document.querySelector(`.js-asil-${tableRow.hazardId}`).value = tableRow.asil;
  document.querySelector(`.js-sg-number-${tableRow.hazardId}`).value = tableRow.sgNumber;
  document.querySelector(`.js-safety-goal-${tableRow.hazardId}`).value = tableRow.safetyGoal;
  document.querySelector(`.js-safe-state-${tableRow.hazardId}`).value = tableRow.safeState;
  document.querySelector(`.js-fault-tolerant-time-${tableRow.hazardId}`).value = tableRow.faultTolerantTime;

  calculateAsil(tableRow.hazardId);
  //tableData.editRowFromTableData(hazardId);
}

function addHaraRow() {
  
  const tbody = document.querySelector(".js-hara-input-table");
  hazardIds++;
  const hazardId = tableData.tableRows.length + 1;
  
  const newTableColumnHTML = `
    
    <tr class="table-row-${hazardIds}">
      <td>
        <button class="js-edit-row-button-${hazardIds} edit-row-button" data-hazard-id="${hazardIds}">Edit</button>
        <button class="js-save-row-button-${hazardIds} save-row-button" data-hazard-id="${hazardIds}">Save</button>
      </td>
      <td class="js-hazard-id-${hazardIds}">${hazardIds}</td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} function js-function-${hazardIds}" "></textarea></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} assumed-hazard js-assumed-hazard-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} general-driving-situation js-general-driving-situation-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} general-enviromental-conditions js-general-enviromental-conditions-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td class="group-divider"><textarea class="hara-text js-hara-text-${hazardIds} hazardouse-event js-hazardouse-event-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><input type="number" min="0" max="3" class="hara-number js-hara-number-${hazardIds} severity js-severity-${hazardIds}" data-hazard-id="${hazardIds}"></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} justification-s js-justification-s-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><input type="number" min="0" max="4" class="hara-number js-hara-number-${hazardIds} exposure js-exposure-${hazardIds}" data-hazard-id="${hazardIds}"></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} justification-e js-justification-e-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><input type="number" min="0" max="3" class="hara-number js-hara-number-${hazardIds} controllability js-controllability-${hazardIds}" data-hazard-id="${hazardIds}"></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} justification-c js-justification-c-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td class="group-divider"><input type="text" class="hara-text asil js-asil-${hazardIds}" readonly></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} sg-number js-sg-number-${hazardIds}"></textarea></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} safety-goal js-safety-goal-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td><textarea class="hara-text js-hara-text-${hazardIds} safe-state js-safe-state-${hazardIds} js-ai-field-${hazardIds}" data-hazard-id="${hazardIds}"></textarea></td>
      <td class="group-divider"><textarea class="hara-text js-hara-text-${hazardIds} fault-tolerant-time js-fault-tolerant-time-${hazardIds}"></textarea></td>
    </tr>
  `;
  
  /*
    NOTE: tbody.innerHTML += newTableColumnHTML is bad, because it
    dumps everything that has been written in the cells of previosue rows
  */
  tbody.insertAdjacentHTML("beforeend", newTableColumnHTML);

  document.querySelectorAll(`.js-ai-field-${hazardIds}`).forEach(element => {
    element.placeholder = "right-click 🤖";
  });

  document.querySelectorAll(`.js-hara-text-${hazardIds}`).forEach(element => {
    element.disabled = true;
  });
  document.querySelectorAll(`.js-hara-number-${hazardIds}`).forEach(element => {
    element.disabled = true;
  });

  initRowElements();

  /*
    NOTE: This is so no new rows get added while processing the data
    loaded from the local store
  */
  if(!(tableData.tableRows.length >= hazardIds))
  {
    console.log('added');
    tableData.addRowToTableData(hazardIds);
  }
}

function calculateAsil(hazardId){
  const severityNumber = document.querySelector(`.js-severity-${hazardId}`).value;
  const exposureNumber = document.querySelector(`.js-exposure-${hazardId}`).value;
  const controllabilityNumber = document.querySelector(`.js-controllability-${hazardId}`).value;

  console.log('S: ' + severityNumber + ', E: ' + exposureNumber + ', C: ' + controllabilityNumber);

  const asil = document.querySelector(`.js-asil-${hazardId}`);
  if(severityNumber == "" || exposureNumber == "" || controllabilityNumber == ""){
    asil.value = "";
    asil.style.backgroundColor = "";
    return;
  }
  const sum = Number(severityNumber) + Number(exposureNumber) + Number(controllabilityNumber);
  if(sum === 10)
  {
    asil.value = "ASIL D";
    asil.style.backgroundColor = "darkred";
  }
  else if(sum === 9) {
    asil.value = "ASIL C";
    asil.style.backgroundColor = "red";
  }
  else if(sum === 8) {
    asil.value = "ASIL B";
    asil.style.backgroundColor = "orange";
  }
  else if( (sum === 7 ) 
  && (Number(severityNumber) !== 0) 
  && (Number(exposureNumber) !== 0) 
  && (Number(controllabilityNumber) !== 0) ) {
    asil.value = "ASIL A";
    asil.style.backgroundColor = "yellow";
  }
  else {
    asil.value = "QM";
    asil.style.backgroundColor = "";
  }

}

function initRowElements() {
  
  const rowEditButton = document.querySelector(`.js-edit-row-button-${hazardIds}`); 
  rowEditButton.addEventListener('click', () => {
    const hazardId = rowEditButton.dataset.hazardId;
    document.querySelectorAll(`.js-hara-text-${hazardId}`).forEach(element => {
    element.disabled = false;
    });
    document.querySelectorAll(`.js-hara-number-${hazardId}`).forEach(element => {
    element.disabled = false;
    });
    document.querySelector(`.js-add-row-button`).disabled = true;
    document.querySelector(`.js-remove-row-button`).disabled = true;
    document.querySelector(".js-export-hara-to-csv-button").disabled = true;
    document.querySelector(".js-add-hara-to-database-button").disabled = true;
    //Disable all other Edit buttons
    for(let i = 1; i <= hazardIds; i++)
    {
      if(Number(hazardId) !== i) {
        document.querySelector(`.js-edit-row-button-${i}`).disabled = true;
        document.querySelector(`.js-save-row-button-${i}`).disabled = true;
        
      }
    }
  });

  const rowSaveButton = document.querySelector(`.js-save-row-button-${hazardIds}`); 
  rowSaveButton.addEventListener('click', () => {
    const hazardId = rowSaveButton.dataset.hazardId;
    document.querySelectorAll(`.js-hara-text-${hazardId}`).forEach(element => {
    element.disabled = true;
    });
    document.querySelectorAll(`.js-hara-number-${hazardId}`).forEach(element => {
    element.disabled = true;
    });
    document.querySelector(`.js-add-row-button`).disabled = false;
    document.querySelector(`.js-remove-row-button`).disabled = false;
    document.querySelector(".js-export-hara-to-csv-button").disabled = false;
    document.querySelector(".js-add-hara-to-database-button").disabled = false;
    for(let i = 1; i <= hazardIds; i++)
    {
      if(Number(hazardId) !== i) {
        document.querySelector(`.js-edit-row-button-${i}`).disabled = false;
        document.querySelector(`.js-save-row-button-${i}`).disabled = false;
      }
    }
    tableData.editRowFromTableData(hazardId);
  });

  const numberInputAreas = document.querySelectorAll(`.js-hara-number-${hazardIds}`);
  numberInputAreas.forEach((numberInputArea) => {
    numberInputArea.addEventListener("input", () => {
      const hazardId = numberInputArea.dataset.hazardId;
      let value = numberInputArea.value;
      calculateAsil(hazardId);
      //Nothing is valid
      if(value === "")
      {
        tableData.editRowFromTableData(hazardId);
        return
      }

      if (value.includes(".")) {
        value = Math.floor(Number(value));
      } else {
        value = Number(value);
      }
      const min = Number(numberInputArea.min);
      const max = Number(numberInputArea.max);

      if (value < min) value = min;
      if (value > max) value = max;

      numberInputArea.value = value;
      tableData.editRowFromTableData(hazardId);
    });
  })

  document.querySelectorAll(`.js-ai-field-${hazardIds}`).forEach(field => {
    field.addEventListener("contextmenu", (event) => {
      //do nothing while disabled
      if(field.disabled){
        return;
      }
      event.preventDefault();
      console.log("click & HazardID = " + field.dataset.hazardId);
      requestAiFieldSuggestion(field);
    })
  });
}

document.addEventListener("DOMContentLoaded", function () {

  /*
  const testButton = document.querySelector(".js-test-button");
  if (testButton) {
    testButton.addEventListener("click", function () {
      exportHaraToCsv(true);
      //fetchTest(textarea);

    });
  }
  */

  const saveButton = document.querySelector(".js-item-definition-save-button");
  saveButton.addEventListener("click", () => {
    tableData.saveToLocalStore();
  })

  document.querySelector(".js-add-row-button").addEventListener("click", () => {
    addHaraRow();
  });

  document.querySelector(".js-remove-row-button").addEventListener("click", () => {
    
    const rowToRemove = document.querySelector(`.table-row-${hazardIds}`)
    if(rowToRemove)
    {
      rowToRemove.remove();
    }
    tableData.removeRowFromTableData(hazardIds);
    hazardIds--;
    
  })

  document.querySelector(".js-export-hara-to-csv-button").addEventListener("click", () => {
    exportHaraToCsv(false);
  });

  document.querySelector(".js-add-hara-to-database-button").addEventListener("click", () => {
    exportHaraToCsv(true);
  });

});