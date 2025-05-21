import React, { useState } from "react";
import { Play } from "lucide-react";

interface ControlsProps {
  onStart: (text: string, color: string, speed: number) => void;
  onStop: () => void;
  hasStarted: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onStart, onStop, hasStarted }) => {
  const [text, setText] = useState("MATRIX");
  const [color, setColor] = useState("#00ff00");
  const [speed, setSpeed] = useState(5);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(text, color, speed);
  };
  const handleStop = (e: React.FormEvent) => {
    e.preventDefault();
    onStop();
  };

  return hasStarted ? (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-opacity-0 text-white rounded-t-xl transition-all duration-300 z-10">
      <button
        onClick={handleStop}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
      >STOP</button>
    </div>
  ) : (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-70 backdrop-blur-md text-white rounded-t-xl transition-all duration-300 z-10">
      <form
        onSubmit={handleStart}
        className="mx-auto flex flex-col md:flex-row justify-center items-center gap-4"
      >
        <div className="w-full md:w-2/5">
          <label
            htmlFor="text-input"
            className="block text-sm font-medium mb-1"
          >
            Text / Phrase
          </label>
          <input
            id="text-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono"
            placeholder="Enter text..."
            maxLength={20}
            required
          />
        </div>

        <div className="w-full md:w-1/5">
          <label
            htmlFor="color-input"
            className="block text-sm font-medium mb-1"
          >
            Rain Color
          </label>
          <div className="flex items-center gap-2">
            <input
              id="color-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-9 bg-transparent border-0 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono"
            />
          </div>
        </div>

        <div className="w-full md:w-1/5">
          <label
            htmlFor="speed-input"
            className="block text-sm font-medium mb-1"
          >
            Drop Speed: {speed}
          </label>
          <input
            id="speed-input"
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-9 accent-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={hasStarted}
          className={`w-full md:w-auto px-6 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
            hasStarted
              ? "bg-gray-700 cursor-not-allowed opacity-50"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          <Play size={18} />
          <span>Start</span>
        </button>
      </form>
    </div>
  );
};

export default Controls;
