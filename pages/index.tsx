import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-2">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-white tracking-tight drop-shadow">
          AI Content Generator
        </h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <textarea
            className="w-full p-3 bg-gray-700 text-white border-none rounded-lg mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={4}
            placeholder="Describe what content you want generated (e.g., 'Write a poem about summer')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50"
            onClick={handleGenerate}
            disabled={loading || !prompt}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {error && (
            <div className="mt-4 text-red-400 font-medium text-center">
              {error}
            </div>
          )}
          {result && (
            <motion.div
              className="mt-8 p-5 border border-gray-700 rounded-lg bg-gray-900 shadow-inner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="font-bold mb-3 text-blue-300">Result:</div>
              <div className="whitespace-pre-line text-gray-100 leading-relaxed font-mono">
                {result}
              </div>
            </motion.div>
          )}
        </div>
        <div className="mt-8 text-center text-gray-400 text-xs">
          Powered by OpenAI • Created by Jose Gutierrez
        </div>
      </div>
    </div>
  );
}
