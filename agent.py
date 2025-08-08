from openai import OpenAI
from dotenv import load_dotenv
import os
from promptBuilder import PromptBuilder

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=api_key 
)


def ask_openrouter(template: PromptBuilder) -> str:
    completion = client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct:free",
        messages=[
            {"role": "system", "content": template.system_prompt},
            {"role": "user", "content": template.user_prompt}
        ]
    )
    return completion.choices[0].message.content
