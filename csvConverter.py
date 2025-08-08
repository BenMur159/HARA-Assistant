import csv
import os

def remove_incomplete_rows(json_data):
  new_json_data = []
  for i in range(len(json_data)):
    isIncomplet = False
    for key in json_data[i]:
      if(json_data[i][key] == ""):
        isIncomplet = True
        break
      json_data[i][key] = json_data[i][key].replace("\n", "")
    if(isIncomplet == False):
      new_json_data.append(json_data[i])
  return new_json_data

def export_hara_to_csv(json_data):
  with open("HARA_export.csv", "w", newline = "", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow([
      "itemDefinition","hazardId", "hazardFunction", "assumedHazard", "generalDrivingSituation",
      "generalEnviromentalConditions", "hazardousEvent", "severity",
      "justificationS", "exposure", "justificationE", "controllability",
      "justificationC", "asil", "sgNumber", "safetyGoal", "safeState", "faultTolerantTime"
    ])
    for row in json_data:
      writer.writerow([row.get(key, "") for key in [
        "itemDefinition","hazardId", "hazardFunction", "assumedHazard", "generalDrivingSituation",
        "generalEnviromentalConditions", "hazardousEvent", "severity",
        "justificationS", "exposure", "justificationE", "controllability",
        "justificationC", "asil", "sgNumber", "safetyGoal", "safeState", "faultTolerantTime"
      ]])

  file_path = "hara_data\HARA_database.csv"
  isExisting = os.path.exists(file_path)
  with open(file_path, "a", newline = "", encoding="utf-8") as file:
    writer = csv.writer(file)
    #print(os.path.exists(file_path))
    if (not isExisting) or (file.tell == 0):
      writer.writerow([
        "itemDefinition", "hazardFunction", "assumedHazard", "generalDrivingSituation",
        "generalEnviromentalConditions", "hazardousEvent", "severity",
        "justificationS", "exposure", "justificationE", "controllability",
        "justificationC", "asil", "sgNumber", "safetyGoal", "safeState", "faultTolerantTime"
      ])
    for row in json_data:
      if row["toDatabase"] == "yes":
        writer.writerow([row.get(key, "") for key in [
          "itemDefinition", "hazardFunction", "assumedHazard", "generalDrivingSituation",
          "generalEnviromentalConditions", "hazardousEvent", "severity",
          "justificationS", "exposure", "justificationE", "controllability",
          "justificationC", "asil", "sgNumber", "safetyGoal", "safeState", "faultTolerantTime"
        ]])

#TODO: Check if entry is not already present in the database
#Concern: for huge databases this might be a massivle slowdown
def dublication_check():
  pass