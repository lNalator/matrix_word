import { useState, useEffect, useRef, useCallback } from "react";
import { RainDrop, AsciiArtConfig, MatrixRainConfig } from "../types";
import { renderAsciiArt, isOverlappingAsciiArt } from "../utils/asciiArt";

interface MatrixRainProps {
  config: MatrixRainConfig;
  asciiConfig: AsciiArtConfig;
}

const useMatrixRain = ({ config, asciiConfig }: MatrixRainProps) => {
  const [raindrops, setRaindrops] = useState<RainDrop[]>([]);
  const [brightness, setBrightness] = useState(0.3);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const lastDropTime = useRef<number>(0);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const lineHeight = asciiConfig.fontSize * 1.5;
  const totalLines = Math.floor(dimensions.height / lineHeight);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const createRaindrop = useCallback(() => {
    // const x = Math.random() * dimensions.width;

    const columns = Math.floor(dimensions.width / asciiConfig.charWidth);
    const column = Math.floor(Math.random() * columns);
    const x = column * asciiConfig.charWidth;

    return {
      x,
      y: 0,
      lineIndex: 0,
      // speed: (1 + Math.random()) * config.speed,
      lastDropTime: performance.now(),
      text: config.text,
      opacity: 0.8 + Math.random() * 0.2,
    };
  }, [config.text, config.speed, dimensions.width]);

  useEffect(() => {
    if (!config.text) return;

    const initialDrops: RainDrop[] = [];
    const dropCount = Math.floor((dimensions.width / asciiConfig.charWidth) * config.density);

    for (let i = 0; i < dropCount; i++) {
      const drop = createRaindrop();
      drop.lineIndex = Math.floor(Math.random() * totalLines);
      drop.y = drop.lineIndex * lineHeight;
      // drop.y = Math.random() * dimensions.height;
      initialDrops.push(drop);
    }

    setRaindrops(initialDrops);
  }, [config.text, config.density, dimensions, createRaindrop]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderAsciiArt(ctx, asciiConfig, config.color, brightness);

      let overlapping = false;

          // Calculate drop interval based on speed (inverse relationship)
      const dropInterval = 1000 - (1 + Math.random()) * config.speed * 90; // 100ms to 1000ms range

      const updatedRaindrops = raindrops
        .map((drop) => {
          const timeSinceLastDrop = timestamp - drop.lastDropTime;
          const updatedDrop = { ...drop };

          // Move drop to next line if enough time has passed
          if (timeSinceLastDrop >= dropInterval) {
            updatedDrop.lineIndex++;
            updatedDrop.y = updatedDrop.lineIndex * lineHeight;
            updatedDrop.lastDropTime = timestamp;
          }

          if (
            isOverlappingAsciiArt(
              updatedDrop.x,
              updatedDrop.y,
              asciiConfig,
              canvas.width,
              canvas.height
            )
          ) {
            overlapping = true;
          }

          // Render character
          ctx.font = "14px monospace";
          ctx.fillStyle = `rgba(${parseInt(config.color.slice(1, 3), 16)}, 
                            ${parseInt(config.color.slice(3, 5), 16)}, 
                            ${parseInt(config.color.slice(5, 7), 16)}, 
                            ${updatedDrop.opacity})`;
          ctx.fillText(updatedDrop.text, updatedDrop.x, updatedDrop.y);

          // Render trail
          const trailLength = 20;
          for (let i = 0; i < trailLength; i++) {
            const trailOpacity = updatedDrop.opacity * (1 - i / trailLength);
            ctx.fillStyle = `rgba(${parseInt(config.color.slice(1, 3), 16)}, 
                              ${parseInt(config.color.slice(3, 5), 16)}, 
                              ${parseInt(config.color.slice(5, 7), 16)}, 
                              ${trailOpacity})`;
            ctx.fillText(
              updatedDrop.text,
              updatedDrop.x,
              updatedDrop.y - i * 15
            );
          }

          return updatedDrop;
        })
        .filter((drop) => drop.y < canvas.height + 500);

      setBrightness((prev) => {
        if (overlapping) {
          return Math.min(1.0, prev + 0.1);
        } else {
          return Math.max(0.3, prev - 0.03);
        }
      });

      if (timestamp - lastDropTime.current > (50 / config.density) ) {
        updatedRaindrops.push(createRaindrop());
        lastDropTime.current = timestamp;
      }

      setRaindrops(updatedRaindrops);
      animationRef.current = requestAnimationFrame(animate);
    },
    [raindrops, config, asciiConfig, brightness, createRaindrop, dimensions]
  );

  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    dimensions,
    startAnimation,
    stopAnimation,
  };
};

export default useMatrixRain;
