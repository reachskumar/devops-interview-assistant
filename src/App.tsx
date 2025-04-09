// frontend/src/App.tsx
import { useRef } from 'react';
import Transcriber from './components/Transcriber';
import LandingPage from './components/LandingPage';

function App() {
  const assistantRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    assistantRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <LandingPage onStart={handleStart} />
      <div ref={assistantRef} className="pt-20">
        <Transcriber />
      </div>
    </div>
  );
}

export default App;
