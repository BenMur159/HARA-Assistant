
//let testVar;

class TableData {
  itemDefinition;
  tableRows;
  #itemDefKey = 'itemDef';
  #tableRowsKey = 'tableRows'

  constructor() {
    this.#loadFromStorage();
  }



  #loadFromStorage() {
    this.itemDefinition = localStorage.getItem(this.#itemDefKey) || '';
    //console.log('loaded itemDefinition: ' + this.itemDefinition);
    this.tableRows = JSON.parse(localStorage.getItem(this.#tableRowsKey)) || [];
    console.log("loaded tableRows: (see next line)");
    console.log(this.tableRows);
  }

  //Function: Saves to local store with 2 different keys
  //Reason: easier to do
  saveToLocalStore() {
    this.itemDefinition = document.querySelector(".js-item-definition-textarea").value;
    localStorage.setItem(this.#itemDefKey, this.itemDefinition);
    const tableDataString = JSON.stringify(this.tableRows);
    localStorage.setItem(this.#tableRowsKey, tableDataString);
  }

  addRowToTableData(hazardId){

    console.log('addRowToTableData() -> ID: ' + hazardId);

    this.tableRows.push({
      hazardId: document.querySelector(`.js-hazard-id-${hazardId}`).innerText,
      hazardFunction: document.querySelector(`.js-function-${hazardId}`).value,
      assumedHazard: document.querySelector(`.js-assumed-hazard-${hazardId}`).value,
      generalDrivingSituation: document.querySelector(`.js-general-driving-situation-${hazardId}`).value,
      generalEnviromentalConditions: document.querySelector(`.js-general-enviromental-conditions-${hazardId}`).value,
      hazardousEvent: document.querySelector(`.js-hazardouse-event-${hazardId}`).value,
      severity: document.querySelector(`.js-severity-${hazardId}`).value,
      justificationS: document.querySelector(`.js-justification-s-${hazardId}`).value,
      exposure: document.querySelector(`.js-exposure-${hazardId}`).value,
      justificationE: document.querySelector(`.js-justification-e-${hazardId}`).value,
      controllability: document.querySelector(`.js-controllability-${hazardId}`).value,
      justificationC: document.querySelector(`.js-justification-c-${hazardId}`).value,
      asil: document.querySelector(`.js-asil-${hazardId}`).value,
      sgNumber: document.querySelector(`.js-sg-number-${hazardId}`).value,
      safetyGoal: document.querySelector(`.js-safety-goal-${hazardId}`).value,
      safeState: document.querySelector(`.js-safe-state-${hazardId}`).value,
      faultTolerantTime: document.querySelector(`.js-fault-tolerant-time-${hazardId}`).value
    });

    //Sanity Check
    let check = 1;
    this.tableRows.forEach((tableRow) => {
      console.log(`Check = ${check} | hazardId = ${tableRow.hazardId}`);
      if(Number(tableRow.hazardId) !== check)
      {
        console.log(`Check = ${check}`);
        throw new Error("addRowToTableData(hazardId) -> Check !== tableRow.hazardId: Why are hazard IDs not continouse?"); 
      }
      check += 1;
    })

    this.saveToLocalStore();
  }

  removeRowFromTableData(hazardId) {
    const newTableRows = [];

    this.tableRows.forEach((tableRow) => {
      if(hazardId !== Number(tableRow.hazardId))
      {
        newTableRows.push(tableRow);
      }
    });
    this.tableRows = newTableRows;
    this.saveToLocalStore();
  }

  editRowFromTableData(hazardId){

    const tableRow = this.getTableRow(hazardId);

    tableRow.hazardId = document.querySelector(`.js-hazard-id-${hazardId}`).innerText,
    tableRow.hazardFunction = document.querySelector(`.js-function-${hazardId}`).value,
    tableRow.assumedHazard = document.querySelector(`.js-assumed-hazard-${hazardId}`).value,
    tableRow.generalDrivingSituation = document.querySelector(`.js-general-driving-situation-${hazardId}`).value,
    tableRow.generalEnviromentalConditions = document.querySelector(`.js-general-enviromental-conditions-${hazardId}`).value,
    tableRow.hazardousEvent = document.querySelector(`.js-hazardouse-event-${hazardId}`).value,
    tableRow.severity = document.querySelector(`.js-severity-${hazardId}`).value,
    tableRow.justificationS = document.querySelector(`.js-justification-s-${hazardId}`).value,
    tableRow.exposure = document.querySelector(`.js-exposure-${hazardId}`).value,
    tableRow.justificationE = document.querySelector(`.js-justification-e-${hazardId}`).value,
    tableRow.controllability = document.querySelector(`.js-controllability-${hazardId}`).value,
    tableRow.justificationC = document.querySelector(`.js-justification-c-${hazardId}`).value,
    tableRow.asil = document.querySelector(`.js-asil-${hazardId}`).value,
    tableRow.sgNumber = document.querySelector(`.js-sg-number-${hazardId}`).value,
    tableRow.safetyGoal = document.querySelector(`.js-safety-goal-${hazardId}`).value,
    tableRow.safeState = document.querySelector(`.js-safe-state-${hazardId}`).value,
    tableRow.faultTolerantTime = document.querySelector(`.js-fault-tolerant-time-${hazardId}`).value

    this.saveToLocalStore();
  }  

  getTableRow(hazardId) {
    let row = false;
    let check = 0;
    this.tableRows.forEach((tableRow) => {
      if(Number(hazardId) === Number(tableRow.hazardId))
      { 
        check += 1;
        row = tableRow;
      }

      //Sanity Check
      if(check > 1)
      {
        throw new Error("getTableRow(hazardId) -> Check > 1: Why are there two table rows with same ID?");
      }
    });
    return row
  }
}


export const tableData = new TableData;