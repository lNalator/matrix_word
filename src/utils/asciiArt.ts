import { AsciiArtConfig } from '../types';

// ASCII art character map for simple rendering
const ASCII_CHARS = [
  '@', '#', '$', '%', '?', '*', '+', ';', ':', ',', '.'
];

/**
 * Generates a simple ASCII art representation of the input text
 * @param text The text to convert to ASCII art
 * @returns A 2D array representing the ASCII art
 */
export const generateAsciiArt = (text: string): string[][] => {
  // For simplicity, we'll just use the text as is but wrap each character
  // in a 2D array for the rendering engine
  const result: string[][] = [];
  
  // Simple implementation - just use the characters directly
  const chars = text.split('');
  result.push(chars);
  
  return result;
};

/**
 * Calculate the dimensions of the ASCII art for rendering
 */
export const calculateAsciiArtDimensions = (
  config: AsciiArtConfig,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number; width: number; height: number } => {
  const textWidth = config.text.length * config.charWidth;
  const textHeight = config.charHeight;
  
  return {
    x: (canvasWidth - textWidth) / 2,
    y: (canvasHeight - textHeight) / 2,
    width: textWidth,
    height: textHeight
  };
};

/**
 * Renders ASCII art on the canvas
 */
export const renderAsciiArt = (
  ctx: CanvasRenderingContext2D,
  config: AsciiArtConfig,
  color: string,
  brightness: number = 0.3
): void => {
  const { text, fontSize, charWidth, charHeight } = config;
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  
  const dimensions = calculateAsciiArtDimensions(config, canvasWidth, canvasHeight);
  
  // Set the font and color
  ctx.font = `${fontSize}px monospace`;
  
  // Parse the color to adjust brightness
  let r = 0, g = 0, b = 0;
  
  // Parse hex color
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  }
  
  // Adjust brightness
  const adjustedColor = `rgba(${r}, ${g}, ${b}, ${brightness})`;
  ctx.fillStyle = adjustedColor;
  
  // Render the text in the center
  ctx.fillText(text, dimensions.x, dimensions.y + fontSize);
};

/**
 * Check if a point overlaps with the ASCII art area
 */
export const isOverlappingAsciiArt = (
  x: number,
  y: number,
  config: AsciiArtConfig,
  canvasWidth: number,
  canvasHeight: number
): boolean => {
  const dimensions = calculateAsciiArtDimensions(config, canvasWidth, canvasHeight);
  
  return (
    x >= dimensions.x &&
    x <= dimensions.x + dimensions.width &&
    y >= dimensions.y &&
    y <= dimensions.y + dimensions.height
  );
};