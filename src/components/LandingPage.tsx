// src/components/LandingPage.tsx

export default function LandingPage({ onStart }: { onStart: () => void }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20 px-6 flex flex-col items-center justify-center gap-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎤 DevOps Interview Assistant
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Practice your DevOps interview skills with real-time voice input and GPT-4 powered answers.
          </p>
          <button
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl"
          >
            🚀 Try It Now
          </button>
        </div>
      </div>
    );
  }
  