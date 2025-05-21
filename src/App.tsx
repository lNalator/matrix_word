import { useState } from "react";
import MatrixRainCanvas from "./components/MatrixRainCanvas";
import Controls from "./components/Controls";

function App() {
  const [animationConfig, setAnimationConfig] = useState({
    text: "",
    color: "#00ff00",
    speed: 5,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = (text: string, color: string, speed: number) => {
    setAnimationConfig({ text, color, speed });
    setIsAnimating(true);
  };

  const handleStop = () => {
    setIsAnimating(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-green-500 font-mono">
      {/* Matrix animation canvas */}
      {animationConfig.text && (
        <MatrixRainCanvas
          text={animationConfig.text}
          color={animationConfig.color}
          speed={animationConfig.speed}
          isAnimating={isAnimating}
          onAnimationStart={() => setIsAnimating(true)}
        />
      )}

      {/* Overlay welcome message if not animating */}
      {!isAnimating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-5">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-pulse">
            Matrix ASCII Rain
          </h1>
          <p className="text-lg md:text-xl max-w-xl">
            Enter your text, choose a color, and watch it rain down in a
            mesmerizing Matrix-style animation.
          </p>
        </div>
      )}

      {/* Controls overlay */}
      <Controls
        onStart={handleStart}
        onStop={handleStop}
        hasStarted={isAnimating}
      />
    </div>
  );
}

export default App;
