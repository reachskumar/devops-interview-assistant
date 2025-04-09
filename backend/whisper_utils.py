import openai
import os
import io
from pydub import AudioSegment

openai.api_key = os.getenv("OPENAI_API_KEY")

def transcribe_audio(audio_bytes: bytes) -> str:
    audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)

    transcript = openai.Audio.transcribe(
        model="whisper-1",
        file=wav_io,
    )
    return transcript['text']
