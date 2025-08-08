
# This python file is based on "https://github.com/techwithtim/LocalAIAgentWithRAG/blob/main/vector.py"

from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd


df = pd.read_csv("hara_data\HARA_database.csv")
embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db_location = "./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

vector_store = Chroma(
  collection_name="hara_database",
  persist_directory=db_location,
  embedding_function=embeddings
)

if add_documents:
  documents = []
  ids = []

  for i, row in df.iterrows():
    document = Document(
      page_content=row["itemDefinition"],
      metadata={
        "hazardFunction": row["hazardFunction"],
        "assumedHazard": row["assumedHazard"],
        "generalDrivingSituation": row["generalDrivingSituation"],
        "generalEnviromentalConditions": row["generalEnviromentalConditions"],
        "hazardousEvent": row["hazardousEvent"],
        "severity": row["severity"],
        "justificationS": row["justificationS"],
        "exposure": row["exposure"],
        "justificationE": row["justificationE"],
        "controllability": row["controllability"],
        "justificationC": row["justificationC"],
        "asil": row["asil"],
        "sgNumber": row["sgNumber"],
        "safetyGoal": row["safetyGoal"],
        "safeState": row["safeState"],
        "faultTolerantTime" :row["faultTolerantTime"]
      },
      id=str(i)
    )
    ids.append(str(i))
    documents.append(document)


if add_documents:
  vector_store.add_documents(documents=documents, ids=ids)

retriever= vector_store.as_retriever(
  search_type="mmr",
  search_kwargs={'k': 2, 'lambda_mult': 0.5}
)