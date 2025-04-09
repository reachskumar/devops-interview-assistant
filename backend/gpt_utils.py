import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def ask_gpt(question: str) -> str:
    prompt = f"You are a DevOps Interview Assistant. Answer the following question:\n{question}"

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert DevOps interview assistant."},
            {"role": "user", "content": prompt},
        ]
    )
    return response['choices'][0]['message']['content'].strip()
