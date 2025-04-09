// frontend/src/components/Transcriber.tsx
import { useEffect, useRef, useState } from 'react';

const ASSEMBLYAI_SOCKET = 'wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000';
const API_KEY = 'c49ed2b607024e5186182c6340fb70a9';

export default function Transcriber() {
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => () => stopRecording(), []);

  const startRecording = async () => {
    const socket = new WebSocket(`${ASSEMBLYAI_SOCKET}&token=${API_KEY}`);
    socketRef.current = socket;

    socket.onmessage = (message) => {
      const res = JSON.parse(message.data);
      if (res.text) setTranscript(res.text);
    };

    socket.onopen = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Array = convertFloat32ToInt16(inputData);
        if (socket.readyState === WebSocket.OPEN) socket.send(int16Array);
      };

      setIsRecording(true);
    };
  };

  const stopRecording = () => {
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    socketRef.current?.close();
    setIsRecording(false);
    fetchAnswer(transcript);
  };

  const fetchAnswer = async (question: string) => {
    const res = await fetch('https://devops-api.onrender.com/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  const convertFloat32ToInt16 = (buffer: Float32Array) => {
    const buf = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) buf[i] = Math.min(1, buffer[i]) * 0x7fff;
    return buf.buffer;
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? '🛑 Stop Recording' : '🎙️ Start Talking'}
      </button>

      <div className="text-gray-200 text-center max-w-2xl">
        <p className="text-sm text-gray-400">Live Transcript:</p>
        <p className="text-lg whitespace-pre-wrap">{transcript}</p>
      </div>

      {answer && (
        <div className="bg-green-800 p-4 rounded w-full max-w-2xl mt-4">
          <p className="text-sm text-gray-300">GPT-4 Answer:</p>
          <p className="text-lg whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}
