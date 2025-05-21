import React, { useEffect, useState } from "react";
import useMatrixRain from "../hooks/useMatrixRain";
import { AsciiArtConfig, MatrixRainConfig } from "../types";

interface MatrixRainCanvasProps {
  text: string;
  color: string;
  speed: number;
  isAnimating: boolean;
  onAnimationStart: () => void;
}

const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({
  text,
  color,
  speed,
  isAnimating,
  onAnimationStart,
}) => {
  // Configure the ASCII art
  const asciiConfig: AsciiArtConfig = {
    text,
    fontSize: 24,
    charWidth: 14, // Approximate width of monospace character
    charHeight: 24, // Height of the font
  };

  // Configure the Matrix rain
  const matrixConfig: MatrixRainConfig = {
    text,
    color,
    speed: speed / 2, // Scale down for better visual
    density: speed / 10, // Tie density to speed
  };

  // Use our custom hook for Matrix rain animation
  const { canvasRef, dimensions, startAnimation, stopAnimation } =
    useMatrixRain({
      config: matrixConfig,
      asciiConfig,
    });

  // Start or stop animation based on isAnimating prop
  useEffect(() => {
    if (isAnimating) {
      startAnimation();
      onAnimationStart();
    } else {
      stopAnimation();
    }
  }, [isAnimating, startAnimation, stopAnimation, onAnimationStart]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute top-0 left-0 w-full h-full bg-black"
    />
  );
};

export default MatrixRainCanvas;
