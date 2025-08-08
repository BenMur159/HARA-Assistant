import { tableData } from "./data/tableData.js";

export function backendTestFunction() {
  console.log("here is backendTestFunction()");
}

function jsonMessageBuilder(hazardId) {
  //TODO: Maybe also transfer what is in the other rows for comparison?
  const jsonMessage = {
      itemDefinition: document.querySelector(`.js-item-definition-textarea`).value,
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
      faultTolerantTime: document.querySelector(`.js-fault-tolerant-time-${hazardId}`).value,

      doNotGenerateAgain: []
  }
  return jsonMessage;
  
}

function findDoNotGenerateAgain(jsonMessage, textarea) {
  const haraRows = tableData.tableRows.length;
  const hazardId = textarea.dataset.hazardId;
  
  if(textarea.classList.contains(`js-assumed-hazard-${hazardId}`))
  {
    const rowHazardFunction = document.querySelector(`.js-function-${hazardId}`).value
    for(let i = 1; i <= haraRows; i++)
    {
      if(Number(hazardId) === i)
      {
        continue;
      }
      const otherHazardFunction = document.querySelector(`.js-function-${i}`).value
      
      if(rowHazardFunction === otherHazardFunction)
      {
        const assumedHazard = document.querySelector(`.js-assumed-hazard-${i}`).value
        jsonMessage.doNotGenerateAgain.push(assumedHazard)
      }
    }
  }
  console.log("doNotGenerateAgain: " + jsonMessage.doNotGenerateAgain);
  //jsonMessage.doNotGenerateAgain = ["Element1", "Element2", "Element3"];
  return jsonMessage;
}

//------------------------------------------------
//Function: Displays Loading loop and returns the ID for later clearance
//Reason: Calling OpenRouter API takes often a few sec, so user doesn't think it crashed
//------------------------------------------------
function displayGenerating(textarea) {
  const loadingStates = ["🤖 generating..", "🤖 generating...", "🤖 generating."]
  let index = 0;
  textarea.value = "🤖 generating.";
  const loadingInterval = setInterval(() => {
        index = (index + 1) % loadingStates.length;
        textarea.value = loadingStates[index];
      }, 500);
  return loadingInterval;
}

//TODO: if LLM is rate limited display try again later
export async function requestAiFieldSuggestion(textarea) {
  const loadingInterval = displayGenerating(textarea);
  const hazardId = textarea.dataset.hazardId;
  let jsonMessage = jsonMessageBuilder(hazardId);

  if (textarea.classList.contains(`js-assumed-hazard-${hazardId}`) 
  || textarea.classList.contains(`js-hazardouse-event-${hazardId}`)) {

    console.log("✅ Textarea has the class!")
    jsonMessage = findDoNotGenerateAgain(jsonMessage, textarea);

  }

  console.log(jsonMessage);
  try{
    const response = await fetch("/request_ai_field_suggestion", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(jsonMessage)
    });
    const data = await response.json();
    clearInterval(loadingInterval);
    console.log('fetchTest recieved: ' + data.aiFieldSuggestion);

    // NOTE: need this because severity, exposure and controlability actually send back nestes JSONs
    // Concern: the LLM making a wrong JSON output might break this whole section -> worst case everything gets put
    // into the textarea 
    try{
      const parsed = JSON.parse(data.aiFieldSuggestion);
      console.log("parse worked");
      console.log(parsed);
      textarea.value = parsed.justification;

      // This firstKey now ether is severity, exposure or controllability
      const firstKey = Object.keys(parsed)[0];
      console.log('firstKey: ' + firstKey);
      const levelString = parsed[firstKey];
      console.log('Level: ' + levelString);
      const levelNumber = Number(levelString.slice(1));
      console.log(typeof levelNumber + ', levelNumber: ' + levelNumber);
      const inputElement = document.querySelector(`.js-${firstKey}-${hazardId}`);
      inputElement.value = levelNumber;
      //NOTE this is to trigger the ASIL calculation
      inputElement.dispatchEvent(new Event("input"));

    } catch {
      console.log("parse did not work");
      textarea.value = data.aiFieldSuggestion;
    }
    tableData.editRowFromTableData(hazardId);

    
  } catch (error) {
    console.log("Error cought in requestAiFieldSuggestion()");
    console.error("Something went wrong:", error);
  }

}

export async function exportHaraToCsv(isToDatabase = false) {
  //Deep copy
  let csvTableData = JSON.parse(JSON.stringify(tableData.tableRows));
  const itemDefinition = document.querySelector(`.js-item-definition-textarea`).value
  for(let i = 0; i < tableData.tableRows.length; i++)
  {
    csvTableData[i].itemDefinition = itemDefinition;
    /*
      This is tp avoid complications with 
      json_data[i][key] = json_data[i][key].replace("\n", "") in csvConverter.py
    */
    if(isToDatabase) {
      csvTableData[i].toDatabase = "yes";
    } else {
      csvTableData[i].toDatabase = "no";
    }
  }
  try{
    const response = await fetch("/export_hara_to_csv", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(csvTableData)
    });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
}