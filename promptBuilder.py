import os
from embeddingRetriever import retriever

class PromptBuilder:
  def __init__(self, jsonData):
    self.__item_definition = jsonData["itemDefinition"]
    self.__hazard_id = jsonData["hazardId"]
    self.__hazard_function = jsonData["hazardFunction"]
    self.__assumed_hazard = jsonData["assumedHazard"]
    self.__general_driving_situation = jsonData["generalDrivingSituation"]
    self.__general_enviromental_conditions = jsonData["generalEnviromentalConditions"]
    self.__hazardous_event = jsonData["hazardousEvent"]
    self.__severity = "S" + (jsonData["severity"] or "NP")
    self.__justification_s = jsonData["justificationS"]
    self.__exposure = "E" + (jsonData["exposure"] or "NP")
    self.__justification_e = jsonData["justificationE"]
    self.__controllability = "C" + (jsonData["controllability"] or "NP")
    self.__justification_c = jsonData["justificationC"]
    self.__asil = jsonData["asil"]
    self.__sg_number = jsonData["sgNumber"]
    self.__safety_goal = jsonData["safetyGoal"]
    self.__safe_state = jsonData["safeState"]
    self.__fault_tolerant_time = jsonData["faultTolerantTime"]

    self.__do_not_generate_again = jsonData["doNotGenerateAgain"] or "NON"
    
    self.__LlmGenerationTarget = ""
    self.system_prompt = ""
    self.user_prompt = ""

    self.set_generation_target()
    self.load_system_prompt()
    self.build_user_prompt_from_file()

  def set_generation_target(self, markers=("🤖 generating.", "🤖 generating..", "🤖 generating..." )):
    check = 0
    for attr_name in vars(self):
      value = getattr(self, attr_name)
      if isinstance(value, str) and any(marker in value for marker in markers):
        clean_private_name = attr_name.replace(f"_{self.__class__.__name__}", "")
        self.__LlmGenerationTarget = clean_private_name
        check += 1

    #---Sanity checks----
    if check == 0:
      raise Exception("No generation target found")
    if check < 1:
      raise Exception("Multiple generation targets found")
    #---------------------
    return
  
  def load_system_prompt(self):
    filename = f"{self.__LlmGenerationTarget}_system.txt"
    prompt_folder = "prompt_templates"
    file_path = os.path.join(prompt_folder, filename)

    if not os.path.isfile(file_path):
      print("file_path: ", file_path)
      raise FileNotFoundError(f"System prompt file not found: {file_path}")
    
    with open(file_path, "r", encoding="utf-8") as file:
      self.system_prompt = file.read()

    rag_data = retriever.invoke(self.__item_definition)

    for i, doc in enumerate(rag_data):
      # NOTE: most of there are not used but are in here for later adjusments 
      replacements = {
        f"{{{{ item_definition_{i+1} }}}}": rag_data[i].page_content,
        f"{{{{ hazard_function_{i+1} }}}}": rag_data[i].metadata["hazardFunction"],
        f"{{{{ assumed_hazard_{i+1} }}}}": rag_data[i].metadata["assumedHazard"],
        f"{{{{ general_driving_situation_{i+1} }}}}": rag_data[i].metadata["generalDrivingSituation"],
        f"{{{{ general_enviromental_conditions_{i+1} }}}}": rag_data[i].metadata["generalEnviromentalConditions"],
        f"{{{{ hazardous_event_{i+1} }}}}": rag_data[i].metadata["hazardousEvent"],
        f"{{{{ severity_{i+1} }}}}": rag_data[i].metadata["severity"],
        f"{{{{ justification_s_{i+1} }}}}": rag_data[i].metadata["justificationS"],
        f"{{{{ exposure_{i+1} }}}}": rag_data[i].metadata["exposure"],
        f"{{{{ justification_e_{i+1} }}}}": rag_data[i].metadata["justificationE"],
        f"{{{{ controllability_{i+1} }}}}": rag_data[i].metadata["controllability"],
        f"{{{{ justification_c_{i+1} }}}}": rag_data[i].metadata["justificationC"],
        f"{{{{ asil_{i+1} }}}}": rag_data[i].metadata["asil"],
        f"{{{{ sg_number_{i+1} }}}}": rag_data[i].metadata["sgNumber"],
        f"{{{{ safety_goal_{i+1} }}}}": rag_data[i].metadata["safetyGoal"],
        f"{{{{ safe_state_{i+1} }}}}": rag_data[i].metadata["safeState"],
        f"{{{{ fault_tolerant_time_{i+1} }}}}": rag_data[i].metadata["faultTolerantTime"],
      }
      for placeholder, value in replacements.items():
        self.system_prompt = self.system_prompt.replace(placeholder, str(value))

    #print(self.system_prompt)

    # rag_data = retriever.invoke(self.__item_definition)
    # print(self.__LlmGenerationTarget)
    # print("Item_definition of [0]: \n" + rag_data[0].page_content)
    
  def build_user_prompt_from_file(self):
    filename = f"{self.__LlmGenerationTarget}_user.txt"
    prompt_folder = "prompt_templates"
    file_path = os.path.join(prompt_folder, filename)

    if not os.path.isfile(file_path):
      print("file_path: ", file_path)
      raise FileNotFoundError(f"User prompt file not found: {file_path}")
    
    with open(file_path, "r", encoding="utf-8") as file:
      self.user_prompt = file.read()

    replacements = {
      "{{ item_definition }}": self.__item_definition,
      "{{ hazard_id }}": self.__hazard_id,
      "{{ hazard_function }}": self.__hazard_function,
      "{{ assumed_hazard }}": self.__assumed_hazard,
      "{{ general_driving_situation }}": self.__general_driving_situation,
      "{{ general_enviromental_conditions }}": self.__general_enviromental_conditions,
      "{{ hazardous_event }}": self.__hazardous_event,
      "{{ severity }}": self.__severity,
      "{{ justification_s }}": self.__justification_s,
      "{{ exposure }}": self.__exposure,
      "{{ justification_e }}": self.__justification_e,
      "{{ controllability }}": self.__controllability,
      "{{ justification_c }}": self.__justification_c,
      "{{ asil }}": self.__asil,
      "{{ sg_number }}": self.__sg_number,
      "{{ safety_goal }}": self.__safety_goal,
      "{{ safe_state }}": self.__safe_state,
      "{{ fault_tolerant_time }}": self.__fault_tolerant_time,
      "{{ do_not_generate_again }}": self.__do_not_generate_again
    }
    for placeholder, value in replacements.items():
      self.user_prompt = self.user_prompt.replace(placeholder, str(value))
    

  def test_function(self):
    print("This is test function!")
    print(self.__hazard_function, " | ", self.__exposure, " | ", self.__assumed_hazard)
  
