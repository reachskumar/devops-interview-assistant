# backend/main.py
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from whisper_utils import transcribe_audio
from gpt_utils import ask_gpt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    text = transcribe_audio(audio_bytes)
    return {"transcription": text}

@app.post("/ask")
async def ask(question: str = Form(...)):
    answer = ask_gpt(question)
    return {"answer": answer}
